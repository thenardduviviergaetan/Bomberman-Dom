import Component from "../framework/components/component.js";
import Form from "../framework/components/form.js";
import Input from "../framework/components/input.js";
import { getFormValues } from "../framework/engine/engine.js";
export default class BootMenu extends Component {
    constructor() {
        super('div', { className: 'bootMenu' })
    }

    async init2(resolve) {
        const text = `Please enter a Username under [x] characters to enter lobby.`
        const window = new Component('div')
        const queryText = new Component('p', {}, [text])
        const username = new Input({ type: 'text', placeholder: 'Username', name: 'boot-menu-username', value: "" })
        const submit = new Input({ type: 'submit', name: 'boot-menu-submit' })
        const bootForm = new Form({}, queryText, username, submit)

        bootForm.actionListener('submit', async (event) => {
            const username = getFormValues(event)['boot-menu-username']
            // if (this.sendUsername(username)) resolve(username)
            this.sendUsername(username)
                .then(() => {
                    console.log("Resolving the issue")
                    resolve(username)
                })
                .catch((error) => {
                    console.log("Error during fetch")
                    console.log(error)
                })
        })

        window.addElement(bootForm)
        this.addElement(window)  
    }

    async sendUsername(username) {
        fetch(`http://localhost:8080/api/join`, {
            method: 'POST',
            body: JSON.stringify({ username }),
        })

        // try {
        //     // const res = await fetch(`http://localhost:8080/api/join`, {
        //     await fetch(`http://localhost:8080/api/join`, {
        //         method: 'POST',
        //         body: JSON.stringify({ username }),
        //     })

        //     return true

        //     if (res.ok) {
        //         this.username = username
        //     }
        // } catch (error) {
        //     console.log(error);
        //     return false
        // }
    }

    ok() {
        console.log("this.username", this.username);
        return this.username != ''
    }
}