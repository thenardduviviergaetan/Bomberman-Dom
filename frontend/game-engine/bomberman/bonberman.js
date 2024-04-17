import { Tablevel } from "./src/data/level.js";
import { Player } from "./src/entity/player/player.js";
import { Level } from "./src/map/newmap.js";

const SystemeData = {
    isPaused: false,
    isMenuPaused: false,
    isMainMenu: false,
    inputkey: {},
}

const level = new Level(Tablevel.Monde1.Level1);
document.getElementById("game").appendChild(level.HTML);
const player = new Player(SystemeData,"player1");
player.move(24,24);
document.getElementById("game").appendChild(player.HTML);

function gameLoop() {
    if (!SystemeData.isPaused) {
        player.move();
        // console.log("play")
    }else{
        // console.log("pause")
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();


document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "Escape":
            if (SystemeData.isPaused != SystemeData.isMenuPaused && !SystemeData.inputkey["Escape"]) {
                break;
            }
            SystemeData.isPaused = !SystemeData.isPaused
            SystemeData.isMenuPaused = !SystemeData.isMenuPaused
        // pause.update();
        default:
            SystemeData.inputkey[e.key] = true;
            break;
    }
    // console.log("keydown SystemeData :", SystemeData)
}, false);

document.addEventListener('keyup', (e) => {
    SystemeData.inputkey[e.key] = false;
    // console.log("keyup SystemeData :", SystemeData)
}, false);