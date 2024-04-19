class WaitingRoom extends Component {
    constructor() {
        super('div', { className: 'waitingRoom'})
        this.playerList = []
        this.countDownID
    }

    async init(resolve) {
        //Waits for at least 2 people in the room to start a countdown that will
        //launch the game


    }

    setCountDown() {
        // 
        this.countDownID = setTimeout(() => {
            
        }, 10000);
        
    }

    newPlayerJoin(user) {
        //Each time a new player is added this function is called
        this.playerList.push(user)
        if (this.playerList.length >= 2 && !countDownID) {
            this.setCountDown()
        }
    }
}