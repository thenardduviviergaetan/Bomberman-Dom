import { TabSprite } from "../../sprite/sprite.js";
import { SpriteAtlas } from "../../data/constdatalevel.js";
import Entity from "../entity.js";

export class Player extends Entity {
    constructor(SystemeData, spriteplayer) {
        super(SystemeData, "player");
        this.atlas = SpriteAtlas.entity[spriteplayer];
        console.log(this.atlas)
        this.TabSprite = new TabSprite(this.atlas.image, this.atlas.spriteSize, this.atlas.height, this.atlas.width).tab;
        console.log(this.TabSprite, "TEST");
        this.setSprite(this.HTML, this.TabSprite[0]);
        this.id = "player";
        this.HTML.id = this.id;
        this.isJump = false;
    }
    move(direction) {
        this.checkColision();
        this.directionRight = direction;
        if (this.SystemeData.inputkey["z"]) {
            if (!this.isGroundTop) {
                this.posy--
            }
        }
        if (this.SystemeData.inputkey["s"]) {
            if (!this.isGround) {
                this.posy++
            }
        }
        if (this.SystemeData.inputkey["q"]) {
            if (!this.isGroundLeft) {
                this.posx--
            }
        }
        if (this.SystemeData.inputkey["s"]) {
            // console.log("S")
        }
        if (this.SystemeData.inputkey["d"]) {
            if (!this.isGroundRight) {
                this.posx++
            }
        }
        this.HTML.style.transform = `translate(${this.posx}px,${this.posy}px)`

    }
    checkColision() {
        // let solidBlock = document.querySelectorAll('.solide');
        // let playerBorder = document.getElementById(this.id).getBoundingClientRect();
        let playerBorder = this.HTML.getBoundingClientRect();
        this.isGround = this.isJump;
        this.isGroundLeft = false;
        this.isGroundRight = false;
        this.isGroundTop = false
        let groundTesting = [".solide", ".brick", ".bonus"];
        groundTesting.forEach(typeBlock => {
            this.checkGround(typeBlock, playerBorder);
        })
    }
    checkGround(type, playerBorder) {
        let listBlock = document.querySelectorAll(type);
        listBlock.forEach(block => {
            let blockBorder = block.getBoundingClientRect();
            let decallage = 3
            let testX = (blockBorder.left <= playerBorder.left + decallage && playerBorder.left + decallage <= blockBorder.right) ||
                (blockBorder.left <= playerBorder.right + decallage && playerBorder.right + decallage <= blockBorder.right);
            let testBottom = playerBorder.bottom == blockBorder.top;
            let testTop = playerBorder.top + decallage == blockBorder.bottom;
            let testz = playerBorder.bottom >= blockBorder.top && playerBorder.top <= blockBorder.bottom;
            let testLeft = playerBorder.left + decallage == blockBorder.right && testz
            let testRight = playerBorder.right - decallage == blockBorder.left && testz
            if (testLeft && !testBottom) {
                this.isGroundLeft = true;
            } else if (testRight && !testBottom) {
                this.isGroundRight = true;
            } else if (testBottom && testX && (!testRight && !testLeft)) {
                this.lastGroundX = playerBorder.bottom;
                this.isGround = true;
            } else if (testTop && testX && (!testRight && !testLeft)) {
                this.isGroundTop = true;
            }
        });
    }
}

// var rect1 = { x: 5, y: 5, width: 50, height: 50 };
// var rect2 = { x: 20, y: 10, width: 10, height: 10 };

// if (
//   rect1.x < rect2.x + rect2.width &&
//   rect1.x + rect1.width > rect2.x &&
//   rect1.y < rect2.y + rect2.height &&
//   rect1.height + rect1.y > rect2.y
// ) {
//   // collision détectée !
// }