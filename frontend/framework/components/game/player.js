import Component from "../component.js";
import { debounce } from "../../engine/utils.js";
import { checkGround } from "./collisions.js";

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
const DROP_BOMB = {
    "Shift": true,
    " ": true
}

export class Player extends Component {
    constructor(props, ws, username) {
        super("div", props);
        this.ws = ws;
        this.username = username;
        this.posX = props.style.left;
        this.posY = props.style.top;
        this.sprite = `url(./framework/components/game/assets/player${props.index + 1}.png)`
        this.props.style = `background-image: ${this.sprite}; background-position: -${0}px -${0}px;`;
        this.life = 3;
        this.draw();

        this.frameIndex = 0
        this.animationCounter = 0

    }
    addLife(nb) {
        this.life += nb;
    }
    rmLife(nb) {
        this.life -= nb;
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
    constructor(props, ws, username, parent) {
        super(props, ws, username);
        this.direction = null
        this.isMoving = false;
        this.parent = parent;
        this.bombCooldown = 0;
        this.cooldownDegats = 0;

        window.addEventListener("keydown", debounce((event) => {
            if (DROP_BOMB[event.key] && (this.bombCooldown - new Date().getTime() <= 0)) {
                this.dropBomb();
                this.bombCooldown = new Date().getTime() + 1500;
                return;
            }
            this.direction = DIRECTION_MAP[event.key];
            if (!this.isMoving) this.updatePosition();
            // if (DROP_BOMB[event.key] && (this.bomb <= this.maxBomb && this.bombCooldown - new Date().getTime() <= 0)) {
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
            const playerGround = checkGround(this);
            if (!this.direction) {
                this.isMoving = false;
                return;
            }
            this.posY += this.direction === "up" && !playerGround.groundUp ? -MOVEMENT_SIZE : this.direction === "down" && !playerGround.groundDown ? MOVEMENT_SIZE : 0;
            this.posX += this.direction === "left" && !playerGround.groundLeft ? -MOVEMENT_SIZE : this.direction === "right" && !playerGround.groundRight ? MOVEMENT_SIZE : 0;
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
            bombType: 0,
            sender: this.username,
            position: { "x": this.posX, "y": this.posY + 608 },
            date: new Date().getTime()
        });
    }
    triggerBlast() {
        const time = new Date().getTime();
        if (time - this.cooldownDegats > 1500) {
            this.cooldownDegats = time;
            this.rmLife(1);
            if (this.life <= 0) {
                this.playerDeath("blast");
            }else{
                this.ws.sendMessage({
                    type: "degats",
                    sender: this.username,
                    nb: 1
                });
            }
        }
    }
    playerDeath(cause) {
        this.ws.sendMessage({
            type: "death",
            sender: this.username,
            cause: cause
        });
    }
}
