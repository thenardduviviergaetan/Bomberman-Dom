// import { TileMapindex } from "./matris.js";

import HtmlMap from "./htmlmap.js";

export class Level extends HtmlMap{
    constructor(levelData){
        super(levelData);
        this.tab = new Array();
        this.initSpriteTab();
        this.initMap()
    }
    draw(){
        for(let line = 0;line < this.tab.length;line++){
            for(let col = 0;col < this.tab[line].length;col++){
                let idSprite = this.LevelData.map[0].matris[line][col]
                let element = this.tab[line][col];
                let sprite = this.tabSprite[this.LevelData.map[0].type][idSprite];
                element.style.width = sprite.width;
                element.style.height = sprite.height;
                element.style.backgroundImage = sprite.image;
                element.style.backgroundPosition = sprite.position;
                // console.log(element)
                switch(true){
                    case this.property.solide.includes(idSprite):
                        element.classList.add("solide");
                        break;
                    case this.property.brick.includes(idSprite):
                        element.classList.add("brick");
                        break;
                    case this.property.bonus.includes(idSprite):
                        element.classList.add("bonus");
                        break;
                    default:
                        element.classList.add("air");
                        break;
                }
            }  
        }
    }
    initMap(){
        let posx = 0 , id = 0;
        this.LevelData.map[0].matris.forEach((line) => {
            let tabline = new Array();
            let divLine = document.createElement("div");
            divLine.classList.add("backline");
            let posy = 0;
            line.forEach((element) => {
                let cases = document.createElement("div");
                cases.classList.add("case");
                // enlever raws: et col avant audit
                cases.id = `cases:${id} raws:${posx} col:${posy}`;
                id++;
                posy++;
                divLine.appendChild(cases);
                tabline.push(cases);
            });
            posx++;
            this.HTML.appendChild(divLine);
            this.tab.push(tabline);
        });
        this.draw();
    }
    test() {
        console.log(this.tab[5][15].id)
        console.log(document.getElementById(this.tab[5][15].id).getBoundingClientRect())
    }
}