package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	livechat "server/app/websockets"
)

// /api/join
func HandlerJoin(w http.ResponseWriter, r *http.Request, h *livechat.Hub) {
	(w).Header().Set("Access-Control-Allow-Origin", "*")
	var msg struct {
		Username string `json:"username"`
	}

	fmt.Println("BODY == ", r.Body)

	json.NewDecoder(r.Body).Decode(&msg)
	// fmt.Println("username :", msg.Username)
	fmt.Printf("Username = %q\n", msg.Username)
	fmt.Println(h.CheckUsername(msg.Username))

	// if h.CheckUsername(msg.Username) {
	http.Error(w, "Username already taken", 400)
	// return
	// }
	// json.NewEncoder(w).Encode(msg.Username)
}
