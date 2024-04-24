package main

import (
	"server/app"
	livechat "server/app/websockets"
	"server/server"
)

// main is the entry point of the application.
// It initializes the database connection, applies migrations,
// creates the app instance, and starts the server.
func main() {
	app := app.NewApp()
	server := server.NewServer(app)
	hub := livechat.InitHub()
	go hub.Run()

	server.Start(hub)
	// server.Start(database.DB)
}
