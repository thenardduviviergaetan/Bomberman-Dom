import Component from "../component.js";
import Map from "./map.js";
import { CurrentPlayer, Player } from "./player.js";


export default class Game extends Component {
    constructor(props, ws, username, readyPlayers) {
        super("section", props);
        this.username = username;
        this.ws = ws;

        this.size = 19;
        this.atlas = this.ws.sendMessage({ type: "map" });

        this.readyPlayers = readyPlayers
        this.playerMoveQueue = []

        this.ws.onMessage((message) => {
            if (message.type === "map") {
                this.initMap(message)
            }

            if (message.type === "move") {
                this.updatePlayers(message)
            }
        })


        this.FRAMERATE = 1000 / 60;
        this.lastTime = 0

        this.fps = document.getElementById("fps")
        this.lastUpdateTime = Date.now()
        this.frameCount = 0

        this.gameLoop()
    }

    initMap(message){
        this.atlas = message.body
        const map = new Map(this.atlas)
        const positions = [
            { top: -608 + 32, left: 32 },
            { top: -64, left: 608 - 64 },
            { top: -608 + 32, left: 608 - 64 },
            { top: -64, left: 32 }
        ]
        this.readyPlayers.forEach((player, index) => {

            const props = {
                id: player.children[0],
                className: "player-sprite",
                style: {
                    top: positions[index].top,
                    left: positions[index].left,
                }
            }

            if (player.children[0] !== this.username) {
                const newPlayer = new Player(props)
                map.addElement(newPlayer)
                this.readyPlayers[index] = newPlayer
            } else {
                this.currentPlayer = new CurrentPlayer(
                    props
                    , this.ws,
                    this.username)

                map.addElement(this.currentPlayer)
                this.readyPlayers[index] = this.currentPlayer
            }
        })

        this.addElement(map)
        this.update()
    }

    updatePlayers(message) {
        const player = this.readyPlayers.find(player => player.props.id === message.sender)
        this.playerMoveQueue.push({ player, position: message.position })
    }

    gameLoop(timestamp) {
        this.fpsCounter()
        const deltaTime = timestamp - this.lastTime
        if (deltaTime >= this.FRAMERATE) {
            this.lastTime = timestamp
            this.updateState()
        }
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    }

    updateState() {
        this.playerMoveQueue.forEach((player) => {
            player.player.move(player.position)
        })
        this.playerMoveQueue = []
    }

    fpsCounter() {
        if (Date.now() - this.lastUpdateTime >= 1000) {
            this.fps.textContent = `FPS: ${this.frameCount}`
            this.frameCount = 0
            this.lastUpdateTime = Date.now()
        }
        this.frameCount++
    }
}