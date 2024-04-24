import Component from "./component.js";

export default class WaitingRoom extends Component {
    constructor(ws, currentPlayer) {
        super("section", { id: "waitingRoom" });
        this.ws = ws;
        this.playerList = new Component("ul", { id: "playerList" });
        this.playersCount = new Component("div", { id: "playersCount" });
        this.started = false;
        this.countDownID;
        this.countDown = 0;
        this.resolve;
        this.reject;
        this.currentPlayer = currentPlayer;
        this.counter = new Component("div", { className: "countDown" }, [""]);

        // if ((message.type === "join" || message.type === "leave") && !this.started) {
        //     this.newPlayerJoin(message.connected);

        // if (this.playerList.children.length >= 2 && !this.countDownID) {
        //     this.setCountDown();
        // } else if (this.playerList.children.length < 2) {
        //     this.stopCountDown();
        // }
    }


    #receive() {
        this.ws.onMessage((message) => {

            switch (message.type) {
                case "join":
                case "leave":
                    this.newPlayerJoin(message.connected)
                    break
                case "update-timer":
                    console.log("INNER TIMER:", message.body);
                    console.log("body = ", message.body.toString());
                    if (message.body === 0) {
                        console.log("Game has started");
                        console.log("this", this);
                        this.resolve();
                    }
                    if (message.body === -1) {
                        console.log("Reinitialize counter");
                        this.counter.children = [" "]
                    } else {
                        if (message.body <= 10) {
                            this.counter.children = [message.body.toString()]
                        } else{
                            this.counter.children = [""];
                        }
                    }

                    this.update();
                    break;
                // case "finish-timer":
                // this.resolve();
                // console.log(message)
                // break;
            }
        })
    }

    initialize(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
        this.#receive();
        this.addElement(this.playersCount);
        this.addElement(this.playerList);
        this.addElement(this.counter);
    }

    // setCountDown() {
    //TODO check for the 1s delay when joining a party with already 3 players
    // sets the count down that will start the game.

    // this.ws.sendMessage({ type: "await-timer" });

    // this.ws.onMessage((message) => {
    //     console.log("GLOBAL :", message);
    //     switch (message.type) {

    //     }
    // })

    // this.countDown = 20; //TODO change this to 30
    // let check = false;
    // this.countDownID = setInterval(() => {
    //     if (this.playerList.children.length === 4 && !check) {
    //         check = true;
    //         this.countDown = 1;
    //     } else if (this.playerList.children.length !== 4) {
    //         check = false
    //     }
    //     this.countDown--;
    //     if (this.countDown <= 10) {
    //         if (this.countDown <= 0) {
    //             this.started = true;
    //             clearInterval(this.countDownID);
    //             this.resolve();
    //         } else {
    //             console.log(this.countDown);
    //             this.counter.children = [this.countDown.toString()];
    //             this.update();
    //         };
    //     } else {
    //         this.counter.children = [];
    //         this.update()
    //     }
    // }, 1000);
    // }


    stopCountDown() {
        if (this.countDownID) {
            clearInterval(this.countDownID);
            this.countDownID = null;
            this.counter.children = [""];
            this.started = false;
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
        this.playersCount.children = [`Players: ${this.playerList.children.length}`];
        this.playersCount.update();
    }
}
