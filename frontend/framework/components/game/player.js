import Component from "../component.js";

export default class Player extends Component {
    constructor(props, ws, username) {
        super("div", props);
        this.ws = ws;
        this.username = username;
        this.posX = 0
        this.posY = 0
        this.movementSize = 15
        // this.init();
        this.initListeners();
        
        /*
                on message :
                if type === "spawn" :
                if msg.sender == this.username :
                
                */
    }

    // init(){

    // }
    // draw() {
    // }
    initListeners() {
        //TODO Set a debounce for the keydown
        // this.actionListener('keydown', (key) => this.sendMove(key))
        // this.ws.onMessage((key) => this.receiveMove(key))
        this.actionListener('keydown', (event) => this.handleKeyDown(event))
        // this.actionListener('keyup', (event) => this.handleKeyUp(event))
    }

    handleKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'arrowleft', "q":
                console.log("left")
                this.movePlayer('left');
                break;
            case 'arrowright', "d":
                console.log("right")
                this.movePlayer('right');
                break;
            case 'arrowup', "z":
                console.log("up")
                this.movePlayer('up');
                break;
            case 'arrowdown', "s":
                console.log("down")
                this.movePlayer('down');
                break;
            case ' ', "space":
                console.log("bomb")
                this.dropBomb()
                break;
            default:
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'arrowleft':
                this.player.movingLeft = false;
                break;
            case 'arrowright':
                this.player.movingRight = false;
                break;
            default:
                break;
        }
    }

    movePlayer(direction) {
        this.ws.sendMessage({ type: "move", direction: direction, sender: this.username, position:{x:this.posX, y:this.posY} });
    }
    // sendMove(key) {
    //     switch (key.key) {
    //         case "ArrowRight", "d", "D":
    //             this.ws.sendMessage({ type: "move", direction: "right", sender: this.username, position:{x:this.posX, y:this.posY} });
    //             break;
    //         case "ArrowLeft", "q", "Q":
    //             this.ws.sendMessage({ type: "move", direction: "left" });
    //             break;
    //         case "ArrowDown", "s", "S":
    //             this.ws.sendMessage({ type: "move", direction: "down" });
    //             break;
    //         case "ArrowUp", "z", "Z":
    //             this.ws.sendMessage({ type: "move", direction: "up" });
    //             break;
    //         case "Space":
    //             this.ws.sendMessage({ type: "bomb", action: "bomb" });
    //             break;
    //     }
    // }

    // receiveMove(key) {
    //     switch (key.key) {
    //         case "ArrowRight", "d", "D":
    //             this.posX += this.movementSize
    //             break;
    //         case "ArrowLeft", "q", "Q":
    //             this.posX -= this.movementSize
    //             break;
    //         case "ArrowDown", "s", "S":
    //             this.posY += this.movementSize
    //             break;
    //         case "ArrowUp", "z", "Z":
    //             this.posY -= this.movementSize
    //             break;
    //     }
    // }

}

/*
 draw() {
        this.x = Math.max(0, Math.min(this.x, this.gameAreaWidth - this.width));
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    movePlayer(direction) {
        direction === 'left' ? this.moveLeft() : this.moveRight();
    }
    moveLeft() {
        if (!this.movingLeft) {
            this.movingLeft = true;
            requestAnimationFrame(this.moveLeftFrame.bind(this));
        }
    }
    moveLeftFrame() {
        if (this.movingLeft) {
            this.x -= 2;
            this.draw();
            requestAnimationFrame(this.moveLeftFrame.bind(this));
        }
    }
    moveRight() {
        if (!this.movingRight) {
            this.movingRight = true;
            requestAnimationFrame(this.moveRightFrame.bind(this));
        }
    }
    moveRightFrame() {
        if (this.movingRight) {
            this.x += 2;
            this.draw();
            requestAnimationFrame(this.moveRightFrame.bind(this));
        }
    }
*/