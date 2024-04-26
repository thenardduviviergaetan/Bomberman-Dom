import Component from "../component.js";
import Map from "./map.js";
import Player from "./player.js";

let lastUpdateTime = performance.now()
let frameCount = 0
let fps = document.getElementById("fps")
//TODO make a div without the outer walls where the player will be in
export default class Game extends Component {
    constructor(props, ws, username) {
        super("section", props);
        this.username = username;
        this.ws = ws;

        this.size = 19;
        this.atlas = this.ws.sendMessage({ type: "map" });
        this.ws.onMessage((message) => {
            if (message.type === "map") {
                this.atlas = message.body
                const map = new Map(this.atlas)
                // FIXME passing the game to add event on div game
                const player1 = new Player({ id: this.username, className: "player-sprite", style: "top:32px;left:32px;"},this) 
                map.addElement(player1)
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
            // this.updateState()
            frameCount++
        }
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp))
    }


}