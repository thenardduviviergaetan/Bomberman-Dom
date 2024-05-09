import Component from "../component.js";
import { initCrossBlast } from "../function.js";
import { checkTrigger } from "./collisions.js";
import TabSprite from "./sprite.js";
const keys = ["top", "left", "in", "right", "bottom"];
const expose = ["path", "block", "shadow", "spawn"];
const yellowFlammeSprite = new TabSprite("./framework/components/game/assets/blast-jaune-32x32.png", 32, 128, 288).tab;
const blueFlammeSprite = new TabSprite("./framework/components/game/assets/blast-bleu-32x32.png", 32, 128, 288).tab;

const ANIMATION_FRAME_BOMB = {
    0: { tab: [0, 1, 2], flame: "yellow", blastRange: 1, bombTimer: 1500, blastTimer: 1000 },
    1: { tab: [3, 4, 5], flame: "yellow", blastRange: 1, bombTimer: 1500, blastTimer: 1000 },
    2: { tab: [6, 7, 8], flame: "blue", blastRange: 1, bombTimer: 1500, blastTimer: 1000 },
    3: { tab: [9, 10, 11], flame: "yellow", blastRange: 1, bombTimer: 1500, blastTimer: 1000 },
    4: { tab: [12, 13, 14], flame: "blue", blastRange: 38, bombTimer: 500, blastTimer: 1000 },
}


const ANIMATION_FRAME_BLAST = {
    "in": {
        end: [0, 9, 18, 27],
    },
    "top": {
        mid: [1, 10, 19, 28],
        end: [2, 11, 20, 29],
    },
    "left": {
        mid: [3, 12, 21, 30],
        end: [4, 13, 22, 31],
    },

    "bottom": {
        mid: [5, 14, 23, 32],
        end: [6, 15, 24, 33],
    },

    "right": {
        mid: [7, 16, 25, 34],
        end: [8, 17, 26, 35],
    }

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
        console.log(BombMessage);
        this.addElement(
            new Bomb(
                BombMessage.bombType,
                BombMessage.sender,
                BombMessage.position.x,
                BombMessage.position.y,
                BombMessage.date,
                bombSprite,
                BombMessage.blastRangeBonus + ANIMATION_FRAME_BOMB[BombMessage.bombType].blastRange,
                this,
            )
        );
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
                if (this.curentPlayer.username === bomb.sender) this.curentPlayer.bombExplode();
                this.addElement(new Blast(bomb.posX, bomb.posY, ANIMATION_FRAME_BOMB[bomb.bombType].flame, bomb.blastRange, ANIMATION_FRAME_BOMB[bomb.bombType].blastTimer, this))
            });
            this.update();
        }
    }
}

class Bomb extends Component {
    constructor(bombType, sender, posX, posY, date, spriteAnimation, blastRange, parent) {
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
        this.blastRange = blastRange;
        this.animationId = 0
        this.props.style = `${spriteAnimation[0].style} top: ${this.posY}px; left: ${this.posX}px;`
        this.spriteAnimation = spriteAnimation;
        this.timer = parseInt(ANIMATION_FRAME_BOMB[this.bombType].bombTimer / ANIMATION_FRAME_BOMB[this.bombType].tab.length);
    }
    tick() {
        let time = new Date().getTime()
        if (time - this.dateCreateBomb > this.timer) {
            this.animationId++;
            this.dateCreateBomb = time;
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
    constructor(posX, posY, typeflame, blastRange, timer, parent) {
        super("div", { id: `${parent.props.id}blast` }, [])
        this.dateCreateBomb = new Date().getTime();
        this.posX = posX;
        this.posY = posY;
        this.typeflame = typeflame;
        this.parent = parent;
        this.crossElement = [];
        this.animationId = 0;
        this.blastRange = blastRange;
        this.timer = parseInt(timer / 4);
        this.aLive = new Date().getTime();
        this.initBlast();
    }
    initBlast() {
        const map = this.parent.parent;
        const cross = initCrossBlast(this.posX, -this.posY, map, this.blastRange);
        keys.forEach(key => {
            cross[key].forEach((blockBorder, index) => {
                let spkey = index < cross[key].length - 1 ? "mid" : "end"
                const spriteAnimation = [];
                ANIMATION_FRAME_BLAST[key][spkey].forEach(idsprite => {
                    spriteAnimation.push(this.typeflame === "yellow" ? yellowFlammeSprite[idsprite] : blueFlammeSprite[idsprite])
                });
                this.addElement(new Fire(blockBorder.borderLeft, blockBorder.borderUp, spriteAnimation, blockBorder, this.parent, key));
                if (blockBorder.type === "block") {
                    const top = map.children[blockBorder.indexY - 1].children[blockBorder.indexX]
                    const bottom = map.children[blockBorder.indexY + 1].children[blockBorder.indexX]
                    this.parent.parent.children[blockBorder.indexY].children[blockBorder.indexX] = top.props.class === "block" || top.props.class === "wall" ? map.shadow : map.path;
                    if (bottom.props.class === "shadow") this.parent.parent.children[blockBorder.indexY + 1].children[blockBorder.indexX] = map.path;
                    this.parent.parent.update();
                }
            });
        });
    }
    tick() {
        const time = new Date().getTime();
        let updateFrame = false;
        if (time - this.aLive >= this.timer) {
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
    constructor(posX, posY, spriteAnimation, border, parent, key) {
        super("div", {}, []);
        this.posX = posX;
        this.posY = posY;
        this.spriteAnimation = spriteAnimation;
        this.border = border;
        this.parent = parent;
        this.key = key;
        this.props.style = `${this.spriteAnimation[0].style} top: ${this.posY}px; left: ${this.posX}px;`

    }
    tick(animationId) {
        this.props.style = `${this.spriteAnimation[animationId].style} top: ${this.posY}px; left: ${this.posX}px;`
        if (checkTrigger(this.parent.curentPlayer, this.border)) {
            this.parent.curentPlayer.triggerBlast();
        }
    }
}