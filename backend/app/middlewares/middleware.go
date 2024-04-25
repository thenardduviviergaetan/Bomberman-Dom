package middleware

import (
	"encoding/json"
	"math/rand"
)

// RandomizeMap randomizes the given base map by replacing certain blocks with a different value.
// It returns the randomized map.
func RandomizeMap() [][]int {
	var baseMap = [][]int{
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
		{1, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 1},
		{1, 4, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1},
		{1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1},
		{1, 4, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 4, 1},
		{1, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 1},
		{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
	}

	for y, line := range baseMap {
		for x, block := range line {
			var r = rand.Intn(100)
			if block == 3 && r < 30 {
				baseMap[y][x] = 2
			}
		}
	}
	return baseMap
}

func GenerateMap() []byte {
	mapMsg := struct {
		Type string      `json:"type"`
		Body interface{} `json:"body"`
	}{}

	mapMsg.Type = "map"
	mapMsg.Body = RandomizeMap()

	jsonMapToSend, _ := json.Marshal(mapMsg)
	return jsonMapToSend

	/*
		TheOldestBrother Version
		data := struct {
			Map        [][]int
			SpawnPoint int
		}{
			Map: RandomizeMap(),
		}

		mapMsg := struct {
			Type string      `json:"type"`
			Body interface{} `json:"body"`
			Sender string `json:"sender"`
		}{
			Type: "map",
			Body: data,
		}

		jsonMapToSend, _ := json.Marshal(mapMsg)
		return jsonMapToSend
	*/
}

func GenerateMap2() []byte {
	data := struct {
		Map        [][]int
		SpawnPoint int
	}{
		Map: RandomizeMap(),
	}

	mapMsg := struct {
		Type   string      `json:"type"`
		Body   interface{} `json:"body"`
		Sender string      `json:"sender"`
	}{
		Type: "map",
		Body: data,
	}

	jsonMapToSend, _ := json.Marshal(mapMsg)
	return jsonMapToSend
}
