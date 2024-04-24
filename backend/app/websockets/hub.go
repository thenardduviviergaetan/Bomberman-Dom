package livechat

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"
)

// Hub represents a WebSocket hub that manages the Clients and their connections.
type Hub struct {
	Clients    map[string]*Client // A map of client IDs to client instances.
	broadcast  chan []byte        // A channel used for broadcasting messages to all clients.
	register   chan *Client       // A channel used for registering new clients.
	unregister chan *Client       // A channel used for unregistering clients.
	timer      *Timer
	// timer      int                // A int to set the duration of the timer
	// timerChan  chan int
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
	resetCountdown chan bool
	broadcastTime  chan int
	started        bool
}

func initTimer() *Timer {
	return &Timer{
		startCountdown: make(chan bool),
		resetCountdown: make(chan bool, 1),
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

func (h *Hub) LaunchRoutines() {
	go h.Run()
	go h.timer.runCountDown()
}

func (t *Timer) runCountDown() {
	const startingTime = 15
	var timeCounter = startingTime

	for {
		select {
		case s := <-t.startCountdown:
			t.started = s
		case <-t.resetCountdown:
			fmt.Println("Starting Time =", startingTime)
			timeCounter = startingTime
			t.broadcastTime <- -1
		default:
			if !t.started || timeCounter <= 0 {
				continue
			}

			timeCounter--
			fmt.Println("TimerCounter ==", timeCounter)
			time.Sleep(1 * time.Second)

			if timeCounter <= 10 {
				t.broadcastTime <- timeCounter
			}
		}
	}
}

// func (h *Hub) SetCountDown(players int) {
// 	// stop := time.After(10*time.Second)

// 	fmt.Println("players: ", players)
// 	if players >= 2 && players < 5 {
// 		for h.timer >= 0 {
// 			// fmt.Println("h.timer: ", h.timer)
// 			// goTimer := &Timer{
// 			// 	Type: "update-timer",
// 			// 	Body: h.timer,
// 			// }

// 			// toSend, err := json.Marshal(goTimer)
// 			// if err != nil {
// 			// 	fmt.Println(err)
// 			// }
// 			// // h.broadcast <- toSend
// 			// // for _, client := range h.Clients {
// 			// // 	client.send <- toSend
// 			// // }
// 			h.timerChan <- h.timer
// 			time.Sleep(1 * time.Second)
// 			h.timer--
// 		}
// 	}
// }

func (h *Hub) checkCountDown() {
	switch {
	case len(h.Clients) >= 2 && !h.timer.started:
		fmt.Println("Sending start to countdown")
		h.timer.startCountdown <- true
	case len(h.Clients) >= 2:
		fmt.Println("Reseting Countdown")
		h.timer.resetCountdown <- true
		fmt.Println("Reset done")
	case h.timer.started:
		fmt.Println("Stopping and reseting countdowns")
		h.timer.startCountdown <- false
		h.timer.resetCountdown <- true
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
			h.RegisterClient(client)
			h.checkCountDown()
			// go h.SetCountDown()

		case client := <-h.unregister:
			h.UnregiserClient(client)
			h.checkCountDown()
		case t := <-h.timer.broadcastTime:
			// go h.SetCountDown()
			h.UpdateTimer(t)
		case message := <-h.broadcast:
			var msg *Message
			json.Unmarshal(message, &msg)
			switch msg.Type {
			case "chat":
				fmt.Println("chat message: ", string(message))
				for _, client := range h.Clients {
					client.send <- message
				}
			case "request-map":
				if playerReady != len(h.Clients) {
					playerReady++
				} else {
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
		}
	}
}

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
	// h.timer = 15
}

func (h *Hub) UnregiserClient(client *Client) {
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
			c.send <- leftMessage
		}
		close(h.Clients[client.Username].send)
		delete(h.Clients, client.Username)
	}
}

// func (h *Hub) SetCountDown() {
// 	if len(h.Clients) >= 2 && len(h.Clients) < 5 {
// 		if h.timer == 0 {
// 			h.timer = 15
// 			go h.StartCountDown()
// 		}
// 	}
// }

// func (h *Hub) StartCountDown() {
// 	for h.timer >= 0 && len(h.Clients) >= 2 {
// 		h.timerChan <- h.timer
// 		time.Sleep(1 * time.Second)
// 		h.timer--
// 	}
// }

func (h *Hub) UpdateTimer(t int) {
	fmt.Println("timer: ", h.timer)
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

// TODO move this func to middleware
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
