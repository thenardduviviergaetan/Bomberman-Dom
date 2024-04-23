import Blast from "../blast/blast.js";
import Props from "../props.js";

export default class Bomb extends Props {
    constructor(systemeData, posx, posy, typeBomb, owner, dateCreateBomb) {
        super(systemeData, "bomb")
        this.posx = posx;
        this.posy = posy;
        this.HTML.style.transform = `translate(${this.posx}px,${this.posy}px)`
        this.spriteAnimation = this.atlas.typeBomb[typeBomb];
        this.dateCreateBomb = dateCreateBomb !== undefined ? dateCreateBomb : new Date().getTime();
        console.log(this.dateCreateBomb)
        this.setSprite(this.TabSprite[
            this.spriteAnimation[
            this.animationId % this.spriteAnimation.length
            ]
        ]);
        this.owner = owner;
        document.getElementById("game").appendChild(this.HTML);
        // this.setSprite(this.)
    }
    update() {
        let time = new Date().getTime()
        if (time - this.dateCreateBomb > 500) {
            this.dateCreateBomb = time;
            this.animationId++
            if (this.animationId > this.spriteAnimation.length-1) {
                this.HTML.remove();
                this.SystemeData.playerBomb[this.owner] = {
                    onBomb: false,
                    bomb:0
                }
                new Blast(this.SystemeData,this.posx,this.posy);
            } else {
                this.setSprite(this.TabSprite[
                    this.spriteAnimation[
                    this.animationId % this.spriteAnimation.length
                    ]
                ]);
            }

        }
    }
}