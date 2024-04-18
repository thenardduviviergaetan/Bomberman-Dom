package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	livechat "server/app/websockets"
)

// /api/join
func HandlerJoin(w http.ResponseWriter, r *http.Request, h *livechat.Hub) {
	// if r.Method != http.MethodPost {
	// 	w.WriteHeader(http.StatusMethodNotAllowed)
	// 	return
	// }
	// var username string
	var msg struct {
		Username string `json:"username"`
	}

	fmt.Println("BODY == ", r.Body)

	json.NewDecoder(r.Body).Decode(&msg)
	// fmt.Println("username :", msg.Username)
	fmt.Printf("Username = %q\n", msg.Username)
	fmt.Println(h.CheckUsername(msg.Username))
}
