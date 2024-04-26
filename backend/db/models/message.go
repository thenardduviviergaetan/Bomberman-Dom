package models

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

// type: "move", direction: "right", player: this.username, position:{x:this.posX, y:this.posY}
type MsgMove struct {
	Type      string      `json:"type"`
	Direction string      `json:"direction"`
	Player    string      `json:"player"`
	Position  interface{} `json:"position"`
}
