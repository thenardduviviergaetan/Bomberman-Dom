import Component from "../component.js";
import TabSprite from "./sprite.js";

const ANIMATION_FRAME = {
    0: [0, 1, 2],
    1: [3, 4, 5],
    2: [6, 7, 8],
    3: [9, 10, 11],
    4: [12, 13, 14]
}





export default class TabBomb extends Component {
    constructor() {
        super("div", { id: "TabBomb" }, [])
        this.tabSpriteBomb = new TabSprite("./framework/components/game/assets/bomb-32x32.png", 32, 160, 96).tab;
        console.log(this.tabSpriteBomb)
    }
    newBomb(BombMessage) {
        const bombSprite = []
        ANIMATION_FRAME[BombMessage.bombType].forEach(idsprite => {
            bombSprite.push(this.tabSpriteBomb[idsprite])
        });
        this.addElement(
            new Bomb(
                BombMessage.bombType,
                BombMessage.sender,
                BombMessage.position.x,
                BombMessage.position.y,
                BombMessage.date,
                bombSprite,
            )
        )
        this.update();
    }
    tick() {
        let numberChild = this.children.length;
        this.children = this.children.filter((bomb) => !bomb.tick());
        if (numberChild !== this.children.length) this.update();
    }
}

class Bomb extends Component {
    constructor(bombType, sender, posX, posY, date, spriteAnimation) {
        super(
            "div",
            {
                id: `${sender}-bomb`,
                class: "bomb",
                // style: `
                //     ${spriteAnimation[0].style} 
                //     top:${parseInt(posY / 32) * 32}; 
                //     left:${parseInt(posX / 32) * 32};
                //     `
                // style: {
                //     ...spriteAnimation[0].style,!
                //     top: `${parseInt(posY / 32) * 32}px;`,
                //     left: `${parseInt(posX / 32) * 32}px;`
                // }
            },
            []
        )
        console.log(this.props)
        this.bombType = bombType;
        this.sender = sender;
        this.posX = parseInt(posX / 32) * 32;
        this.posY = parseInt(posY / 32) * 32;
        this.dateCreateBomb = date;
        this.animationId = 0
        // this.props.style = `width: 32px; height: 32px; top: ${parseInt(posY / 32) * 32}px; left: ${parseInt(posX / 32) * 32}px; background-color: red;`
        this.props.style = `${spriteAnimation[0].style} top: ${parseInt(posY / 32) * 32}px; left: ${parseInt(posX / 32) * 32}px;`
        this.spriteAnimation = spriteAnimation;
    }
    tick() {
        // console.log(this)
        let time = new Date().getTime()
        let updateFrame = false;
        switch (true) {
            case time - this.dateCreateBomb > 1500 && this.animationId < 3:
                updateFrame = true;
                this.animationId = 3;
                break;
            case time - this.dateCreateBomb > 1000 && this.animationId < 2:
                updateFrame = true;
                this.animationId = 2;
                break;
            case time - this.dateCreateBomb > 500 && this.animationId < 1:
                updateFrame = true;
                this.animationId = 1;
                break;
        }
        if (updateFrame) {
            if (this.animationId > this.spriteAnimation.length - 1) {
                return true;
            } else {
                // this.props.style = {
                //     ...this.spriteAnimation[this.animationId].style,
                //     top: `${parseInt(this.posY / 32) * 32}px`,
                //     left: `${parseInt(this.posX / 32) * 32}px`
                // }
                this.props.style = `${this.spriteAnimation[this.animationId].style} top: ${this.posY}px; left: ${this.posX}px;`
                // this.spriteAnimation[this.animationId].style;
                this.update();
            }
        }
        return false;
    }
}