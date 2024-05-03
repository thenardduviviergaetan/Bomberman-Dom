import Component from "../component.js";

const TILE_TYPES = {
    WALL: 1,
    BLOCK: 2,
    PATH: 3,
    SPAWN: 0,
    SAFE_ZONE: 4
}

export default class Map extends Component {
    constructor(atlas) {
        super("div", { class: "map-container", id: "map" })
        this.atlas = atlas;
        this.tileSize = 32;
        this.tileSetImage = 'url(./framework/components/game/assets/world1-32x32.png)'
        this.initMap();
        return this;
    }

    initMap() {
        for (let y = 0; y < this.atlas.length; y++) {
            const lineMap = new Component("div", { class: "line" })
            for (let x = 0; x < this.atlas[y].length; x++) {
                let type = this.atlas[y][x];
                let block;
                switch (type) {
                    case TILE_TYPES.WALL:
                        block = new Component("div", { class: "wall", style: `background-image: ${this.tileSetImage}; background-position: -${32}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        break;
                    case TILE_TYPES.BLOCK:
                        block = new Component("div", { class: "block", style: `background-image: ${this.tileSetImage}; background-position: -${32}px -${32}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        break;
                    case TILE_TYPES.PATH:
                        if (y > 0 && (this.atlas[y - 1][x] === 1 ||this.atlas[y-1][x]===2 )) {
                            block = new Component("div", { class: "path", style: `background-image: ${this.tileSetImage}; background-position: -${64}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        } else {
                            block = new Component("div", { class: "path", style: `background-image: ${this.tileSetImage}; background-position: -${0}px -${32}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        }
                        break;
                    case TILE_TYPES.SPAWN:
                        block = new Component("div", { class: "spawn", style: `background-image: ${this.tileSetImage}; background-position: -${0}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        break;
                    case TILE_TYPES.SAFE_ZONE:
                        if (y > 0 && (this.atlas[y - 1][x] === 1 ||this.atlas[y-1][x]===2 )) {
                            block = new Component("div", { class: "path", style: `background-image: ${this.tileSetImage}; background-position: -${64}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        } else {
                            block = new Component("div", { class: "path", style: `background-image: ${this.tileSetImage}; background-position: -${0}px -${32}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        }
                        break;
                    default:
                        break;
                }
                if (block) {
                    lineMap.addElement(block);
                }
            }
            this.addElement(lineMap);
        }
    }
}