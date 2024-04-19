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
        const form = new Form({ id: "chat-form" }, input);
        form.actionListener('submit', (e) => {
            const data = getFormValues(e).input;
            this.ws.sendMessage({ type: "chat", body: data, sender: this.username });
        })
        this.addElement(form);
    }

    #receive() {
        const chatBox = new Component("div", { id: "chat-box" });
        chatBox.children = this.messages;
        this.ws.onMessage((data) => {
            let chatElement;
            console.log("this.messages", this.messages);
            switch (data.type) {
                case 'join':
                    chatElement = new Component("p", { id: "chat-element", style: "color: white;" });
                    this.messages.push(data.body)
                    chatElement.children.push(data.body);
                    break
                case 'chat':
                    chatElement = new Component("p", { id: "chat-element", style: "color: white;" });
                    this.messages.push(`${data.sender} : ${data.body}`)
                    chatElement.children.push(`${data.sender} : ${data.body}`); 
                    break
            }

            chatBox.addElement(chatElement);
            chatBox.update();
        })
        this.addElement(chatBox);
    }
}