package livechat

import (
	"encoding/json"
	"fmt"
	"server/db/models"
	"time"
)

type Timer struct {
	startCountdown chan bool
	resetCountdown chan int
	broadcastTime  chan int
	started        bool
}

func InitTimer() *Timer {
	return &Timer{
		startCountdown: make(chan bool, 2),
		resetCountdown: make(chan int, 2),
		broadcastTime:  make(chan int),
	}
}

// RunCountDown is a method of the Timer struct that runs the countdown logic.
// It continuously decrements the timeCounter until it reaches 0 or the countdown is reset.
// If the countdown is started and timeCounter is greater than 0, it broadcasts the current timeCounter value to all connected clients.
func (t *Timer) RunCountDown() {
	const startingTime = 15
	var timeCounter = startingTime

	for {
		select {
		case s := <-t.startCountdown:
			t.started = s
			if !s {
				timeCounter = startingTime
				t.broadcastTime <- timeCounter
			}
		case newTimer := <-t.resetCountdown:
			timeCounter = newTimer
		default:

			if t.started {
				if timeCounter <= 0 {
					t.started = false
					timeCounter = startingTime

				} else {
					timeCounter--
					time.Sleep(1 * time.Second)
					if t.started {
						t.broadcastTime <- timeCounter
					}
				}
			} else {
				t.started = <-t.startCountdown
			}
		}
	}
}

// CheckCountDown checks the number of clients connected to the hub and starts or stops the countdown timer accordingly.
// If the timer is already started and the number of clients drops below 2, the timer is stopped and the countdown is reset.
// If the number of clients is 2 or more and the timer is not already started, the timer is started.
func (h *Hub) CheckCountDown() {
	if h.timer.started {
		switch len(h.Clients) {
		case 0, 1:
			h.timer.resetCountdown <- 15
			h.timer.started = false
			h.timer.startCountdown <- false
			// fallthrough
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

// UpdateTimer updates the timer value and sends the updated value to all connected clients.
func (h *Hub) UpdateTimer(t int) {
	// fmt.Println("timer: ", h.timer)
	goTimer := &models.TimerMsg{
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
