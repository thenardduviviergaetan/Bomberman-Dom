import Component from "../component.js";
import Map from "./map.js";
import {Player} from "./player.js";

let lastUpdateTime = performance.now()
let frameCount = 0
let fps = document.getElementById("fps")
//TODO make a div without the outer walls where the player will be in
export default class Game extends Component {
    constructor(props, ws, username, players) {
        super("section", props);
        this.username = username;
        this.ws = ws;

        this.size = 19;
        this.atlas = this.ws.sendMessage({ type: "map" });

        this.players = players
        console.log("PLAYERS:", this.players);
        
        this.currentPlayer = new Player({ id: this.username, className: "player-sprite" }, this.ws, this.username)

        this.ws.onMessage((message) => {
            if (message.type === "map") {
                this.atlas = message.body
                const map = new Map(this.atlas)
                const positions = [
                    {top: "32px", left: "32px"},
                    {top: `${608-64}px`, left: `${608-64}px`},
                    {top: "32px", left: `${608-64}px`},
                    {top: `${608-64}px`, left: "32px"}
                ]
                this.players.forEach((player, index) => {
                    if (player.username !== this.username) {
                        let newPlayer = new Component("div", { id: player.children[0], className: "player-sprite" })
                        newPlayer.posX = positions[index].left
                        newPlayer.posY = positions[index].top
                        map.addElement(newPlayer)
                    } else {
                        this.currentPlayer.posX = positions[index].left
                        this.currentPlayer.posY = positions[index].top
                    }
                })
                map.addElement(this.currentPlayer)
                this.addElement(map)
                this.update()
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

    updateState(){
        this.currentPlayer.initListeners()
    }


}