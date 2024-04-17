import { TabSprite } from "../../sprite/sprite.js";
import { SpriteAtlas } from "../../data/spriteatlas.js";
import Entity from "../entity.js";

export class Player extends Entity {
    constructor(SystemeData, spriteplayer) {
        super(SystemeData, "player");
        this.atlas = SpriteAtlas.entity[spriteplayer];
        this.spriteIdle = this.atlas.idle
        this.spriteLeft = this.atlas.left
        this.spriteRight = this.atlas.right
        this.spriteUp = this.atlas.up
        this.spriteDown = this.atlas.down
        this.TabSprite = new TabSprite(this.atlas.image, this.atlas.spriteSize, this.atlas.height, this.atlas.width).tab;
        console.log(this.TabSprite)
        this.setSprite(this.TabSprite[this.spriteIdle[this.animationId]]);
        // this.id = "player";
        // this.HTML.id = this.id;
    }
    move(x, y) {
        // console.log()
        if (typeof x === "number" && typeof y === "number") {
            this.posy = y;
            this.posx = x;
            this.setSprite(this.TabSprite[this.spriteIdle[this.animationId % 1]]);
        }
        this.checkColision();
        this.animationId++;
        const id = parseInt(this.animationId / 8)
        switch (true) {
            case this.SystemeData.inputkey["q"]:
                if (!this.isGroundLeft) {
                    this.posx--
                }
                this.setSprite(this.TabSprite[this.spriteLeft[id % this.spriteLeft.length]]);
                break;
            case this.SystemeData.inputkey["d"]:
                if (!this.isGroundRight) {
                    this.posx++
                }
                // console.log()
                this.setSprite(this.TabSprite[this.spriteRight[id % this.spriteRight.length]]);
                break;
            case this.SystemeData.inputkey["z"]:
                if (!this.isGroundTop) {
                    this.posy--
                }
                this.setSprite(this.TabSprite[this.spriteUp[id % this.spriteUp.length]]);
                break;
            case this.SystemeData.inputkey["s"]:
                if (!this.isGround) {
                    this.posy++
                }
                this.setSprite(this.TabSprite[this.spriteDown[id % this.spriteDown.length]]);
                break;
            default:
                this.setSprite(this.TabSprite[this.spriteIdle[this.animationId % 1]]);
                break;

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