import Component from "./component.js";

export default class Input extends Component {
    constructor(props) {
        super("input", props);
        this.props.className = "input";
    }
}