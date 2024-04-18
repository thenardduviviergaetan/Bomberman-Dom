import Component from "../framework/components/component.js";

export class Input extends Component{
    /**
     * Creates an instance of Input.
     * @constructor
     * @param {object} props - The properties for the input component.
     */
    constructor(props, attributes) {
        super('input', props, attributes)
        this.props.className = 'input'
    }
}