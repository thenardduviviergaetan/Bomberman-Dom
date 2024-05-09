import Framework from "../engine/framework.js"
import Component from "../components/component.js"
import BootMenu from "./boot-menu.js"
import WS from "../../framework/websocket/websocket.js"
import Game from "../../framework/components/game/game.js"
import Chat from "../../framework/components/chat.js"
import WaitingRoom from "./waiting-room.js"
import EndMenu from "./game/end-menu.js"
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
                this.ws.sendMessage({ type: 'join', username: this.username });//FIXME error ws in opening state or whatever, check it after meal
                // setTimeout(() => {
                //     this.ws.sendMessage({ type: 'join', username: this.username });//FIXME error ws in opening state or whatever, check it after meal
                // }, 1000);
            });
            this.ws.onClose(() => {
                console.log('Disconnected from server');
                this.ws.sendMessage({ type: 'leave', username: this.username });//FIXME error ws in opening state or whatever, check it after meal
                // setTimeout(() => {
                //     this.ws.sendMessage({ type: 'leave', username: this.username });//FIXME error ws in opening state or whatever, check it after meal
                // }, 1000);
            })
            this.app.clear()
            this.launchgame()

        }).catch((e) => {
            this.render()
        });
    }

    launchgame() {
        const leaveButton = new Component("button", { id: "leave-button" }, ["End Game"])
        // const leaveButton = new Component("button", { id: "leave-button" }, ["Leave Game"])
        const container = new Component("div", { id: "container" });
        const chat = new Chat({ id: "chat" }, this.ws, this.username);
        const waitRoom = new WaitingRoom(this.ws, this.username)
        leaveButton.actionListener('click', () => {
            // this.ws.close();
            // container.clear();//this is to clear the map which does not remove with app.clear()
            // this.app.clear();
            // this.launchEnd();
        })

        this.ws.onMessage(message=>{
            if (message.type === "end") {
                container.clear();//this is to clear the map which does not remove with app.clear()
                this.app.clear();
                this.launchEnd();
            }
        })

        const ready = new Promise((resolve, reject) => {
            waitRoom.initialize(resolve, reject);
        });

        ready.then(() => {
            const game = new Game({ id: "game" }, this.ws, this.username, waitRoom.playerList.children);
            container.replaceChildren(waitRoom, game);
            container.update()
        });

        container.addElement(chat, waitRoom);
        this.app.addComponent(leaveButton);
        this.app.addComponent(container);

        this.render();
    }

    launchEnd() {
        //TODO place that where there will be the game over
        const leaveButton = new Component("button", { id: "leave-button", className: "end" }, ["Leave Game"])

        leaveButton.actionListener('click', () => {
            this.ws.close();
            container.clear();//this is to clear the map which does not remove with app.clear()
            this.app.clear();
            this.launchMenu();
        })
        const restart = new Component("button", { id: "restart-button", className: "end" }, ["Restart"])
        restart.actionListener('click', () => {
            this.ws.sendMessage({ type: "restart" });
        })

        this.ws.onMessage((message) => {
            if (message.type === "restart") {
                this.ws.close();
                container.clear(); //this is to clear the map which does not remove with app.clear()
                this.app.clear();
                this.ws = new WS(`ws://localhost:8080/api/ws?username=${this.username}`);
                this.launchgame();
                //FIXME when 4 players, this does not work bc it's wanting to send directly 
            }
        })
        const container = new Component("div", { id: "container" });

        const chat = new Chat({ id: "chat" }, this.ws, this.username);
        const endMenu = new EndMenu(leaveButton, restart, this.username);//Change "this.username" by the winner
        container.addElement(chat, endMenu)
        this.app.addComponent(container)
        this.render()
    }

    render() {
        this.app.render(this);
    }
}