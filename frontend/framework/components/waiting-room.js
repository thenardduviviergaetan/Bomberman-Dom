class WaitingRoom extends Component {
    constructor(mainPlayer, chat) {
        super('div', { className: 'waitingRoom'})
        this.chat = chat
        this.playerList = new Component('ul', { id: 'playerList'})
        this.countDownID
        this.countDown = 0
        this.resolve
        this.mainPlayer = mainPlayer //REFACTOR use a Player classe
    }

    async init(resolve) {
        //Waits for at least 2 people in the room to start a countdown that will
        //launch the game
        this.resolve = resolve

        const container = new Component('div', { className: "container" })
        const player = new Component('li', { className: 'mainPlayer'} [this.mainPlayer.username])
        const chatComp = new Chat()

        this.playerList.addElement(player)
        container.addElement(this.playerList)
        this.addElement(container, chatComp)
        this.updade()
    }

    setCountDown() {
        // sets the count down that will start the game.
        this.countDownID = setInterval(() => {
            this.countDown++
            if (this.countDown >= 10) this.resolve()
            else console.log() // TODO update the countdown and render the room
        }, 1000);
        
    }

    newPlayerJoin(user) {
        //Each time a new player is added this function is called
        const player = new Component('li', { className: 'player'} [this.mainPlayer.username])
        this.playerList.push(user)

        

        //Launch countdown that will start the game.
        if (this.playerList.children.length >= 2 && !countDownID) {
            this.setCountDown()
        }
    }
}