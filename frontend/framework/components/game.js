import Component from "./component.js";

export default class Game extends Component {
    constructor(props, ws, username) {
        super("section", props);
        this.username = username;
        this.ws = ws;
        
        this.size = 19;
        // 0 = spawn
        // 1 = Wall
        // 2 = stone
        // 3 = path
        // 4 = only path
        this.atlas = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 4, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 4, 0, 1],
            [1, 4, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 4, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
            [1, 4, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 4, 1],
            [1, 0, 4, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 4, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        this.background();
        // return this;
    }


    background() {
        const background = new Component("div", { class: "background", style: "background-color:green;width:608px; height:608px;" });
        const block_wall = new Component("div", { class: "wall", style: "background-color:black;width:32px;height:32px;" });
        const block_path = new Component("div", { class: "path", style: "background-color:transparent;width:32px;height:32px;" })
        const block_stone = new Component("div", { class: "props", style: "background-color:grey;width:32px;height:32px;" })
        const block_playerCase = new Component("div", { class: "props", style: "background-color:blue;width:32px;height:32px;" })
        // const block_spawn = new Component("div", { class: "props", style: "background-color:red;width:32px;height:32px;" })

        for (let line of this.atlas) {
            const lineMap = new Component("div", { class: "line", style: "display:flex;flex-direction:row;width:100%;height:fit-content;" })
            line.forEach(type => {
                switch (type) {
                    case 1:
                        lineMap.addElement(block_wall);
                        break;
                    case 2:
                        lineMap.addElement(block_stone)
                        break;
                    case 3:
                        lineMap.addElement(block_path)
                        break;
                    case 0:
                        lineMap.addElement(block_playerCase)
                        break;
                    case 4:
                        lineMap.addElement(block_path)
                        break;
                    default:
                        break;
                }
            });
            background.addElement(lineMap);
        }
        this.addElement(background);
    }


    randomizeBlock(){

    }

}