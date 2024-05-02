import Component from "../component.js";
import { debounce } from "../../engine/utils.js";

export class Player extends Component {
    constructor(props, ws, username) {
        super("div", props);
        this.ws = ws;
        this.username = username;
        this.posX = props.style.left;
        this.posY = props.style.top;
        this.draw();
    }

    draw() {
        this.props.style = `transform: translate(${this.posX}px, ${this.posY}px);`;
    }

    move(position) {
        this.posX = position.x;
        this.posY = position.y;
        requestAnimationFrame(() => {
            this.props.style = `transform: translate(${this.posX}px, ${this.posY}px);`;
            this.updateDOM();
        });
    }
}

export class CurrentPlayer extends Player {
    constructor(props, ws, username) {
        super(props, ws, username);
        this.movementSize = 4;
        window.addEventListener("keydown", debounce((event) => {
            let direction;
            switch (event.key) {
                case "ArrowUp":
                case "z":
                    direction = "up";
                    this.posY -= this.movementSize;

                    break;
                case "ArrowDown":
                case "s":
                    direction = "down";
                    this.posY += this.movementSize;

                    break;
                case "ArrowLeft":
                case "q":
                    direction = "left";
                    this.posX -= this.movementSize;

                    break;
                case "ArrowRight":
                case "d":
                    direction = "right";
                    this.posX += this.movementSize;

                    break;
            }

            this.ws.sendMessage({ type: "move", sender: this.username, position: { x: this.posX, y: this.posY } });
        }, 5));
    }

    dropBomb() {
        this.ws.sendMessage({
            type: "bomb",
            sender: this.username,
            position: { x: this.posX, y: this.posY },
        });
    }
}
