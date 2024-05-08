import Component from "../component.js";
import { debounce } from "../../engine/utils.js";
import { checkGround } from "./collisions.js";

const FRAME_COUNT = 3;
const FRAME_WIDTH = 32;
const MOVEMENT_SIZE = 2;
const ANIMATION_FRAME_RATE = 8

const ANIMATION_FRAMES = {
    "down": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: i * FRAME_WIDTH, offsetY: 0 })),
    "up": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: i * FRAME_WIDTH, offsetY: FRAME_WIDTH })),
    "right": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: (i + 3) * FRAME_WIDTH, offsetY: 0 })),
    "left": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: (i + 3) * FRAME_WIDTH, offsetY: FRAME_WIDTH }))
}

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
        this.props.style = `background-image: ${this.sprite}; background-position: -${0}px -${0}px; transition: transform 0.1s;`;
        this.draw();

        this.frameIndex = 0
        this.animationCounter = 0
        this.frameCycle = [0, 1, 0, 2]
        this.cycleIndex = 0

    }

    draw() {
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
    }


    animate(direction) {
        this.animationCounter++
        if (this.animationCounter % ANIMATION_FRAME_RATE === 0 || direction !== this.prevDirection) {
            this.prevDirection = direction;
            this.frameIndex = this.frameCycle[this.cycleIndex];
            this.cycleIndex = (this.cycleIndex + 1) % this.frameCycle.length;
            const { offsetX, offsetY } = ANIMATION_FRAMES[direction][this.frameIndex];
            this.props.style = `${this.props.style} background-position: -${offsetX}px -${offsetY}px;`;
        }
    }

    async move(direction, position) {
        this.posX = position.x;
        this.posY = position.y;
        const { offsetX, offsetY } = ANIMATION_FRAMES[direction][this.frameIndex];
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px); background-position: -${offsetX}px -${offsetY}px;`;
        this.animate(direction);
        this.updateDOM()
    }
}

export class CurrentPlayer extends Player {
    constructor(props, ws, username, parent) {
        super(props, ws, username);
        this.direction = null
        this.isMoving = false;
        this.parent = parent;
        this.frameID = null;

        window.addEventListener("keydown", debounce((event) => {
            this.direction = DIRECTION_MAP[event.key];
            if (!this.isMoving) this.updatePosition();
        }), 100)

        window.addEventListener("keyup", debounce((event) => {
            if (this.direction === DIRECTION_MAP[event.key]) {
                this.direction = null;
            }
        }), 100)
    }

    moveCurrent() {
        const playerGround = checkGround(this);
        if (!this.direction) {
            this.isMoving = false;
            return;
        }
        const oldPosX = this.posX;
        const oldPosY = this.posY;
        this.posY += this.direction === "up" && !playerGround.groundUp ? -MOVEMENT_SIZE : this.direction === "down" && !playerGround.groundDown ? MOVEMENT_SIZE : 0;
        this.posX += this.direction === "left" && !playerGround.groundLeft ? -MOVEMENT_SIZE : this.direction === "right" && !playerGround.groundRight ? MOVEMENT_SIZE : 0;
        if (this.posX !== oldPosX || this.posY !== oldPosY) {
            this.ws.sendMessage({ type: "move", sender: this.username, direction: this.direction, position: { x: this.posX, y: this.posY } });
        }
    }

    updatePosition() {
        this.isMoving = true;
        this.moveCurrent();
        if (this.direction) {
            this.frameID = requestAnimationFrame(() => this.updatePosition());
        } else {
            cancelAnimationFrame(this.frameID);
            this.isMoving = false;
        }
    }
    dropBomb() {
        this.ws.sendMessage({
            type: "bomb",
            sender: this.username,
            position: { x: this.posX, y: this.posY },
        });
    }
}
