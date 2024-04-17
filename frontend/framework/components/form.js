import Component from "./component.js";

/**
 * Represents a form component.
 * @class
 * @extends Component
 */
export default class Form extends Component {
    /**
     * Creates an instance of Form.
     * @param {Object} props - The properties for the form.
     * @param {...Input} inputs - The input elements to be added to the form.
     */
    constructor(props, ...inputs) {
        super("form", props);
        this.props.className = "form";
        return this.init(...inputs);
    }

    /**
     * Initializes the form by adding input elements.
     * @param {...Input} inputs - The input elements to be added to the form.
     * @returns {HTMLElement} - The form element.
     */
    init(...inputs) {
        const form = this.addElement(...inputs);
        return form;
    }
}

