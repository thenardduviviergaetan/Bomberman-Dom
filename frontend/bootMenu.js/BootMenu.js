import Component from "../framework/components/component.js";
import Form from "../framework/components/form.js";
import Input from "../framework/components/input.js";
import { getFormValues } from "../framework/engine/engine.js";
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
            // console.log(event);
            // console.log("testing button");
            // const form = new FormData(event)
            const username = getFormValues(event)['boot-menu-username']
            console.log(username)
            // console.log("Formvalue",form.get('boot-menu-username'))

            this.#sendUsername(username)
        })

        window.addElement(bootForm)
        this.addElement(window)
    }

    #sendUsername(username) {
        try{
            const res = fetch(`http://${window.location.hostname}:8080/api/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            if(res.ok){
                console.log('fetch ok');
            }
        } catch (e){
            console.error(e)
        }
    }
}