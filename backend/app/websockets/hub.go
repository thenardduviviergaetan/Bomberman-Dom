package livechat

import (
	"encoding/json"
	"fmt"
)

// Hub represents a WebSocket hub that manages the clients and their connections.
type Hub struct {
	clients    map[string]*Client // A map of client IDs to client instances.
	broadcast  chan []byte        // A channel used for broadcasting messages to all clients.
	register   chan *Client       // A channel used for registering new clients.
	unregister chan *Client       // A channel used for unregistering clients.
}

// Message represents a WebSocket message.
type Message struct {
	Type   string `json:"type"`   // Type specifies the type of the message.
	Body   string `json:"body"`   // Body contains the content of the message.
	Sender string `json:"sender"` // Sender identifies the sender of the message.
}

// Connected represents a message sent over websockets to notify clients about connected users.
type Connected struct {
	Type      string   `json:"type"`      // Type of the message
	Body      string   `json:"body"`      // Body of the message
	Sender    string   `json:"sender"`    // Sender of the message
	Connected []string `json:"connected"` // List of connected users
}

// InitHub initializes a new instance of the Hub struct.
// It returns a pointer to the newly created Hub.
func InitHub() *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		// connected:  make([]string, 0),
	}
}

// CheckUsername checks if a username is already taken by a client.
// It returns true if the username is already taken, false otherwise.
func (h *Hub) CheckUsername(username string) bool {
	_, exist := h.clients[username]
	return exist
}

// Run starts the main event loop of the Hub, handling incoming events from clients.
// It continuously listens for events such as client registration, unregistration, and broadcasting messages.
// This method runs in a separate goroutine and should be called after initializing the Hub.
func (h *Hub) Run() {
	// var started bool
	for {
		select {
		case client := <-h.register:

			h.clients[client.Username] = client

			connectedList := make([]string, 0)

			for _, c := range h.clients {
				connectedList = append(connectedList, c.Username)
			}

			message := &Connected{
				Type:      "join",
				Body:      client.Username + " joined the chat",
				Sender:    client.Username,
				Connected: connectedList,
			}
			fmt.Printf("%s Joined the chat !\n", client.Username)
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
				connectedList := make([]string, 0)

				for _, c := range h.clients {
					connectedList = append(connectedList, c.Username)
				}

				message := &Connected{
					Type:      "leave",
					Body:      client.Username + " left the chat",
					Sender:    client.Username,
					Connected: removeElement(connectedList, client.Username),
				}
				fmt.Printf("%s left the chat !\n", client.Username)

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

// removeElement removes the specified clientDisconnected from the connected slice and returns the updated slice.
func removeElement(connected []string, clientDisconnected string) []string {
	fmt.Println("connected before: ", connected)
	var newTab []string
	for _, user := range connected {
		if clientDisconnected != user {
			newTab = append(newTab, user)
		}
	}
	newConnected := []string{}
	newConnected = append(newConnected, newTab...)
	fmt.Println("connected after: ", newConnected)
	return newConnected
}
