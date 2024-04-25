import Component from "../component.js";

export default class Map extends Component {
    constructor(atlas) {
        super("div", { class: "map-container", id:"map"})
        this.atlas = atlas;
        this.initMap();
        return this;
    }
    initMap() {
        // const background = new Component("div", { class: "background", style: "background-color:green;width:100%; height:100%;" });
        const block_wall = new Component("div", { class: "wall", style: "background-color:black;width:32px;height:32px;" });
        const block_path = new Component("div", { class: "path", style: "background-color:transparent;width:32px;height:32px;" })
        const block_breakable = new Component("div", { class: "props", style: "background-color:grey;width:32px;height:32px;" })
        const block_spawn = new Component("div", { class: "spawn", style: "background-color:blue;width:32px;height:32px;" })
        
        for (let line of this.atlas) {
            const lineMap = new Component("div", { class: "line", style: "display:flex;flex-direction:row;width:100%;height:fit-content;" })
            line.forEach(type => {
                switch (type) {
                    case 1:
                        lineMap.addElement(block_wall);
                        break;
                    case 2:
                        lineMap.addElement(block_breakable)
                        break;
                    case 3:
                        lineMap.addElement(block_path)
                        break;
                    case 0:
                        lineMap.addElement(block_spawn)
                        break;
                    case 4:
                        lineMap.addElement(block_path)
                        break;
                    default:
                        break;
                }
            });
            this.addElement(lineMap);
        }
    }
}