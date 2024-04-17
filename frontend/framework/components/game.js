import Component from "./component.js";

export default class Game extends Component {
    constructor(props, ws) {
        super("section", props);
        this.ws = ws;
        return this;
    }
}