package models

// Message represents a WebSocket message.
type Message struct {
	Type   string `json:"type"`   // Type specifies the type of the message.
	Body   string `json:"body"`   // Body contains the content of the message.
	Sender string `json:"sender"` // Sender identifies the sender of the message.
}

// Message represents a WebSocket message.
// type BombMessage struct {
// 	Type     string         `json:"type"`     // Type specifies the type of the message.
// 	Body     string         `json:"body"`     // Body contains the content of the message.
// 	Sender   string         `json:"sender"`   // Sender identifies the sender of the message.
// 	Position map[string]int `json:"position"` // Position contains pos x and y
// 	BombDate string         `json:"date"`     // BombDate contains date for posing bomb
// }

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

type MoveMessage struct {
	Type      string      `json:"type"`
	Sender    string      `json:"sender"`
	Direction string      `json:"direction"`
	Position  interface{} `json:"position"`
}
