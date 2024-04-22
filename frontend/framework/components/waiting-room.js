import Component from "./component.js";

export default class WaitingRoom extends Component {
    constructor(ws, currentPlayer) {
        super("section", { id: "waitingRoom" });
        this.ws = ws;
        this.started = false;
        this.playerList = new Component("ul", { id: "playerList" });
        this.countDownID;
        this.countDown = 0;
        this.resolve;
        this.reject;
        this.currentPlayer = currentPlayer;
        this.counter = new Component("div", { className: "countDown" }, [""]);
        this.ws.onMessage((message) => {
            if ((message.type === "join" || message.type === "leave") && !this.started) {
                this.countDown = 8;
                this.newPlayerJoin(message.connected);
                
                if (message.type === "join" && this.playerList.children.length >= 2 &&!this.countDownID) {
                    this.setCountDown();
                } else if (this.playerList.children.length < 2) {
                    this.stopCountDown();
                }
            }
        });
    }

    initialize(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
        this.addElement(this.playerList);
        this.addElement(this.counter);
    }
    setCountDown() {
        // sets the count down that will start the game.

        this.countDownID = setInterval(() => {
            this.countDown--;
            if (this.countDown <= 0) {
                this.started = true;
                this.resolve();
                clearInterval(this.countDownID);
            } else {
                console.log(this.countDown);
                this.counter.children = [this.countDown.toString()];
                this.update();
            }; // TODO update the countdown and render the room
        }, 1000);
    }

    stopCountDown() {
        if(this.countDownID){
            clearInterval(this.countDownID);
            this.countDownID = null;
            this.counter.children = [""];
            this.update();
        }
    }

    newPlayerJoin(...players) {
        //Each time a new player is added this function is called
        this.playerList.children = [];
        players.flat().forEach((playerUsername) => {
            console.log("PLAYERS NAME:", playerUsername);
            const player = new Component("li", { className: "player" }, [
                playerUsername,
            ]);
            this.playerList.addElement(player);
            this.playerList.update();
        });
        //Launch countdown that will start the game.
        // if (this.playerList.children.length >= 2) {
        //     if (this.playerList.children.length >= 2 && !this.countDownID) {
        //         this.setCountDown()
        //     }
        // }
    }
}
