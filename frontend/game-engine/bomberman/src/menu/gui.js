const backgroundColor = "rgba(99,97,97,0.5)"
export default class Gui{
    constructor(id,name,width,height,posx,posy,systemeData) {
        this.height = height;
        this.width = width;
        this.HTML = document.createElement("div");
        this.HTML.name = name;
        this.HTML.id = id;
        this.HTML.style.width = `${width}px`;
        this.HTML.style.height = `${height}px`;
        this.HTML.style.position = "absolute"
        this.HTML.style.top = `${posy-height/2}px`;
        this.HTML.style.left = `${posx-width/2}px`;
        this.HTML.style.backgroundColor = backgroundColor;
        this.systemeData = systemeData
    }
    draw(isDisplay){
        if (isDisplay){
            // console.log(window.innerHeight,window.innerWidth)
            // console.log()
            this.HTML.style.top = `${(window.innerHeight/2)-this.height/2}px`;
            this.HTML.style.left = `${window.innerWidth/2-this.width/2+this.systemeData.screenX}px`;
            this.HTML.style.display = "";
        }else{
            this.HTML.style.display = "none";
        }
    }
}

// export class WorldMenu extends Gui{

// }