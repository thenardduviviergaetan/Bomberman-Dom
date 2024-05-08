export default class TabSprite {
    constructor(pathImage, size, height, width) {
        this.tab = new Array();
        for (let tempHeight = 0; tempHeight < height; tempHeight += size) {
            for (let tempWidth = 0; tempWidth < width; tempWidth += size) {
                this.tab.push(new Sprite(size, size, pathImage, tempWidth, tempHeight));
            }
        }
    }
}

class Sprite {
    constructor(width, height, image, positionX, positionY) {
        this.style = `background-image: url(${image}); background-position: -${positionX}px -${positionY}px; width: ${width}px; height: ${height}px;`
    }
}