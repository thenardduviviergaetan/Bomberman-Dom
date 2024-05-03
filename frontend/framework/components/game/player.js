import Component from "../component.js";
import { debounce } from "../../engine/utils.js";

export class Player extends Component {
    constructor(props, ws, username) {
        super("div", props);
        this.ws = ws;
        this.username = username;
        this.posX = props.style.left;
        this.posY = props.style.top;
        this.sprite = `url(./framework/components/game/assets/player${props.index + 1}.png)`
        this.props.style = `background-image: ${this.sprite}; background-position: -${0}px -${0}px;`;
        this.draw();
    }

    draw() {
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
    }

    move(position) {
        this.posX = position.x;
        this.posY = position.y;
        requestAnimationFrame(() => {
            this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
            this.updateDOM();
        });
    }
}

export class CurrentPlayer extends Player {
    constructor(props, ws, username) {
        super(props, ws, username);
        this.movementSize = 4;

        const directionMap = {
            "ArrowUp": "up",
            "z": "up",
            "ArrowDown": "down",
            "s": "down",
            "ArrowLeft": "left",
            "q": "left",
            "ArrowRight": "right",
            "d": "right"
        };
        window.addEventListener("keydown", debounce((event) => {

            const direction = directionMap[event.key];

            if (direction) {
                this.posY += direction === "up" ? -this.movementSize : direction === "down" ? this.movementSize : 0;
                this.posX += direction === "left" ? -this.movementSize : direction === "right" ? this.movementSize : 0;
                this.ws.sendMessage({ type: "move", sender: this.username, position: { x: this.posX, y: this.posY } });
            }
        }, 10));
    }

    dropBomb() {
        this.ws.sendMessage({
            type: "bomb",
            sender: this.username,
            position: { x: this.posX, y: this.posY },
        });
    }
}
