import Component from "../component.js";
import Bonus from "./bonus.js";
import { getBorder } from '../function.js'

// Tile types enumeration
const TILE_TYPES = {
    WALL: 1,
    BLOCK: 2,
    PATH: 3,
    SPAWN: 0,
    SAFE_ZONE: 4,
    BONUS_1: 5,
    BONUS_2: 6,
    BONUS_3: 7
}

/**
 * Represents the game map component.
 */
export default class Map extends Component {
    /**
     * Constructs a new instance of the Map component.
     * @param {Array} atlas - The map atlas.
     */
    constructor(atlas) {
        super("div", { class: "map-container", id: "map" })
        this.atlas = atlas;
        this.tileSize = 32;
        this.tileSetImage = 'url(./framework/components/game/assets/world1-32x32.png)'
        this.bonusMap = []
        this.initMap();
        return this;
    }

    /**
     * Initializes the game map.
     */
    initMap() {
        const wall = new Component("div", { class: "wall", style: `background-image: ${this.tileSetImage}; background-position: -${32}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
        const path = new Component("div", { class: "path", style: `background-image: ${this.tileSetImage}; background-position: -${0}px -${32}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
        const shadow = new Component("div", { class: "shadow", style: `background-image: ${this.tileSetImage}; background-position: -${64}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
        const spawn = new Component("div", { class: "spawn", style: `background-image: ${this.tileSetImage}; background-position: -${0}px -${0}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
        this.path = path;
        this.shadow = shadow;
        for (let y = 0; y < this.atlas.length; y++) {
            const lineMap = new Component("div", { class: "line" })
            for (let x = 0; x < this.atlas[y].length; x++) {
                let type = this.atlas[y][x];
                let block;
                switch (type) {
                    case TILE_TYPES.WALL:
                        block = wall
                        break;
                    case TILE_TYPES.BLOCK:
                        block = new Component("div", { class: "block", style: `background-image: ${this.tileSetImage}; background-position: -${32}px -${32}px; width: ${this.tileSize}px; height: ${this.tileSize}px` });
                        break;
                    case TILE_TYPES.PATH:
                        (y > 0 && (this.atlas[y - 1][x] === 1 || this.atlas[y - 1][x] === 2)) ? block = shadow : block = path;
                        break;
                    case TILE_TYPES.SPAWN:
                        block = spawn
                        break;
                    case TILE_TYPES.SAFE_ZONE:
                        (y > 0 && (this.atlas[y - 1][x] === 1 || this.atlas[y - 1][x] === 2)) ? block = shadow : block = path;
                        break;
                    case TILE_TYPES.BONUS_1:
                    case TILE_TYPES.BONUS_2:
                    case TILE_TYPES.BONUS_3:
                        block = new Bonus(this.atlas, this.tileSize, this.tileSetImage, type - TILE_TYPES.BONUS_1 + 1)
                        this.bonusMap.push(getBorder(block.children[0], y, x))
                        break
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

    /**
     * Removes a bonus from the game map.
     * @param {Object} bonusData - The bonus data.
     */
    async removeBonus(bonusData) {
        const top = this.children[bonusData.indexY - 1].children[bonusData.indexX]
        this.children[bonusData.indexY].children[bonusData.indexX] = top.props.class === "block" || top.props.class === "wall" ? this.shadow : this.path;
        await this.update()
    }
}