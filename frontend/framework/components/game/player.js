import Component from "../component.js";

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
        this.props.style = `top: ${this.posY}px; left: ${this.posX}px;`
    }

    update() {
    }


}

export class CurrentPlayer extends Player {
    constructor(props, ws, username) {
        super(props, ws, username)
        this.movementSize = 15

        window.addEventListener('keydown', (event) => {
            let direction;
            switch (event.key) {
                case 'ArrowUp':
                case 'z':
                    direction = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                    direction = 'down';
                    break;
                case 'ArrowLeft':
                case 'q':
                    direction = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                    direction = 'right';
                    break;
            }
            console.log(direction);
            this.movePlayer(direction);
        })
    }

    movePlayer(direction) {
        this.ws.sendMessage({ type: "move", direction: direction, sender: this.username, position: { x: this.posX, y: this.posY } });
    }

    dropBomb() {
        this.ws.sendMessage({ type: "bomb", sender: this.username, position: { x: this.posX, y: this.posY } });
    }
} 