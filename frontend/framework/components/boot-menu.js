import Component from "./component.js";
import Form from "./form.js";
import Input from "./input.js";
import { getFormValues } from "../engine/engine.js";

export default class BootMenu extends Component {
    constructor() {
        super('div', { className: 'bootMenu' })
    }

    async initialize(resolve, reject) {
        const maxCharacters = 10;
        const errorMessage = new Component('p', { id: "error-msg", style: "color: red" });
        //     const errorMessage = new Component('p', { className: 'errorMessage' })

        const text = `Please enter a Username under ${maxCharacters} characters to enter lobby.`;
        // const window = new Component('div')
        const queryText = new Component('p', {}, [text])
        const username = new Input({ type: 'text', placeholder: 'Username', name: 'boot-menu-username', value: "" })
        const submit = new Input({ type: 'submit', name: 'boot-menu-submit' })
        const bootForm = new Form({}, queryText, errorMessage,username, submit)


        bootForm.actionListener('submit', (event) => {
            const username = getFormValues(event)['boot-menu-username']
            this.sendUsername(username)
                .then(async (res) => {
                    if (res.ok) resolve(username)
                    else {
                        const errorText = await res.text()
                        errorMessage.children.push(errorText)
                        reject(bootForm)
                    }
                })
        })

        this.addElement(bootForm)
        this.render()
    }

    async sendUsername(username) {
        return fetch(`http://localhost:8080/api/join`, {
            method: 'POST',
            body: JSON.stringify({ username }),
        })
    } 
}