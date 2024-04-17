// class TabSprite{
//     constructor(path,size,height,width){
//         //console.log(path)
//         this.tab = new Array();
//         this.tab.push(new Sprite(`${size}px`,`${size}px`,`url()`,`-0px -0px`))
//         let tempheight = 0
//         while(tempheight < height){
//             let tempwidth = 0;
//             while(tempwidth < width){
//                 let sprite = new Sprite(`${size}px`,`${size}px`,`url(${path})`,`-${tempwidth}px -${tempheight}px`)
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

export class TabSprite {
    constructor(pathImage,size,height,width){
        this.tab = new Array();
        // this.tab.push(new Sprite(size,size,"","",""));
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
        // console.log(this)
    }
}