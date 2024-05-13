import Component from "./component.js";
import Input from "./input.js";
import Form from "./form.js";
import { getFormValues } from "../engine/engine.js";
export default class Chat extends Component {
    constructor(props, ws, username) {
        super("section", props);
        this.ws = ws;
        this.username = username;
        this.messages = [];
        this.#init();
        this.#receive();
        return this;
    }

    #init() {
        const input = new Input({ id: "chat-input", placeholder: "Enter message", type: "text", name: "input" });
        input.actionListener('focus',()=>this.ws.sendMessage({type:"lock"}))
        input.actionListener('blur',()=>this.ws.sendMessage({type:"unlock"}))
        // input.actionListener('onfocus',()=>console.log("locked"))
        // input.actionListener('onblur',()=>console.log("unlocked"))
        const form = new Form({ id: "chat-form" }, input);
        form.actionListener('submit', (e) => {
            const data = getFormValues(e).input;
            this.ws.sendMessage({ type: "chat", body: data, sender: this.username });
        })

        this.addElement(form);
    }

    #receive() {
        const chatBox = new Component("div", { id: "chat-box" });
        this.ws.onMessage((data) => {
            let chatElement;
            switch (data.type) {
                case 'join':
                    chatElement = new Component("p", { id: "chat-element", className: "chat-element-join" });
                    chatElement.children.push(data.body);
                    break
                case 'leave':
                    chatElement = new Component("p", { id: "chat-element", className: "chat-element-leave" });
                    chatElement.children.push(data.body);
                    break
                case 'chat':
                    chatElement = new Component("p", { id: "chat-element", className: "chat-element" });
                    const sender = new Component("span", { className: "chat-sender" }, [`<${data.sender}> : `])
                    chatElement.addElement(sender, data.body);
                    break
                default:
                    return
            }

            chatBox.addElement(chatElement);
            chatBox.update();
        })
        this.addElement(chatBox);
    }
}