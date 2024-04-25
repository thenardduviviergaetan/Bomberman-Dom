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
                    if (message.body === 0) {
                        this.resolve();
                    }
                    if (message.body === -1) {
                        this.counter.children = [" "]
                    } else {
                        if (message.body <= 10) {
                            this.counter.children = [message.body.toString()]
                        } else {
                            this.counter.children = [""];
                        }
                    }
                    this.update();
                    break;
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
