import Component from "../component.js";
import { initCross } from "../function.js";
import { checkTrigger } from "./collisions.js";
import TabSprite from "./sprite.js";
const keys = ["top", "left", "in", "right", "bottom"];
const expose = ["path", "block", "shadow", "spawn"];
const yellowFlammeSprite = new TabSprite("./framework/components/game/assets/blast-jaune-32x32.png", 32, 128, 288).tab;
const blueFlammeSprite = new TabSprite("./framework/components/game/assets/blast-bleu-32x32.png", 32, 128, 288).tab;
const ANIMATION_FRAME_BOMB = {
    0: { tab: [0, 1, 2], flame: "yellow" },
    1: { tab: [3, 4, 5], flame: "yellow" },
    2: { tab: [6, 7, 8], flame: "blue" },
    3: { tab: [9, 10, 11], flame: "yellow" },
    4: { tab: [12, 13, 14], flame: "blue" }
}
const ANIMATION_FRAME_BLAST = {
    "top": [2, 11, 20, 29],
    "left": [4, 13, 22, 31],
    "in": [0, 9, 18, 27],
    "right": [8, 17, 26, 35],
    "bottom": [6, 15, 24, 33]
}
export default class TabBomb extends Component {
    constructor(parent, curentPlayer) {
        super("div", { id: "TabBomb" }, [])
        this.tabSpriteBomb = new TabSprite("./framework/components/game/assets/bomb-32x32.png", 32, 160, 96).tab;
        this.parent = parent;
        this.curentPlayer = curentPlayer;
    }
    newBomb(BombMessage) {
        const bombSprite = []
        ANIMATION_FRAME_BOMB[BombMessage.bombType].tab.forEach(idsprite => {
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
                this,
            )
        )
        this.update();
    }
    tick() {
        let tabExplodeBomb = []
        const newChild = this.children.filter((child) => {
            if (child.tick()) {
                if (child instanceof Bomb) tabExplodeBomb.push(child);
                return false;
            } else {
                return true;
            }
        });
        if (newChild.length !== this.children.length) {
            this.children = newChild;
            tabExplodeBomb.forEach((bomb) => {
                this.addElement(new Blast(bomb.posX, bomb.posY, ANIMATION_FRAME_BOMB[bomb.bombType].flame, this))
            });
            this.update();
        }
        // if (numberChild !== this.children.length) this.update();
        //         this.parent.update();
    }
}
class Bomb extends Component {
    constructor(bombType, sender, posX, posY, date, spriteAnimation, parent) {
        super(
            "div",
            {
                id: `${sender}-bomb`,
                class: "bomb",
            },
            []
        )
        this.parent = parent;
        this.bombType = bombType;
        this.sender = sender;
        this.posX = parseInt((posX + 16) / 32) * 32;
        this.posY = parseInt((posY + 26) / 32) * 32;
        this.dateCreateBomb = date;
        this.animationId = 0
        this.props.style = `${spriteAnimation[0].style} top: ${this.posY}px; left: ${this.posX}px;`
        this.spriteAnimation = spriteAnimation;
    }
    tick() {
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
                this.props.style = `${this.spriteAnimation[this.animationId].style} top: ${this.posY}px; left: ${this.posX}px;`
                this.update();
            }
        }
        return false;
    }
}
class Blast extends Component {
    constructor(posX, posY, typeflame, parent) {
        super("div", { id: `${parent.props.id}blast` }, [])
        this.dateCreateBomb = new Date().getTime();
        this.posX = posX;
        this.posY = posY;
        this.typeflame = typeflame;
        this.parent = parent;
        this.crossElement = [];
        this.animationId = 0;
        this.aLive = new Date().getTime();
        this.initBlast();
    }
    initBlast() {
        const map = this.parent.parent;
        const indexX = parseInt(this.posX / map.tileSize);
        const indexY = parseInt(this.posY / map.tileSize);
        const cross = initCross(indexX, indexY, map)
        keys.forEach(key => {
            const blockBorder = cross[key];
            if (blockBorder === undefined || expose.filter((el) => el == blockBorder.type).length === 0) return;
            const spriteAnimation = [];
            ANIMATION_FRAME_BLAST[key].forEach(idsprite => {
                spriteAnimation.push(this.typeflame === "yellow" ? yellowFlammeSprite[idsprite] : blueFlammeSprite[idsprite])
            });
            // correction pour le bottom je ne sais pas d'ou peut venir l'erreur car ce me le fais que pour lui
            if (key === "bottom") {
                blockBorder.borderUp += 64;
                blockBorder.borderDown += 64;
                blockBorder.indexY += 2;
            }
            this.addElement(new Fire(blockBorder.borderLeft, blockBorder.borderUp, spriteAnimation, blockBorder, this.parent));
            if (blockBorder.type === "block") {
                console.log(blockBorder.type, "block");
                const top = map.children[blockBorder.indexY - 1].children[blockBorder.indexX]
                const bottom = map.children[blockBorder.indexY + 1].children[blockBorder.indexX]
                this.parent.parent.children[blockBorder.indexY].children[blockBorder.indexX] = top.props.class === "block" || top.props.class === "wall" ? map.shadow : map.path;
                if (bottom.props.class === "shadow") this.parent.parent.children[blockBorder.indexY + 1].children[blockBorder.indexX] = map.path;
                this.parent.parent.update();
            }
        });
    }
    tick() {
        const time = new Date().getTime();
        let updateFrame = false;
        if (time - this.aLive >= 200) {
            updateFrame = true;
            this.aLive = time;
        }
        if (updateFrame) {
            if (this.animationId >= 3) {
                return true;
            } else {
                this.animationId++
                this.children.forEach(fire => fire.tick(this.animationId))
                this.update();
            }
        }
        return false;
    }
}
class Fire extends Component {
    constructor(posX, posY, spriteAnimation, border, parent) {
        super("div", {}, []);
        this.posX = posX;
        this.posY = posY;
        this.spriteAnimation = spriteAnimation;
        this.border = border;
        this.parent = parent;
        // console.log(this.spriteAnimation)
        this.props.style = `${this.spriteAnimation[0].style} top: ${this.posY}px; left: ${this.posX}px;`
        // console.log(this.props)
    }
    tick(animationId) {
        this.props.style = `${this.spriteAnimation[animationId].style} top: ${this.posY}px; left: ${this.posX}px;`
        if (checkTrigger(this.parent.curentPlayer, this.border)) {
            this.parent.curentPlayer.triggerBlast();
        }
    }
}
// function initCross(posX, posY, map) {
//     const maxY = map.atlas.length;
//     const maxX = map.atlas[0].length;
//     const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);
//     console.log("maxY, maxX, indexX, indexY, check");
//     console.log(maxY, maxX, indexX, indexY, check);
//     const cross = {
//         "top": indexY - 1 >= 0 && check ? getBorder(map.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
//         "left": indexX - 1 >= 0 && check ? getBorder(map.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
//         "in": check ? getBorder(map.children[indexY].children[indexX], indexY, indexX) : undefined,
//         "right": indexX + 1 < maxX && check ? getBorder(map.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
//         "bottom": indexY + 1 < maxY && check ? getBorder(map.children[indexY + 1].children[indexX], indexY - 1, indexX) : undefined,
//     };
//     return cross;
// }