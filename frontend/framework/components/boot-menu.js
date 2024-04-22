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
        const title = new Component('h1', { id: "title" }, ["Bomberman DOM!"])
        const errorMessage = new Component('p', { id: "error-msg", style: "color: red" });
        const text = `Please enter a Username:`;
        const queryText = new Component('p', {}, [text])
        const message = new Component('span', {}, [`(max.${maxCharacters} characters)`])
        const username = new Input({ id:'field', type: 'text', placeholder: 'Username', name: 'boot-menu-username', value: "" })
        const submit = new Input({ id: 'submitBtn', type: 'submit', name: 'boot-menu-submit', value: 'Submit'})
        const bootForm = new Form({id:"form"},title, queryText,message, errorMessage,username, submit)


        bootForm.actionListener('submit', (event) => {
            const username = getFormValues(event)['boot-menu-username']
            this.sendUsername(username)
                .then(async (res) => {
                    if (res.ok) resolve(username)
                    else {
                        const errorText = await res.text()
                        errorMessage.children = [errorText]
                        errorMessage.update()
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