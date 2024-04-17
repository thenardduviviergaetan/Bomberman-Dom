import Component from './framework/components/component.js';
import Framework from './framework/engine/framework.js';
import Input from './framework/components/input.js';
import Form from './framework/components/form.js';
import { getFormValues } from './framework/engine/engine.js';
const app = new Framework();
// app.openSocket();
const socket = new WebSocket("ws://localhost:8080/api/ws");
socket.onopen = () => {
    console.log("Conn opened");
}
socket.onmessage = (event) => {
    console.log(event.data)
}
socket.onclose = () => {
    console.log("Conn closed");
}
const container = new Component("div", { id: "container" });
const game = new Component("section", { id: "game" });
const chat = new Component("section", { id: "chat" });
const input = new Input({id:"chat-input",placeholder:"Enter message",type:"text",name:"input"});
const form = new Form({id:"chat-form"},input);
form.actionListener('submit',(e)=>{
    // console.log(getFormValues(e).input);
    try {
        socket.send(JSON.stringify({msg_type:"chat",content:getFormValues(e).input}));
        // app.socket.send(JSON.stringify({msg_type:"chat",content:getFormValues(e).input}));
    } catch (error) {
        console.error(error)
    }
})
chat.addElement(form);

container.addElement(game, chat);

app.addComponent(container);
