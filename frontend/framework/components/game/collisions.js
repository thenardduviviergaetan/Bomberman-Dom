import { initCross } from "../function.js";
const FRAME_WIDTH = 32;
const keys = ["top", "left", "in", "right", "bottom"];
const solid = ["wall", "block"];
export function checkGround(player) {
    const groundObj = {
        groundLeft: false,
        groundRight: false,
        groundUp: false,
        groundDown: false
    }
    const playerBorder = getPlayerBorder(player);
    const indexX = parseInt((player.posX + FRAME_WIDTH / 2) / player.parent.tileSize);
    const indexY = player.parent.atlas.length - (parseInt((player.posY * -1 + FRAME_WIDTH) / player.parent.tileSize) - 1);
    const cross = initCross(indexX, indexY, player.parent);
    // console.log(cross)
    keys.forEach(key => {
        const blockBorder = cross[key]
        if (blockBorder === undefined || solid.filter((el) => el == blockBorder.type).length === 0) return;
        switch (key) {
            case "top":
                // groundObj.groundUp = blockBorder.borderDown - 16 >= playerBorder.up
                groundObj.groundUp = blockBorder.borderDown >= playerBorder.up
                break;
            case "left":
                // groundObj.groundLeft = blockBorder.borderRight - 8 >= playerBorder.left
                groundObj.groundLeft = blockBorder.borderRight >= playerBorder.left
                break;
            // case "in":
            //     break;
            case "right":
                // groundObj.groundRight = blockBorder.borderLeft + 8 <= playerBorder.right
                groundObj.groundRight = blockBorder.borderLeft <= playerBorder.right
                break;
            case "bottom":
                groundObj.groundDown = blockBorder.borderUp <= playerBorder.down
                break;
        }
    });
    return groundObj;
}
function getPlayerBorder(player) {
    return {
        left: player.posX + 8,
        right: player.posX + FRAME_WIDTH - 8,
        up: player.posY + 608 + 20,
        down: (player.posY - FRAME_WIDTH) + 608,
    }
}
export function checkTrigger(player, objBorder) {
    const playerBorder = getPlayerBorder(player);
    const triggerTop = objBorder.borderUp <= playerBorder.up && playerBorder.up <= objBorder.borderDown;
    const triggerBottom = objBorder.borderUp <= playerBorder.down && playerBorder.down <= objBorder.borderDown;
    const triggerLeft = objBorder.borderLeft <= playerBorder.left && playerBorder.left <= objBorder.borderRight;
    const triggerRight = objBorder.borderLeft <= playerBorder.right && playerBorder.right <= objBorder.borderRight;
    // console.log("(triggerTop || triggerBottom) && (triggerLeft || triggerRight)")
    // console.log(triggerTop , triggerBottom ,triggerLeft , triggerRight)
    if (
        (triggerTop || triggerBottom) &&
        (triggerLeft || triggerRight)
    ) {
        return true;
    }
    return false;
}