import Component from "../component.js";
import { debounce, throttle } from "../../engine/utils.js";
import { checkGround, checkTrigger } from "./collisions.js";


// Constants
const FRAME_COUNT = 3;
const FRAME_WIDTH = 32;
const MOVEMENT_SIZE = 2;
const ANIMATION_FRAME_RATE = 8;

// Animation frames for different directions
const ANIMATION_FRAMES = {
    "down": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: i * FRAME_WIDTH, offsetY: 0 })),
    "up": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: i * FRAME_WIDTH, offsetY: FRAME_WIDTH })),
    "right": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: (i + 3) * FRAME_WIDTH, offsetY: 0 })),
    "left": Array.from({ length: FRAME_COUNT }, (_, i) => ({ offsetX: (i + 3) * FRAME_WIDTH, offsetY: FRAME_WIDTH }))
};

// Mapping of key codes to directions
const DIRECTION_MAP = {
    "ArrowUp": "up",
    "z": "up",
    "ArrowDown": "down",
    "s": "down",
    "ArrowLeft": "left",
    "q": "left",
    "ArrowRight": "right",
    "d": "right"
};

// Mapping of keys to drop bomb action
const DROP_BOMB = {
    "Shift": true,
    " ": true
};

// Player class
export class Player extends Component {
    /**
     * Constructs a new Player instance.
     * @param {Object} props - The properties of the player component.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {string} username - The username of the player.
     */
    constructor(props, ws, username) {
        super("div", props);
        this.ws = ws;
        this.username = username;
        this.posX = props.style.left;
        this.posY = props.style.top;
        this.sprite = `url(./framework/components/game/assets/player${props.index + 1}.png)`;
        this.props.style = `background-image: ${this.sprite}; background-position: -${0}px -${0}px;`;
        this.life = 3;
        this.draw();

        this.frameIndex = 0;
        this.animationCounter = 0;
        this.frameCycle = [0, 1, 0, 2];
        this.cycleIndex = 0;
    }


    /**
     * Draws the player on the screen.
     */
    draw() {
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px);`;
    }

    /**
     * Animates the player based on the current direction.
     * @param {string} direction - The current direction of the player.
     */
    animate(direction) {
        this.animationCounter++;
        if (this.animationCounter % ANIMATION_FRAME_RATE === 0 || direction !== this.prevDirection) {
            this.prevDirection = direction;
            this.frameIndex = this.frameCycle[this.cycleIndex];
            this.cycleIndex = (this.cycleIndex + 1) % this.frameCycle.length;
        }
    }

    /**
     * Moves the player in the specified direction.
     * @param {string} direction - The direction to move the player.
     * @param {Object} position - The new position of the player.
     */
    move(direction, position) {
        this.posX = position.x;
        this.posY = position.y;
        this.animate(direction);
        const { offsetX, offsetY } = ANIMATION_FRAMES[direction][this.frameIndex];
        this.props.style = `${this.props.style} transform: translate(${this.posX}px, ${this.posY}px); background-position: -${offsetX}px -${offsetY}px;`;
        this.updateStyle(this.props.style);
    }

    die() {
        this.props.style = `${this.props.style} opacity: 0.4;`
        this.updateStyle(this.props.style);

    }
}

// CurrentPlayer class
export class CurrentPlayer extends Player {
    /**
     * Constructs a new CurrentPlayer instance.
     * @param {Object} props - The properties of the current player component.
     * @param {WebSocket} ws - The WebSocket connection.
     * @param {string} username - The username of the current player.
     * @param {Object} parent - The parent component.
     */
    constructor(props, ws, username, parent) {
        super(props, ws, username);
        this.direction = null;
        this.isMoving = false;
        this.parent = parent;
        this.frameID = null;
        this.lock = false;
        this.bombCooldown = 0;
        this.maxBombNumber = 1;
        this.bombNumber = 0;
        this.bombType = 0;
        this.blastRangeBonus = 0;
        this.cooldownDegats = 0;
        this.isAlive = true;
        this.canEscape = false;
        this.speed = MOVEMENT_SIZE;

        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        }


        this.ws.onMessage((message) => {
            if (message.type === "lock") {
                this.lock = true;
            } else if (message.type === "unlock") {
                this.lock = false;
            }
        });

        window.addEventListener("keydown", ((event) => {
            if (DIRECTION_MAP[event.key] && !this.lock) {
                this.keys[DIRECTION_MAP[event.key]] = true;
                if (!this.isMoving) this.updatePosition();
            }
            if ((DROP_BOMB[event.key] && ((this.bombCooldown - Date.now() <= 0) || this.bombNumber < this.maxBombNumber)) && this.isAlive && !this.lock) {
                this.bombNumber++;
                this.dropBomb();
                this.bombCooldown = Date.now() + 1500;
                return;
            } else if (DROP_BOMB[event.key]) return;
        }));

        window.addEventListener("keyup", ((event) => {
            if (DIRECTION_MAP[event.key]) {
                this.keys[DIRECTION_MAP[event.key]] = false;
                    this.direction = null;
            }
        }));
    }

    /**
     * Adds to the maximum bomb number.
     */
    addMaxBombNumber() {
        this.maxBombNumber++;
    }

    /**
     * Removes from the maximum bomb number.
     */
    rmMaxBombNumber() {
        this.maxBombNumber--;
    }

    /**
     * Sets the bomb type.
     * @param {number} type - The bomb type.
     */
    setBombType(type) {
        this.bombType = type;
    }

    /**
     * Decreases the bomb number when a bomb explodes.
     */
    bombExplode() {
        this.bombNumber -= 1;
    }

    /**
     * Adds to the blast range bonus.
     * @param {number} nb - The blast range bonus to add.
     */
    addBlastRange(nb) {
        this.blastRangeBonus += nb;
    }

    /**
     * Resets the blast range bonus.
     */
    resetBlastRange() {
        this.blastRangeBonus = 0;
    }

    /**
     * Increases the player's speed.
     */
    speedUp() {
        this.speed += 0.2;
    }

    activeEscape() {
        this.canEscape = true;
    }

    addLife(nb) {
        this.life += nb;
    }

    /**
     * Moves the current player.
     */
    moveCurrent() {
        const playerGround = checkGround(this);
        if (!this.direction) {
            this.isMoving = false;
        }
        const oldPosX = this.posX;
        const oldPosY = this.posY;

        this.parent.bonusMap.forEach((bonus) => {
            if (checkTrigger(this, bonus) && bonus.parent.children.length == 1 && this.isAlive) {
                let bonusData = {
                    bonus: bonus.bonus,
                    indexX: bonus.indexX,
                    indexY: bonus.indexY,
                };

                setTimeout(() => {
                    this.ws.sendMessage({ type: "bonus", sender: this.username, data: bonusData });
                }, 100);

                switch (bonus.bonus) {
                    case "bomb":
                        this.addMaxBombNumber();
                        break;
                    case "blast":
                        this.addBlastRange(1);
                        break;
                    case "speed":
                        this.speedUp();
                        break;
                    case "escape":
                        this.activeEscape();
                        break;
                    case "life":
                        this.addLife(1);
                        break;
                    default:
                        break;
                }
                this.parent.bonusMap = this.parent.bonusMap.filter((el) => el != bonus);
            }
        });

        if (this.keys.up){
            this.direction = "up";
            this.posY += !playerGround.groundUp ? -this.speed : playerGround.up;
        }

        if (this.keys.down){
            this.direction = "down";
            this.posY += !playerGround.groundDown ? this.speed : playerGround.down;
        }

        if (this.keys.left){
            this.direction = "left";
            this.posX += !playerGround.groundLeft ? -this.speed : playerGround.left;
        }

        if (this.keys.right){
            this.direction = "right";
            this.posX += !playerGround.groundRight ? this.speed : playerGround.right;
        }

        if (this.posX !== oldPosX || this.posY !== oldPosY) {
            this.ws.sendMessage({ type: "move", sender: this.username, direction: this.direction, position: { x: this.posX, y: this.posY } });
        }
    }

    /**
     * Updates the position of the current player.
    */
    updatePosition() {
        this.isMoving = true;
        const oldPosX = this.posX;
        const oldPosY = this.posY;
        this.moveCurrent();
        if (this.posX !== oldPosX || this.posY !== oldPosY) {
            this.frameID = requestAnimationFrame(() => this.updatePosition());
        } else {
            // cancelAnimationFrame(this.frameID);
            this.isMoving = false;
        }
    }

    /**
     * Drops a bomb at the current player's position.
     */
    dropBomb() {
        this.ws.sendMessage({
            type: "bomb",
            bombType: this.bombType,
            sender: this.username,
            position: { "x": this.posX, "y": this.posY + 608 },
            date: Date.now(),
            blastRangeBonus: this.blastRangeBonus
        });
    }

    /**
     * Triggers the blast when the player is hit by a bomb.
     */
    triggerBlast() {
        const time = Date.now();
        if (time - this.cooldownDegats > 1500) {
            this.cooldownDegats = time;
            this.ws.sendMessage({
                type: "degats",
                sender: this.username,
                nb: 1
            });
        }
    }

    /**
     * Notifies the server of the player's death.
     * @param {string} cause - The cause of the player's death.
     */
    playerDeath() {
        this.ws.sendMessage({
            type: "death",
            sender: this.username,
        });
    }
}

/**
 * Represents a player move.
 */
class PlayerMove {
    /**
     * Constructs a new PlayerMove instance.
     */
    constructor() {
        /**
         * The player associated with the move.
         * @type {Player}
         */
        this.player = null;
        
        /**
         * The direction of the move.
         * @type {string}
         */
        this.direction = null;
        
        /**
         * The new position of the player.
         * @type {Object}
         */
        this.position = null;
    }

    /**
     * Sets the player, direction, and position of the move.
     * @param {Player} player - The player associated with the move.
     * @param {string} direction - The direction of the move.
     * @param {Object} position - The new position of the player.
     */
    setMove(player, direction, position) {
        this.player = player;
        this.direction = direction;
        this.position = position;
    }

    /**
     * Resets the player, direction, and position of the move.
     */
    reset() {
        this.player = null;
        this.direction = null;
        this.position = null;
    }
}

/**
 * Represents a pool of player moves.
 */
export class PlayerMovePool {
    /**
     * Constructs a new PlayerMovePool instance.
     */
    constructor() {
        /**
         * The pool of player moves.
         * @type {PlayerMove[]}
         */
        this.pool = [];
    }

    /**
     * Gets a player move from the pool.
     * If the pool is empty, a new PlayerMove instance is created.
     * @param {Player} player - The player associated with the move.
     * @param {string} direction - The direction of the move.
     * @param {Object} position - The new position of the player.
     * @returns {PlayerMove} The player move.
     */
    getMove(player, direction, position) {
        let move = this.pool.length > 0 ? this.pool.pop() : new PlayerMove();
        move.setMove(player, direction, position);
        return move;
    }

    /**
     * Returns a player move to the pool.
     * The move is reset before being added back to the pool.
     * @param {PlayerMove} move - The player move to return.
     */
    returnMove(move) {
        move.reset();
        this.pool.push(move);
    }
}