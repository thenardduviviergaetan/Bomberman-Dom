import Component from "../component.js";
import { debounce } from "../../engine/utils.js";

const FRAME_COUNT = 3;
const FRAME_WIDTH = 32;
const MOVEMENT_SIZE = 2;
const ANIMATION_FRAME_RATE = 8

const DIRECTION_MAP = {
    "ArrowUp": "up",
    "z": "up",
    "ArrowDown": "down",
    "s": "down",
    "ArrowLeft": "left",
    "q": "left",
    "ArrowRight": "right",
    "d": "right"
};

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

        this.frameIndex = 0
        this.animationCounter = 0

    }

    draw() {
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
    }

    animate(direction) {
        this.animationCounter++
        if (this.animationCounter % ANIMATION_FRAME_RATE === 0 || direction !== this.prevDirection) {
            this.prevDirection = direction;

            this.frameIndex = (this.frameIndex + 1) % FRAME_COUNT;
            let offsetX = this.frameIndex * FRAME_WIDTH;

            let offsetY = 0;

            switch (direction) {
                case "down":
                    offsetY = 0;
                    break;
                case "up":
                    offsetY = FRAME_WIDTH;
                    break;
                case "right":
                    offsetX = (this.frameIndex + 3) * FRAME_WIDTH;
                    break;
                case "left":
                    offsetX = (this.frameIndex + 3) * FRAME_WIDTH;
                    offsetY = FRAME_WIDTH;
                    break;
            }

            this.props.style = `${this.props.style} background-position: -${offsetX}px -${offsetY}px;`;

        }
    }

    move(direction, position) {

        this.posX = position.x;
        this.posY = position.y;
        requestAnimationFrame(() => {
            this.animate(direction)
            this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
            this.updateDOM();
        });
    }
}
export class CurrentPlayer extends Player {
    constructor(props, ws, username) {
        super(props, ws, username);
        this.direction = null
        this.isMoving = false;

        window.addEventListener("keydown", debounce((event) => {
            this.direction = DIRECTION_MAP[event.key];
            if (!this.isMoving) this.updatePosition();
        }), 10)

        window.addEventListener("keyup", debounce((event) => {
            if (this.direction === DIRECTION_MAP[event.key]) {
                this.direction = null;
            }
        }), 10)
    }

    updatePosition() {
        this.isMoving = true;
        let lastSendTime = performance.now();
        const move = () => {
            if (!this.direction) {
                this.isMoving = false;
                return;
            }
            this.posY += this.direction === "up" ? -MOVEMENT_SIZE : this.direction === "down" ? MOVEMENT_SIZE : 0;
            this.posX += this.direction === "left" ? -MOVEMENT_SIZE : this.direction === "right" ? MOVEMENT_SIZE : 0;
            // this.ws.sendMessage({ type: "move", sender: this.username, direction: this.direction, position: { x: this.posX, y: this.posY } });
            if (Date.now() - lastSendTime >= 1000 / 60) {
                this.ws.sendMessage({ type: "move", sender: this.username, direction: this.direction, position: { x: this.posX, y: this.posY } });
                lastSendTime = performance.now();
            }
            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);
    }
    dropBomb() {
        this.ws.sendMessage({
            type: "bomb",
            sender: this.username,
            position: { x: this.posX, y: this.posY },
        });
    }
}
