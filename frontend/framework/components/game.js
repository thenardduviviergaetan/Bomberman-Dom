import Component from "./component.js";

export default class Game extends Component {
    constructor(props, ws,username) {
        super("section", props);
        this.username = username;
        this.ws = ws;
        return this;
    }
}