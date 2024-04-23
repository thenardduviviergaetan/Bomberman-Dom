//class generant un tableaux de sprite
export class TabSprite {
    constructor(pathImage,size,height,width){
        this.tab = new Array();
        for( let tempHeight = 0; tempHeight < height; tempHeight+=size){
            for(let tempWidth = 0; tempWidth < width; tempWidth+=size){
                this.tab.push(new Sprite(size,size,pathImage,tempWidth,tempHeight));
            }
        }
    }
}

class Sprite {
    constructor(width,height,image,positionX,positionY){
        this.width = `${width}px`;
        this.height = `${height}px`;
        this.image = `url(${image})`;
        this.position = `-${positionX}px -${positionY}px`;
    }
}