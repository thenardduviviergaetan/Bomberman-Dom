// import { Level } from "./code/map/newmap.js";

const SystemeData = {
    isPaused: false,
    isMenuPaused: false,
    isMainMenu: false,
    inputkey: {},
}

// const level = new Level()


function gameLoop() {
    if (!SystemeData.isPaused) {
        // player.move();
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
    console.log("SystemeData :", SystemeData)
}, false);

document.addEventListener('keyup', (e) => {
    SystemeData.inputkey[e.key] = false;
    console.log(SystemeData.inputkey);
}, false);