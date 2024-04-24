package livechat

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"
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

type TimerMsg struct {
	Type string `json:"type"`
	Body int    `json:"body"` // Body of the message
}

type Timer struct {
	startCountdown chan bool
	resetCountdown chan int
	broadcastTime  chan int
	started        bool
}

func initTimer() *Timer {
	return &Timer{
		startCountdown: make(chan bool),
		resetCountdown: make(chan int, 2),
		broadcastTime:  make(chan int),
	}
}

// InitHub initializes a new instance of the Hub struct.
// It returns a pointer to the newly created Hub.
func InitHub() *Hub {
	return &Hub{
		Clients:    make(map[string]*Client),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		timer:      initTimer(),
	}
}

// CheckUsername checks if a username is already taken by a client.
// It returns true if the username is already taken, false otherwise.
func (h *Hub) CheckUsername(username string) bool {
	_, exist := h.Clients[username]
	return exist
}

// LaunchRoutines launches the necessary goroutines for the Hub.
// It starts the main Run goroutine and the timer's runCountDown goroutine.
func (h *Hub) LaunchRoutines() {
	go h.Run()
	go h.timer.runCountDown()
}

// runCountDown is a method of the Timer struct that runs the countdown logic.
// It continuously decrements the timeCounter until it reaches 0 or the countdown is reset.
// If the countdown is started and timeCounter is greater than 0, it broadcasts the current timeCounter value to all connected clients.
func (t *Timer) runCountDown() {
	const startingTime = 15
	var timeCounter = startingTime

	for {
		select {
		case s := <-t.startCountdown:
			t.started = s
		case newTimer := <-t.resetCountdown:
			// timeCounter = startingTime
			timeCounter = newTimer
		default:
			if timeCounter <= 0 {
				t.started = false
			} else if t.started {
				timeCounter--
				time.Sleep(1 * time.Second)

				t.broadcastTime <- timeCounter
			}
		}
	}
}

// checkCountDown checks the number of clients connected to the hub and starts or stops the countdown timer accordingly.
// If the timer is already started and the number of clients drops below 2, the timer is stopped and the countdown is reset.
// If the number of clients is 2 or more and the timer is not already started, the timer is started.
func (h *Hub) checkCountDown() {
	if h.timer.started {
		switch len(h.Clients) {
		case 1:
			h.timer.started = false
			fallthrough
		case 2, 3:
			h.timer.resetCountdown <- 15
		case 4:
			h.timer.resetCountdown <- 10
		}
	} else if len(h.Clients) >= 2 {
		h.timer.started = true
		h.timer.startCountdown <- true
	}
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
			var msg *Message
			json.Unmarshal(message, &msg)
			switch msg.Type {
			case "chat":
				for _, client := range h.Clients {
					client.send <- message
				}
			case "request-map":
				h.GenerateMap(playerReady)
			}
		}
	}
}

// GenerateMap generates a map and sends it to all connected clients.
// It takes the number of players ready as a parameter and checks if all players are ready.
// If all players are ready, it generates a random map, converts it to JSON, and sends it to all clients.
// If there is an error during the JSON conversion or sending the message, it prints the error and returns.
// After sending the map, it resets the playerReady count to 0.
func (h *Hub) GenerateMap(playerReady int) {

	if playerReady != len(h.Clients) {
		playerReady++
	} else {
		h.gameStarted = true
		mapAtlas := RandomizeMap()
		mapToSend, err := json.Marshal(mapAtlas)
		if err != nil {
			fmt.Println(err)
			return
		}

		msg := &Message{
			Type: "map",
			Body: string(mapToSend),
		}
		msgToSend, err := json.Marshal(msg)
		if err != nil {
			fmt.Println(err)
			return
		}
		for _, client := range h.Clients {
			client.send <- msgToSend
		}
		playerReady = 0
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
	for _, c := range h.Clients {
		c.send <- joinedMessage
	}
	h.checkCountDown()
}

// UnregisterClient removes a client from the hub and sends a leave message to the remaining clients.
// If the client is successfully removed, it also checks the countdown for the game.
func (h *Hub) UnregisterClient(client *Client) {
	if _, ok := h.Clients[client.Username]; ok {
		connectedList := make([]string, 0)

		for _, c := range h.Clients {
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
		for _, c := range h.Clients {
			if c.Username != client.Username {
				c.send <- leftMessage
			}
		}
		close(h.Clients[client.Username].send)
		delete(h.Clients, client.Username)

		h.checkCountDown()
	}
}

// UpdateTimer updates the timer value and sends the updated value to all connected clients.
func (h *Hub) UpdateTimer(t int) {
	// fmt.Println("timer: ", h.timer)
	goTimer := &TimerMsg{
		Type: "update-timer",
		Body: t,
	}

	toSend, err := json.Marshal(goTimer)
	if err != nil {
		fmt.Println(err)
	}

	for _, client := range h.Clients {
		client.send <- toSend
	}
}

// RandomizeMap randomizes the given base map by replacing certain blocks with a different value.
// It returns the randomized map.
func RandomizeMap() [][]int {
	var baseMap = [][]int{
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
		{1, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 1},
		{1, 4, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 4, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1},
		{1, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 1},
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
	}

	for y, line := range baseMap {
		for x, block := range line {
			var r = rand.Intn(100)
			if block == 3 && r < 30 {
				baseMap[y][x] = 2
			}
		}
	}

	return baseMap
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
