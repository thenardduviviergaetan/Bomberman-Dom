import Component from "../framework/components/component.js";
import Form from "../framework/components/form.js";
import Input from "../framework/components/input.js";
import { getFormValues } from "../framework/engine/engine.js";
export default class BootMenu extends Component {
    constructor() {
        super('div', { className: 'bootMenu' })
        this.t = false
        this.#init()
    }

    #init() {
        const text = `Please enter a Username under [x] characters to enter lobby.`
        const window = new Component('div')
        const queryText = new Component('p', {}, [text])
        const username = new Input({ type: 'text', placeholder: 'Username', name: 'boot-menu-username', value: "" })
        const submit = new Input({ type: 'submit', name: 'boot-menu-submit' })
        const bootForm = new Form({}, queryText, username, submit)
        bootForm.actionListener('submit', async (event) => {
            const username = getFormValues(event)['boot-menu-username']
            this.sendUsername(username)
            console.log("------------");
        })

        window.addElement(bootForm)
        this.addElement(window)
    }

    async init2() {
        const text = `Please enter a Username under [x] characters to enter lobby.`
        const window = new Component('div')
        const queryText = new Component('p', {}, [text])
        const username = new Input({ type: 'text', placeholder: 'Username', name: 'boot-menu-username', value: "" })
        const submit = new Input({ type: 'submit', name: 'boot-menu-submit' })
        const bootForm = new Form({}, queryText, username, submit)


        bootForm.actionListener('submit', async (event) => {
            const username = getFormValues(event)['boot-menu-username']
            if (this.sendUsername(username)) Promise.resolve()
            console.log("------------");
        })

        window.addElement(bootForm)
        this.addElement(window)  
    }

    async init3() {
        const text = `Please enter a Username under [x] characters to enter lobby.`
        const window = new Component('div')
        const queryText = new Component('p', {}, [text])
        const username = new Input({ type: 'text', placeholder: 'Username', name: 'boot-menu-username', value: "" })
        const submit = new Input({ type: 'submit', name: 'boot-menu-submit' })
        const bootForm = new Form({}, queryText, username, submit)


        bootForm.actionListener('submit', async (event) => {
            const username = getFormValues(event)['boot-menu-username']
            if (this.sendUsername(username)) Promise.resolve()
            console.log("------------");
        })

        window.addElement(bootForm)
        this.addElement(window)        
    }


    async sendUsername(username) {
        console.log("trigger send");
        try {
            const res = await fetch(`http://localhost:8080/api/join`, {
                method: 'POST',
                body: JSON.stringify({ username }),
            })

            if (res.ok) {
                this.username = username
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    ok() {
        console.log("this.username", this.username);
        return this.username != ''
    }
}