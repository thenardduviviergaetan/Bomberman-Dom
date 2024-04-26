package livechat

import (
	"encoding/json"
	"fmt"
	m "server/db/models"
)

type Game struct {
	// player1       chan *Client
	// player2       chan *Client
	// player3       chan *Client
	// player4       chan *Client
	broadcastMove chan []byte
}

func InitGame() *Game {
	return &Game{
		// player1:       make(chan *Client),
		// player2:       make(chan *Client),
		// player3:       make(chan *Client),
		// player4:       make(chan *Client),
		broadcastMove: make(chan []byte, 2),
	}
}

// func (g *Game) StartGame() {
// 	for {
// 		select {
// 		case message := <-g.broadcastMove:
// 			var msg *m.MsgMove
// 			json.Unmarshal(message, &msg)
// 		}
// 	}
// }

func (h *Hub) SendPosition(message []byte) {
	var msg *m.MsgMove
	json.Unmarshal(message, &msg)
	fmt.Println("Message == ", string(message))
	for _, client := range h.Clients {
		if msg.Player != client.Username {
			client.send <- message
		}
	}
}
