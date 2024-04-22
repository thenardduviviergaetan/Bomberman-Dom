import Component from "./component.js";

export default class WaitingRoom extends Component {
    constructor(ws, currentPlayer) {
        // constructor(currentPlayer, chat) {
        super('section', { id: 'waitingRoom' })
        // this.chat = chat
        this.ws = ws;
        this.playerList = new Component('ul', { id: 'playerList' })
        this.addElement(this.playerList)
        this.countDownID
        this.countDown = 0
        this.resolve;
        this.reject;
        this.currentPlayer = currentPlayer
        this.ws.onMessage((message) => {
            if (message.type === "join" || message.type === "leave") this.newPlayerJoin(message.connected)
        })
    }

    setCountDown() {
        // sets the count down that will start the game.
        this.countDownID = setInterval(() => {
            this.countDown++
            if (this.countDown >= 10) this.resolve()
            else console.log() // TODO update the countdown and render the room
        }, 1000);

    }

    newPlayerJoin(...players) {
        //Each time a new player is added this function is called
        this.playerList.children = []
        players.flat().forEach((playerUsername) => {
            console.log("PLAYERS NAME:", playerUsername);
            const player = new Component('li', { className: 'player' }, [playerUsername])
            this.playerList.addElement(player)
            this.playerList.update()
        })
        //Launch countdown that will start the game.
        // if (this.playerList.children.length >= 2 && !countDownID) {
        //     this.setCountDown()
        // }
    }
}