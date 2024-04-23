import Entity from "../entity.js";
import { TabSprite } from "../../sprite/sprite.js";
import { SpriteAtlas } from "../../data/spriteatlas.js";

export default class Props extends Entity {
    constructor(systemeData, typeProps) {
        super(systemeData, typeProps)
        this.atlas = SpriteAtlas.entity.props[typeProps];
        this.TabSprite = new TabSprite(this.atlas.image, this.atlas.spriteSize, this.atlas.height, this.atlas.width).tab;
    }
}