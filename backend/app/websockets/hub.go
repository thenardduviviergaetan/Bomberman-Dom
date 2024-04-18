package livechat

import (
	"encoding/json"
	"fmt"
)

type Hub struct {
	clients    map[string]*Client
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

type Message struct {
	Type   string `json:"type"`
	Body   string `json:"body"`
	Sender string `json:"sender"`
}

func InitHub() *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) CheckUsername(username string) bool {
	_, ok := h.clients[username]

	return ok
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client.Username] = client
			message := &Message{
				Type:   "join",
				Body:   client.Username + "joined the chat",
				Sender: client.Username,
			}
			joinedMessage, err := json.Marshal(message)
			if err != nil {
				fmt.Println(err)
				return
			}
			for _, c := range h.clients {
				c.send <- joinedMessage
			}

		case client := <-h.unregister:
			if _, ok := h.clients[client.Username]; ok {
				message := &Message{
					Type:   "leave",
					Body:   client.Username + "left the chat",
					Sender: client.Username,
				}
				leftMessage, err := json.Marshal(message)
				if err != nil {
					fmt.Println(err)
					return
				}
				for _, c := range h.clients {
					c.send <- leftMessage
				}
				close(h.clients[client.Username].send)
				delete(h.clients, client.Username)
			}

		case message := <-h.broadcast:
			var msg *Message
			json.Unmarshal(message, &msg)
			switch msg.Type {
			case "chat":
				for _, client := range h.clients {
					client.send <- message
				}
			}
		}
	}
}
