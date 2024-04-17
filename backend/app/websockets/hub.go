package livechat

import (
	"encoding/json"
	"server/app"
)

type Hub struct {
	clients    map[string]*Client
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	status     []*Client
}
type Message struct {
	Msg_type   string `json:"msg_type"`
	Content    string `json:"content"`
	TypeTarget string `json:"type_target"`
	Target     string `json:"target"`
	Sender     string `json:"sender"`
	SenderName string `json:"sender_name"`
	Date       string `json:"date"`
	Image      string `json:"image"`
}

func InitHub(app *app.App) *Hub {
	users := middleware.GetAllUsers()
	offlineInit := make([]*Client, 0)
	for _, user := range users {
		client := &Client{UUID: user[0], Username: user[1], send: make(chan []byte)}
		offlineInit = append(offlineInit, client)
	}
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]*Client),
		status:     offlineInit,
	}
}

func (h *Hub) Run(app *app.App) {
	for {
		select {
		case client := <-h.register:
			client.Online = true
			h.clients[client.UUID] = client
			h.status = Remove(h.status, client)
			h.status = append(h.status, client)
		case client := <-h.unregister:
			if _, ok := h.clients[client.UUID]; ok {
				client.Online = false
				close(h.clients[client.UUID].send)
				delete(h.clients, client.UUID)
			}
		case message := <-h.broadcast:
			msg := &Message{}
			json.Unmarshal(message, msg)
			switch msg.Msg_type {

			case "chat":
				h.SendMessageToTarget(app, msg.Target, message)
			case "typing":
				typing := &Message{Msg_type: "typing", Target: msg.Target, Sender: msg.Sender}
				if msg.Content == "typing" {
					typing.Content = "typing"
				} else {
					typing.Content = "stop"
				}
				jsonTyping, _ := json.Marshal(typing)
				h.SendMessageToTarget(app, msg.Target, jsonTyping)
			}
		}
	}
}

func (h *Hub) SendMessageToTarget(app *app.App, UUID string, message []byte) {
	msg := &Message{}
	json.Unmarshal(message, msg)
	// msg.SenderName = middleware.GetUsersname(app.DB.DB, msg.Sender)
	message, _ = json.Marshal(msg)
	if msg.Msg_type == "chat" {
		for _, client := range h.clients {
			if client.UUID == msg.Target || client.UUID == msg.Sender {
				client.send <- message
			}
		}
	}
	if msg.Msg_type == "typing" {
		if client, ok := h.clients[UUID]; ok {
			if client.UUID == msg.Target {
				client.send <- message
			}
		}
	}
}
func Remove(clients []*Client, c *Client) []*Client {
	index := -1
	for i, v := range clients {
		if v.UUID == c.UUID {
			index = i
			break
		}
	}
	if index == -1 {
		return clients
	}
	return append(clients[:index], clients[index+1:]...)
}
