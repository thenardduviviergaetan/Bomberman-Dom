package app

type App struct {
}

func NewApp() *App {
	return &App{}
}

// ServeHTTP handles the incoming HTTP requests and routes them to the appropriate handlers.
func (a *App) ServeHTTP() {}
