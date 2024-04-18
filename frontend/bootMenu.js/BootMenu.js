import Component from "../framework/components/component.js";
import Form from "../framework/components/form.js";
import { Input } from "./input.js";

export class BootMenu extends Component {
    constructor() {
        super('div', { className: 'bootMenu' })
        this.username = 'Bob Ross'

        this.#init()
    }

    #init() {
        const text = `Please enter a Username under [x] characters to enter lobby.`
        const window = new Component('div')
        const queryText = new Component('p', {}, [text])
        const username = new Input({
            type: 'text', placeholder: 'Username',
            name: 'boot-menu-username'
        })
        const submit = new Input({
            type: 'submit',
            name: 'boot-menu-submit'
        })

        const bootForm = new Form({}, queryText, username, submit)

        bootForm.actionListener('submit', (event) => {
            console.log("testing button");
            this.#sendUsername(event.target.value)
        })

        window.addElement(bootForm)
        this.addElement(window)
    }

    #sendUsername(username) {
        fetch('SET URL TO POST USERNAME ', {
            method: 'POST',
        })
    }
}