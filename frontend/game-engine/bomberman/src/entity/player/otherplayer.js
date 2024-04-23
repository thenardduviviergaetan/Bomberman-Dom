import { Player } from "./player.js";

export default class OtherPlayer extends Player {
    constructor(SystemeData, spritePlayer, pseudo) {
        super(SystemeData, spritePlayer, pseudo)
    }
    move(x, y) {
        // console.log()
        if (typeof x === "number" && typeof y === "number") {
            this.posy = y;
            this.posx = x;
            this.setSprite(this.TabSprite[this.spriteIdle[this.animationId % 1]]);
            return;
        }
        this.checkColision();
        this.animationId++;
        const id = parseInt(this.animationId / 8)
        switch (true) {
            case this.SystemeData.inputkey[this.id]["Shift"]:
                if (!this.SystemeData.playerBomb[this.id].onBomb) {
                    this.SystemeData.playerBomb[this.id] = {
                        onBomb: true,
                        bomb: (this.SystemeData.playerBomb[this.id].bomb + 1)
                    }
                }
                break
            case this.SystemeData.inputkey[this.id]["ArrowLeft"]:
                if (!this.isGroundLeft) {
                    this.posx--
                }
                this.setSprite(this.TabSprite[this.spriteLeft[id % this.spriteLeft.length]]);
                break;
            case this.SystemeData.inputkey[this.id]["ArrowRight"]:
                if (!this.isGroundRight) {
                    this.posx++
                }
                // console.log()
                this.setSprite(this.TabSprite[this.spriteRight[id % this.spriteRight.length]]);
                break;
            case this.SystemeData.inputkey[this.id]["ArrowUp"]:
                if (!this.isGroundTop) {
                    this.posy--
                }
                this.setSprite(this.TabSprite[this.spriteUp[id % this.spriteUp.length]]);
                break;
            case this.SystemeData.inputkey[this.id]["ArrowDown"]:
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
}