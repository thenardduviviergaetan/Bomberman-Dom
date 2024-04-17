import Component from "./component.js";
import Input from "./input.js";
import Form from "./form.js";
import { getFormValues } from "../engine/engine.js";
export default class Chat extends Component {
    constructor(props, ws) {
        super("section", props);
        this.ws = ws;
        this.#init()
        this.#receive()
        return this;
    }

    #init(){
        const input = new Input({ id: "chat-input", placeholder: "Enter message", type: "text", name: "input" });
        const form = new Form({ id: "chat-form" }, input);
        form.actionListener('submit', (e) => {
            const data = getFormValues(e).input;
            this.ws.sendMessage({type: "chat", body: data , sender:"user" });
        })
        this.addElement(form);
    }

    #receive(){
        this.ws.onMessage((data) => {
            console.log(data);
        })
    }
}