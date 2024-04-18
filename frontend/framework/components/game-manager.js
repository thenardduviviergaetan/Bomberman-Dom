import Framework from "../engine/framework.js"
import Component from "../components/component.js"
import BootMenu from "../../bootMenu/boot-menu.js"
import WS from "../../framework/websocket/websocket.js"
import Game from "../../framework/components/game.js"
import Chat from "../../framework/components/chat.js"

export default class GameManager{
    constructor() {
        this.app = new Framework()
        this.username = 'bob'
        this.ws;
    }

    async launchMenu() {
        const bootMenu = new BootMenu()
        const ready = new Promise(resolve => {
            bootMenu.init2(resolve)
        })

        this.app.addComponent(bootMenu)
        this.render()

        ready.then((username) => {
            this.username = username
            this.launchgame()
        })
    }

    launchgame() {
        const container = new Component("div", { id: "container" });
        const title = new Component("h1", { id:"test"}, [this.username])

        // const game = new Game({ id: "game" }, ws);
        // const chat = new Chat({ id: "chat" }, ws);

        // container.addElement(bootMenu);
        // container.addElement(game, chat);

        container.addElement(title)
        this.app.addComponent(container)
        this.render()
    }

    launchFinalScreen() {
        // ._init().then()
    }

    render() {
        this.app.render(this)
    }
}