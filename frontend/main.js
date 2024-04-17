import Component from './framework/components/component.js';
import Framework from './framework/engine/framework.js';
import WS from './framework/websocket/websocket.js';
import Game from './framework/components/game.js';
import Chat from './framework/components/chat.js';

const app = new Framework();
const ws = new WS("ws://172.25.5.168:8080/api/ws");

const container = new Component("div", { id: "container" });
const game = new Game({ id: "game" }, ws);
const chat = new Chat({ id: "chat" }, ws);

container.addElement(game, chat);

app.addComponent(container);