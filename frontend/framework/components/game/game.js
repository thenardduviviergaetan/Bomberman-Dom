import Component from "../component.js";
import Map from "./map.js";
import { CurrentPlayer, Player } from "./player.js";
import TabBomb from "./bomb.js";
import { checkTrigger } from "./collisions.js";
import { getBorder } from '../function.js';

const FRAMERATE = 1000 / 60;
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

        this.readyPlayers = readyPlayers;
        this.playerMoveQueue = [];

        this.ws.onClose(() => (this.stop = true));
        this.ws.onMessage((message) => {
            switch (message.type) {
                case "map":
                    this.initMap(message);
                    break;
                case "move":
                    this.updatePlayers(message);
                    break;
                case "end":
                    this.stop = true;
                    break;
                case "bomb":
                    // console.log(message)
                    this.tabBomb.newBomb(message);
                    break;
                case "death":
                    console.log(message);
                    break;
                case "degats":
                    console.log(message);
                    break;
                case "bonus":
                    this.map.removeBonus(message.data);
                    break;
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
        this.playerMoveQueue.push({
            player,
            direction: message.direction,
            position: message.position,
        });
    }

    /**
     * The main game loop that updates the game state and renders the game.
     * @param {number} timestamp - The current timestamp.
     */
    gameLoop(timestamp) {
        this.fpsCounter();
        const deltaTime = timestamp - this.lastTime;
        if (deltaTime >= FRAMERATE) {
            this.lastTime = timestamp;
            this.updateState();
        }
        if (this.stop) {
            this.fps.textContent = "";
            return;
        }
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    /**
     * Updates the game state.
     */
    async updateState() {
        if (this.tabBomb !== undefined) this.tabBomb.tick();
        await Promise.all(
            this.playerMoveQueue.map((player) =>
                player.player.move(player.direction, player.position)
            )
        );
        this.playerMoveQueue = [];
    }

    /**
     * Calculates and displays the frames per second (FPS) count.
     */
    fpsCounter() {
        const now = performance.now();
        if (now - this.lastUpdateTime >= 1000) {
            const fpsText = `FPS: ${this.frameCount}`;
            if (this.fps.textContent !== fpsText) {
                this.fps.textContent = fpsText;
            }
            this.frameCount = 0;
            this.lastUpdateTime = now;
        }
        this.frameCount++;
    }
}