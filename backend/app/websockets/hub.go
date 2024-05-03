package livechat

import (
	"encoding/json"
	"fmt"
	middleware "server/app/middlewares"
	"server/db/models"
)

// Hub represents a WebSocket hub that manages the Clients and their connections.
type Hub struct {
	Clients     map[string]*Client // A map of client IDs to client instances.
	broadcast   chan []byte        // A channel used for broadcasting messages to all clients.
	register    chan *Client       // A channel used for registering new clients.
	unregister  chan *Client       // A channel used for unregistering clients.
	timer       *Timer
	gameStarted bool
}

// InitHub initializes a new instance of the Hub struct.
// It returns a pointer to the newly created Hub.
func InitHub() *Hub {
	return &Hub{
		Clients:    make(map[string]*Client),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		timer:      InitTimer(),
	}
}

// CheckUsername checks if a username is already taken by a client.
// It returns true if the username is already taken, false otherwise.
func (h *Hub) CheckUsername(username string) bool {
	_, exist := h.Clients[username]
	return exist
}

// LaunchRoutines launches the necessary goroutines for the Hub.
// It starts the main Run goroutine and the timer's RunCountDown goroutine.
func (h *Hub) LaunchRoutines() {
	go h.Run()
	go h.timer.RunCountDown()
}

// Run starts the main event loop of the Hub, handling incoming events from Clients.
// It continuously listens for events such as client registration, unregistration, and broadcasting messages.
// This method runs in a separate goroutine and should be called after initializing the Hub.
func (h *Hub) Run() {
	var playerReady = 0
	for {
		select {
		case client := <-h.register:
			if !h.gameStarted {
				h.RegisterClient(client)
			}
		case client := <-h.unregister:
			h.UnregisterClient(client)

		case t := <-h.timer.broadcastTime:
			h.UpdateTimer(t)

		case message := <-h.broadcast:
			var msg *models.Message
			json.Unmarshal(message, &msg)
			fmt.Println("MSG: ", msg)
			switch msg.Type {
			case "chat":
				for _, client := range h.Clients {
					client.send <- message
				}

			case "map":
				playerReady++
				if playerReady != len(h.Clients) {
				} else {
					jsonMap := middleware.GenerateMap()
					for _, client := range h.Clients {
						client.send <- jsonMap
					}
					playerReady = 0
				}
			case "move":
				var moveMsg *models.MoveMessage

				json.Unmarshal(message, &moveMsg)

				jsonMove, err := json.Marshal(moveMsg)
				if err != nil {
					fmt.Println(err)
					return
				}

				for _, client := range h.Clients {
					client.send <- jsonMove
				}
			}

		}
	}
}

// RegisterClient registers a new client in the hub.
// It adds the client to the hub's Clients map and sends a join message to all connected clients.
// The join message includes the client's username and the list of currently connected clients.
// It also checks if the countdown can be started.
func (h *Hub) RegisterClient(client *Client) {
	h.Clients[client.Username] = client

	connectedList := make([]string, 0)

	for _, c := range h.Clients {
		connectedList = append(connectedList, c.Username)
	}

	message := &models.Connected{
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
	for _, c := range h.Clients {
		c.send <- joinedMessage
	}
	h.CheckCountDown()
}

// UnregisterClient removes a client from the hub and sends a leave message to the remaining clients.
// If the client is successfully removed, it also checks the countdown for the game.
func (h *Hub) UnregisterClient(client *Client) {
	if _, ok := h.Clients[client.Username]; ok {
		connectedList := make([]string, 0)

		for _, c := range h.Clients {
			connectedList = append(connectedList, c.Username)
		}

		message := &models.Connected{
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
		for _, c := range h.Clients {
			if c.Username != client.Username {
				c.send <- leftMessage
			}
		}
		close(h.Clients[client.Username].send)
		delete(h.Clients, client.Username)

		h.CheckCountDown()
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
