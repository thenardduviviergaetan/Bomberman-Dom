import Component from "../component.js";
import Map from "./map.js";
import { CurrentPlayer, Player, PlayerMovePool } from "./player.js";
import TabBomb from "./bomb.js";

const FRAMERATE = 1000 / 120;
const positions = [
    { top: -608 + 32, left: 32 },
    { top: -64, left: 608 - 64 },
    { top: -608 + 32, left: 608 - 64 },
    { top: -64, left: 32 }
];

export default class Game extends Component {
    constructor(props, ws, username, readyPlayers) {
        super("section", props);
        this.username = username;
        this.ws = ws;
        this.stop = false;
        this.size = 19;
        this.atlas = this.ws.sendMessage({ type: "map" });
        this.livesContainer = new Component("div", { id: "lives-container", style: "position:absolute;" });
        this.readyPlayers = readyPlayers
        this.playerMoveQueue = []
        this.playerMovePool = new PlayerMovePool()
        this.leavers = []
        this.lives = [3, 3, 3, 3];
        this.count = 0;
        this.ws.onClose(() => this.stop = true)
        this.ws.onMessage((message) => {
            switch (message.type) {
                case "map":
                    this.initMap(message)
                    this.initLives();
                    break;
                case "move":
                    this.updatePlayers(message);
                    break;
                case "end":
                    this.stop = true;
                    break;
                case "bomb":
                    this.tabBomb.newBomb(message);
                    break;
                case "death":
                    this.count++
                    this.readyPlayers.forEach((player) => {
                        if (message.sender === player.props.id) {
                            player.die();
                        }
                    })
                    break;
                case "degats":
                    this.lives[this.readyPlayers.findIndex(player => player.props.id === message.sender)]--;
                    this.updateLives();
                    break;
                case "bonus":
                    this.map.removeBonus(message.data);
                    if (message.data.bonus === "life") {
                        this.lives[this.readyPlayers.findIndex(player => player.props.id === message.sender)]++;
                        this.updateLives();
                    }
                    break
                case "leave":
                    this.count++;
                    this.leavers.push(message.sender)
                    this.updateLives();
                    this.map.delete(message.sender);
                    break
                default:
                    break;
            }
        });

        this.lastTime = 0;

        this.fps = document.getElementById("fps");
        this.lastUpdateTime = performance.now();
        this.frameCount = 0;

        this.gameLoop();
    }

    /**
     * Initializes the map with the received message.
     * @param {Object} message - The message containing the map data.
     */
    initMap(message) {
        this.atlas = message.body;
        this.map = new Map(this.atlas);

        this.readyPlayers.forEach((player, index) => {
            const props = {
                id: player.children[0],
                className: "player-sprite",
                style: {
                    top: positions[index].top,
                    left: positions[index].left,
                },
                index: index,
            };

            if (player.children[0] !== this.username) {
                const newPlayer = new Player(props);
                this.map.addElement(newPlayer);
                this.readyPlayers[index] = newPlayer;
            } else {
                this.currentPlayer = new CurrentPlayer(
                    props,
                    this.ws,
                    this.username,
                    this.map
                );

                this.map.addElement(this.currentPlayer);
                this.readyPlayers[index] = this.currentPlayer;
            }
        });

        this.tabBomb = new TabBomb(this.map, this.currentPlayer);
        this.map.tabBomb = this.tabBomb;
        this.map.addElement(this.tabBomb);
        this.addElement(this.map);
        this.update();
    }

    /**
     * Updates the player's movement based on the received message.
     * @param {Object} message - The message containing the player's movement data.
     */
    updatePlayers(message) {
        const player = this.readyPlayers.find(
            (player) => player.props.id === message.sender
        );
        const move = this.playerMovePool.getMove(player, message.direction, message.position);
        this.playerMoveQueue.push(move);
    }

    initLives() {
        const text = new Component("p", { id: "title" }, ["Lives remaining :"])
        const livesList = new Component("ul", { id: "lives-list" });
        this.readyPlayers.forEach((player, index) => {
            const playerLife = new Component("li", { className: player.props.id }, [`${player.props.id} : ${this.lives[index]}`]);
            livesList.addElement(playerLife);
        })
        this.livesContainer.addElement(text, livesList);
        this.addElement(this.livesContainer);
        this.update();
    }

    updateLives() {
        const list = this.livesContainer.children[1].children;
        let changesMade = false;

        list.forEach((playerLi, index) => {
            if (this.lives[index] > 0 && !this.leavers.includes(playerLi.props.className)) {
                const newContent = `${playerLi.props.className} : ${this.lives[index]}`;
                if (playerLi.children[0] !== newContent) {
                    playerLi.children = [newContent];
                    changesMade = true;
                }
                this.winner = playerLi.props.className;
            } else {
                if (playerLi.props.className === this.currentPlayer.username && this.currentPlayer.isAlive) {
                    this.currentPlayer.isAlive = false;
                    this.currentPlayer.playerDeath()
                }

                const newContent = this.leavers.includes(playerLi.props.className) ? `${playerLi.props.className} : left` : `${playerLi.props.className} : dead`;
                if (playerLi.children[0] !== newContent) {
                    playerLi.children = [newContent];
                    playerLi.props.style = "color:#ff5abb; text-decoration:line-through;";
                    changesMade = true;
                }
            }
        })

        // Only update the DOM if changes were made
        if (changesMade) {
            this.livesContainer.update();
        }
    }
    gameLoop(timestamp) {
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        this.fpsCounter();
        const deltaTime = timestamp - this.lastTime;
        // if (deltaTime >= FRAMERATE) {
        this.lastTime = timestamp;
        this.updateState(deltaTime);
        // }
        if (this.count === this.readyPlayers.length - 1) {
            this.count = 0;
            setTimeout(() => {
                this.ws.sendMessage({ type: "end", sender: this.winner });
            }, 2000);
        }
        if (this.stop) {
            this.fps.textContent = "";
            return;
        }
    }

    /**
     * Updates the game state.
     */
    updateState(deltaTime) {
        // if (this.tabBomb !== undefined) this.tabBomb.tick();
        if (this.tabBomb !== undefined) this.tabBomb.tick(deltaTime);


        let moveCounts = {};
        let nextPlayerMoveQueue = [];

        while (this.playerMoveQueue.length > 0) {
            const move = this.playerMoveQueue.shift();
            const playerId = move.player.props.id;

            if (!moveCounts[playerId]) {
                moveCounts[playerId] = 0;
            }

            if (moveCounts[playerId] < 5) {
                move.player.move(move.direction, move.position);
                moveCounts[playerId]++;
            } else {
                nextPlayerMoveQueue.push(move);
            }
            this.playerMovePool.returnMove(move);
        }

        this.playerMoveQueue = nextPlayerMoveQueue;
        moveCounts = {};

    }

    /**
     * Calculates and displays the frames per second (FPS) count.
     */
    fpsCounter() {
        const now = performance.now();
        if (now - this.lastUpdateTime >= 1000) {
            this.fps.textContent = `FPS: ${this.frameCount}`
            this.frameCount = 0
            this.lastUpdateTime = now
        }
        this.frameCount++;
    }
}