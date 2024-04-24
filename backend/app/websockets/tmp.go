package livechat

// case "request-map":
// 				if playerReady != len(h.Clients) {
// 					playerReady++
// 				} else {
// 					mapAtlas := RandomizeMap()
// 					mapToSend, err := json.Marshal(mapAtlas)
// 					if err != nil {
// 						fmt.Println(err)
// 						return
// 					}

// 					msg := &Message{
// 						Type: "map",
// 						Body: string(mapToSend),
// 					}
// 					msgToSend, err := json.Marshal(msg)
// 					if err != nil {
// 						fmt.Println(err)
// 						return
// 					}
// 					for _, client := range h.Clients {
// 						client.send <- msgToSend
// 					}
// 					playerReady = 0
// 				}

// // TODO move this func to middleware
// func RandomizeMap() [][]int {
// 	var baseMap = [][]int{
// 		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
// 		{1, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 1},
// 		{1, 4, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
// 		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
// 		{1, 4, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1},
// 		{1, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 1},
// 		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
// 	}

// 	for y, line := range baseMap {
// 		for x, block := range line {
// 			var r = rand.Intn(100)
// 			if block == 3 && r < 30 {
// 				baseMap[y][x] = 2
// 			}
// 		}
// 	}

// 	return baseMap
// }
