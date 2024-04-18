import Entity from "../entity";

export default class Props extends Entity{
    constructor(systemeData,typeProps){
        super(systemeData, typeProps)
        this.atlas = SpriteAtlas.entity.props[typeProps];
    }
}