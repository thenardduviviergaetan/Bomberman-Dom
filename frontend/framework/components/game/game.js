import Component from "../component.js";
import Map from "./map.js";
import { CurrentPlayer, Player } from "./player.js";

let lastUpdateTime = performance.now()
let frameCount = 0
let fps = document.getElementById("fps")

export default class Game extends Component {
    constructor(props, ws, username, players) {
        super("section", props);
        this.username = username;
        this.ws = ws;

        this.size = 19;
        this.atlas = this.ws.sendMessage({ type: "map" });

        this.players = players
        console.log("PLAYERS:", this.players);

        this.ws.onMessage((message) => {
            if (message.type === "map") {
                this.atlas = message.body
                const map = new Map(this.atlas)
                const positions = [
                    { top: -608 +32, left: 32 },
                    { top: -64 , left: 608 - 64 },
                    { top: -608+32, left: 608 - 64 },
                    { top: -64, left: 32 }
                ]
                this.players.forEach((player, index) => {

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
                        this.players[index] = newPlayer
                    } else {
                        this.currentPlayer = new CurrentPlayer(
                            props
                            , this.ws,
                            this.username)

                        map.addElement(this.currentPlayer)
                        this.players[index] = this.currentPlayer
                    }
                })

                this.addElement(map)
                this.update()
            }

            if (message.type === "move") {
                console.log("move received: ", message);
                const player = this.players.find(player => player.props.id === message.sender)
                player.move(message.position)
            }
        })
        this.FRAMERATE = 1000 / 60;
        this.delta = 0;
        this.lastTime = 0


        this.gameLoop()
    }

    gameLoop(timestamp) {
        let now = performance.now()
        let delta = now - lastUpdateTime
        if (delta >= 1000) {
            fps.textContent = `${frameCount} FPS`
            frameCount = 0;
            lastUpdateTime = now;
        }
        const deltaTime = timestamp - this.lastTime
        if (deltaTime >= this.FRAMERATE) {
            this.lastTime = timestamp
            this.updateState()
            frameCount++
        }
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    }

    updateState() {
    }


}