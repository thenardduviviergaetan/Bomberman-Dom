import Framework from "../engine/framework.js"
import Component from "../components/component.js"
import BootMenu from "./boot-menu.js"
import WS from "../../framework/websocket/websocket.js"
import Game from "../../framework/components/game.js"
import Chat from "../../framework/components/chat.js"
import WaitingRoom from "./waiting-room.js"
export default class GameManager {
    constructor() {
        this.app = new Framework();
        this.ws;
        this.username = "";
    }

    async launchMenu() {
        const bootMenu = new BootMenu();
        const ready = new Promise((resolve, reject) => {
            bootMenu.initialize(resolve, reject);
        });

        this.app.addComponent(bootMenu);
        this.render();

        ready.then((username) => {
            this.username = username;
            this.ws = new WS(`ws://localhost:8080/api/ws?username=${this.username}`);
            this.ws.onOpen(() => {
                console.log('Connected to server:', this.username);
                this.ws.sendMessage({ type: 'join', username: this.username });
            });

            this.ws.onClose(() => {
                console.log('Disconnected from server');
                this.ws.sendMessage({ type: 'leave', username: this.username });
            })
            this.app.clear()
            this.launchgame();
        }).catch((e) => {
            this.render()
        });
    }

    launchgame() {
        const leaveButton = new Component("button", { id: "leave-button" }, ["Leave Game"])
        leaveButton.actionListener('click', () => {
            this.ws.close();
            this.app.clear();
            this.launchMenu();
        })
        const container = new Component("div", { id: "container" });
        // const game = new Game({id: "game"},this.ws,this.username);
        const chat = new Chat({id: "chat"},this.ws,this.username);
        const waitRoom = new WaitingRoom(this.ws, this.username)

        container.addElement(chat, waitRoom);
        // container.addElement(chat, game);
        // const script = new Component("script", { src: "./test.js" });
        // ths.app.addComponent(script);
        this.app.addComponent(leaveButton);
        this.app.addComponent(container);
        this.render();
    }
    render() {
        this.app.render(this);
    }
}