import Component from './framework/components/component.js';
import Framework from './framework/engine/framework.js';

const app = new Framework();

const main = new Component("main", { id: "app" });
const game = new Component("section", { id: "game" });
const chat = new Component("section", { id: "chat" });

main.addElement(game, chat);

app.addComponent(main);