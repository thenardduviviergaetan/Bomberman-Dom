import Component from './frontend/framework/components/component.js';
import { vNode } from './frontend/framework/engine/engine.js';
import Framework from './frontend/framework/engine/framework.js';

const app = new Framework();

const main = new Component("main", {id:"app"});
const game  = new Component("div", {id:"game"});
const chat = new Component("div", {id:"chat"});
main.addElement(game,chat);
app.addComponent(main);