import Component from "../component.js";

export class Player extends Component {
    constructor(props, ws, username) {
        super("div", props);
        this.ws = ws;
        this.username = username;
        this.props.style = {top:"",left:"",transform:""};
        this.posX;
        this.posY;
        this.draw();
    }
    
    draw() {
        this.props.style.top = this.posY;
        this.props.style.left = this.posX;
        this.update();
    }

    update(){
        this.props.style.transform = `translate(${this.posX}px, ${this.posY}px)`
        //Can't apply this, you'll tansform and then use .left and .top (le translate sert à rien sinon)
        // this.draw()
        this.update()
    }


}

export class CurrentPlayer extends Player{
    constructor(props, ws, username){
        super(props, ws, username)
        this.movementSize = 15
        this.initListeners()

    }

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
        this.ws.sendMessage({ type: "move", direction: direction, sender: this.username, position: { x: this.posX, y: this.posY } });
    }

    dropBomb(){
        this.ws.sendMessage({ type: "bomb", sender: this.username, position:{x:this.posX, y:this.posY} });
    }
} 