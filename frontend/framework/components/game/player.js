import Component from "../component.js";
import { debounce } from "../../engine/utils.js";
import { checkGround } from "./collisions.js";

const FRAME_COUNT = 3;
const FRAME_WIDTH = 32;
const MOVEMENT_SIZE = 2;
const FRAMERATE = 1000 / 60;

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

    }

    draw() {
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
        // this.animate()
    }

    animate(direction){
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
    constructor(props, ws, username,parent) {
        super(props, ws, username);
        this.parent = parent;

        window.addEventListener("keydown", debounce((event) => {

            const direction = DIRECTION_MAP[event.key];

            if (direction) {
                this.updatePosition(direction);
                this.ws.sendMessage({ type: "move", sender: this.username, direction: direction, position: { x: this.posX, y: this.posY } });
            }
        }), FRAMERATE);
    }

    updatePosition(direction) {
        // console.log(this.parent)
        checkGround(this);
        this.posY += direction === "up" ? -MOVEMENT_SIZE : direction === "down" ? MOVEMENT_SIZE : 0;
        this.posX += direction === "left" ? -MOVEMENT_SIZE : direction === "right" ? MOVEMENT_SIZE : 0;
    }

    dropBomb() {
        this.ws.sendMessage({
            type: "bomb",
            sender: this.username,
            position: { x: this.posX, y: this.posY },
        });
    }
}
