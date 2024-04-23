// import { TileMapindex } from "./matris.js";

import HtmlMap from "./htmlmap.js";

export class Level extends HtmlMap {
    constructor(levelData) {
        super(levelData);
        // this.tab = new Array();
        this.tab = {};
        this.initSpriteTab();
        this.initMap()
    }
    updateCase(typeLayer,raws,col){
        
    }
    draw(layer) {
        for (let line = 0; line < this.tab[layer].length; line++) {
            for (let col = 0; col < this.tab[layer][line].length; col++) {
                // let idSprite = this.LevelData.map[0].matris[line][col]
                let idSprite = this.LevelData.map.matris[layer][line][col]
                let element = this.tab[layer][line][col];
                // let sprite = this.tabSprite[this.LevelData.map[0].type][idSprite];
                let sprite = this.tabSprite[this.LevelData.map.type][idSprite];
                element.style.width = sprite.width;
                element.style.height = sprite.height;
                element.style.backgroundImage = sprite.image;
                element.style.backgroundPosition = sprite.position;
                // console.log(element)
                switch (true) {
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
    initMap() {
        let posx = 0, id = 0;
        // this.LevelData.map[0].matris.forEach((line) => {
        // console.log(this.levelData)
        const tabLayer = Object.entries(this.LevelData.map.matris);
        console.log(tabLayer)
        tabLayer.forEach(([layerKey, layer]) => {
            this.tab[layerKey] = new Array();
            let divLayer = document.createElement("div");
            divLayer.id = layerKey;
            divLayer.classList.add(layerKey);
            layer.forEach((line) => {
                let tabline = new Array();
                let divLine = document.createElement("div");
                divLine.classList.add("backline");
                let posy = 0;
                line.forEach((element) => {
                    let cases = document.createElement("div");
                    cases.classList.add("case");
                    // enlever raws: et col avant audit
                    // cases.id = `cases:${id} raws:${posx} col:${posy}`;
                    cases.id = `raws:${posx} col:${posy}`;
                    id++;
                    posy++;
                    divLine.appendChild(cases);
                    tabline.push(cases);
                });
                posx++;
                divLayer.appendChild(divLine);
                this.tab[layerKey].push(tabline);
            });
            this.HTML.appendChild(divLayer);
            this.draw(layerKey);
        });
        // this.draw();
    }
    test() {
        console.log(this.tab[5][15].id)
        console.log(document.getElementById(this.tab[5][15].id).getBoundingClientRect())
    }
}