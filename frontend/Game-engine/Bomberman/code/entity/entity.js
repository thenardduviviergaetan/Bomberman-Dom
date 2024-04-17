export default class Entity {
    constructor(SystemeData, type) {
        this.directionRight = true;
        this.SystemeData = SystemeData;
        this.HTML = document.createElement("div");
        this.HTML.classList.add(type);
        this.posy = 16;
        this.posx = 16;
        this.isGround = true;
        this.isGroundRight = true;
        this.isGroundLeft = true;
        this.isGroundTop = true;
        this.lastGroundX = 0;
    }
    setSprite(element, sprite) {
        element.style.width = sprite.width;
        element.style.height = sprite.height;
        // element.style.width = "15px";//sprite.width;
        // element.style.height = "15px";//sprite.height;
        element.style.backgroundImage = sprite.image;
        // element.style.backgroundSize = "96px";
        element.style.backgroundPosition = sprite.position;
    }

}