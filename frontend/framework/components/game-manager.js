import Framework from "../engine/framework.js"
import Component from "../components/component.js"
import BootMenu from "../../bootMenu/boot-menu.js"
import WS from "../../framework/websocket/websocket.js"
import Game from "../../framework/components/game.js"
import Chat from "../../framework/components/chat.js"

export default class GameManager{
    constructor() {
        this.app = new Framework()
        this.ws;
        this.boot = false
        this.startgame = false
    }

    async launchMenu() {
        const bootMenu = new BootMenu()
        this.app.addComponent(bootMenu)
        this.render()
        if (bootMenu.t){
            console.log("test");
            // this.launchWaitingRoom()
            this.ws = new WS("ws://localhost:8080/api/ws");
        }
    }

    // launchWaitingRoom() {
    //     new Waiting()._init().then()
    // }

    launchgame() {
        // new Game()._init().then()
        const container = new Component("div", { id: "container" });
        const game = new Game({ id: "game" }, ws);
        const chat = new Chat({ id: "chat" }, ws);

        // container.addElement(bootMenu);
        // container.addElement(game, chat);

        this.app.addComponent(container);
    }

    launchFinalScreen() {
        // ._init().then()
    }

    render() {
        this.app.render(this)
    }
}