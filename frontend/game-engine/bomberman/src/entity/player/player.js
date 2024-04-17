import { TabSprite } from "../../sprite/sprite.js";
import { SpriteAtlas } from "../../data/spriteatlas.js";
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
        this.isGround = false;
        this.isGroundLeft = false;
        this.isGroundRight = false;
        this.isGroundTop = false
        let groundTesting = [".solide", ".brick", ".bonus"];
        groundTesting.forEach(typeBlock => {
            this.checkGround(typeBlock, playerBorder);
        })
    }
    checkGround(type, playerBorder) {
        const listBlock = document.querySelectorAll(type);
        // const block = document.getElementById("cases:4 raws:0 col:4")
        // const block2 = document.getElementById("cases:5 raws:0 col:5")
        // const block3 = document.getElementById("cases:32 raws:2 col:2")
        // const block4 = document.getElementById("cases:34 raws:2 col:4")
        // const listBlock = [block, block2, block3, block4]
        listBlock.forEach(block => {
            const blockBorder = block.getBoundingClientRect();
            const quoteOffset = 10
            const quoteTop = 12
            const testX = (
                (blockBorder.left < playerBorder.left + quoteOffset && playerBorder.left + quoteOffset < blockBorder.right) ||
                (blockBorder.left < playerBorder.right + quoteOffset && playerBorder.right + quoteOffset < blockBorder.right)
            );
            const testBottom = playerBorder.bottom == blockBorder.top;
            const testTop = playerBorder.top + quoteTop == blockBorder.bottom;
            // let testz = playerBorder.bottom >= blockBorder.top && playerBorder.top + quoteTop <= blockBorder.bottom;
            const testz = (
                (playerBorder.bottom > blockBorder.top && playerBorder.bottom < blockBorder.bottom) ||
                (playerBorder.top + quoteTop < blockBorder.bottom && playerBorder.top + quoteTop > blockBorder.top)
            );
            const testLeft = (
                (playerBorder.left + quoteOffset >= blockBorder.right - 1) &&
                (playerBorder.left + quoteOffset <= blockBorder.right + 1)
            ) && testz
            const testRight = (
                (playerBorder.right - quoteOffset >= blockBorder.left - 1) &&
                (playerBorder.right - quoteOffset <= blockBorder.left + 1)
            ) && testz
            if (testLeft && !testBottom) {
                this.isGroundLeft = true;
            }
            if (testRight && !testBottom) {
                this.isGroundRight = true;
            }
            if (testBottom && testX && (!testRight && !testLeft)) {
                // this.lastGroundX = playerBorder.bottom;
                this.isGround = true;
            }
            if (testTop && testX && (!testRight && !testLeft)) {
                this.isGroundTop = true;
            }
            // console.log(playerBorder.left, blockBorder.right, this.isGroundLeft, testLeft, !testBottom)
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