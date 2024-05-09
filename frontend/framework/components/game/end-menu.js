import Component from "../component.js";

export default class EndMenu extends Component{
    constructor(leaveButton,restartButton, winner) {
        super("div",{id:"end-menu"})
        this.winner = winner; // TODO this is where you put the winner
        this.leaveButton = leaveButton;
        this.restartButton = restartButton;
        this.initialize();
    }

    initialize(){
        const title = new Component("h2", {id:"end-title"}, [`Game's over folks ! ${this.winner} wins !`])
        const winText = new Component("p", {id:"end-prompt"}, ["You can choose either to restart the game or to leave this game :"])
        const warning = new Component("p", {id:"warning-end"},["WARNING ! IF YOU PRESS RESTART THIS WILL RESTART FOR ALL THE PLAYERS STILL IN THE LOBBY"])   
        const buttons = new Component("div",{id:"button-container"},[this.restartButton,this.leaveButton])
        this.addElement(title,winText,warning,buttons)
    }

}