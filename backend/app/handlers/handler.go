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
	var username string
	json.NewDecoder(r.Body).Decode(&username)
	fmt.Println("username :", username)
	fmt.Println(h.CheckUsername(username))
}
