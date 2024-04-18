import { TabSprite } from "../sprite/sprite.js";
import { SpriteAtlas } from "../data/spriteatlas.js";
export default class HtmlMap {
    constructor(levelData){
        console.log(levelData)
        this.LevelData = levelData;
        this.property = levelData.property;

        this.HTML = document.createElement("div");
        this.HTML.id = "background"
        this.HTML.classList.add("background");
        // let screenGame = document.getElementById("game");
        // screenGame.style.width = this.property.background.width;
        // screenGame.style.height = this.property.background.height;
        // screenGame.style.backgroundColor = this.property.background.color;
        this.posx = 0;
        this.posy = 0;
        // this.HTML.style.position = "absolute"
        // this.HTML.style.top =  this.posy+"px";
        // this.HTML.style.left = this.posx+"px";
        // this.HTML.style.width = this.property.background.width;
        // this.HTML.style.height = this.property.background.height;
    }
    initSpriteTab(){
        this.tabSprite = {};
        Object.keys(SpriteAtlas.maping).forEach((typeWorld) => {
            this.tabSprite[typeWorld] = new TabSprite(
                SpriteAtlas.maping[typeWorld].image,
                SpriteAtlas.maping[typeWorld].spriteSize,
                SpriteAtlas.maping[typeWorld].height,
                SpriteAtlas.maping[typeWorld].width).tab
                ;
        })
        // console.log(this.tabSprite)
    }
}