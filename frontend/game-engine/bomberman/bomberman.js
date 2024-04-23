import MenuPause from "./src/menu/pause.js";
import { Tablevel } from "./src/data/level.js";
import { Player } from "./src/entity/player/player.js";
import { Level } from "./src/map/newmap.js";
import OtherPlayer from "./src/entity/player/otherplayer.js";

const SystemeData = {
    isPaused: false,
    isMenuPaused: false,
    isMainMenu: false,
    inputkey: {},
    playerBomb:{}
}

const level = new Level(Tablevel.Monde1.Level1);
document.getElementById("game").appendChild(level.HTML);
const player = new Player(SystemeData,"player1","funny");
// SystemeData.inputkey[player.id] = {}
player.move(24,24);
document.getElementById("game").appendChild(player.HTML);
const pause = new MenuPause(SystemeData);
document.body.appendChild(pause.HTML)
const player2 = new OtherPlayer(SystemeData,"player2","funny2");
player2.move(24,312);
document.getElementById("game").appendChild(player2.HTML);
// const player3 = new Player(SystemeData,"player3");
// player3.move(404,-40);
// document.getElementById("game").appendChild(player3.HTML);
// const player4 = new Player(SystemeData,"player4");
// player4.move(404,248);
// document.getElementById("game").appendChild(player4.HTML);

function gameLoop() {
    if (!SystemeData.isPaused) {
        player.move();
        // player.checkTrigger(player2)
        player2.move();
        // player3.move();
        // player4.move();
        // console.log("play")
        // console.log(SystemeData.playerBomb)
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
        pause.update();
        default:
            SystemeData.inputkey[player.id][e.key] = true;
            SystemeData.inputkey[player2.id][e.key] = true;
            break;
    }
    // console.log("keydown SystemeData :", SystemeData)
}, false);

document.addEventListener('keyup', (e) => {
    SystemeData.inputkey[player.id][e.key] = false;
    SystemeData.inputkey[player2.id][e.key] = false;
    // console.log('key',e.key)
    // console.log("keyup SystemeData :", SystemeData.inputkey)
}, false);