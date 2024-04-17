import { TileMapindex } from "./matris.js";

export class Map {
    constructor(pathimage,size, level){
        this.Level = level;
        let tempimg = new Image();
        tempimg.src = `${pathimage}`;
        this.tabSprite = new TabSprite(pathimage,size,tempimg.height,tempimg.width).tab;
        this.map = TileMapindex[this.Level];
        this.tab = new Array();
        this.HTML = document.createElement("div");
        this.HTML.classList.add("background");
        let screenBounding = document.getElementById("game").getBoundingClientRect();
        this.posx = 0;
        this.posy = 0;
        this.HTML.style.position = "absolute"
        this.HTML.style.top =  this.posy+"px";
        this.HTML.style.left = this.posx+"px";
        this.HTML.style.width = screenBounding.width;
        this.HTML.style.height = screenBounding.height;
        this.initMap()
    }
    draw(){
        for(let line = 0;line < this.tab.length;line++){
            for(let col = 0;col < this.tab[line].length;col++){
                this.tab[line][col].style.width = this.tabSprite[this.map[line][col]].width;
                this.tab[line][col].style.height = this.tabSprite[this.map[line][col]].height;
                this.tab[line][col].style.backgroundImage = this.tabSprite[this.map[line][col]].image;
                this.tab[line][col].style.backgroundPosition = this.tabSprite[this.map[line][col]].position;
            }  
        }
    }
    initMap(){
        this.map.forEach((line) => {
            let tabline = new Array();
            let divLine = document.createElement("div");
            divLine.classList.add("backline");
            line.forEach((element) => {
                let cases = document.createElement("div");
                cases.classList.add("case");
                divLine.appendChild(cases);
                tabline.push(cases);
            });
            this.HTML.appendChild(divLine);
            this.tab.push(tabline);
        });
        this.draw();
    }
}

// class TabSprite{
//     constructor(path,size,height,width){
//         this.tab = new Array();
//         this.tab.push(new Sprite(`${size}px`,`${size}px`,`url()`,`-0px -0px`))
//         let tempheight = 0
//         while(tempheight < height){
//             let tempwidth = 0;
//             while(tempwidth < width){
//                 let sprite = new Sprite(`${size}px`,`${size}px`,`url(${path})`,`-${tempwidth}px -${tempheight}px`)
//                 // console.log(sprite)
//                 this.tab.push(sprite)
//                 tempwidth += size
//             }
//             tempheight += size
//         }
//     }
// }

// class Sprite{
//     constructor(width,height,image,position){
//         this.width = width;
//         this.height  = height;
//         this.image = image;
//         this.position = position;
//     }
// }