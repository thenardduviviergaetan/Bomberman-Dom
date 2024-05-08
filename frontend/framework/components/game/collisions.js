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
    // const maxY = player.parent.atlas.length;
    // const maxX = player.parent.atlas[0].length;
    // const indexX = parseInt((player.posX + FRAME_WIDTH / 2) / player.parent.tileSize);
    // const indexY = maxY - (parseInt((player.posY * -1 + FRAME_WIDTH) / player.parent.tileSize) - 1);
    // const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);
    // const cross = {
    //     "top": indexY - 1 >= 0 && check ? getBorder(player.parent.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
    //     "left": indexX - 1 >= 0 && check ? getBorder(player.parent.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
    //     "in": check ? getBorder(player.parent.children[indexY].children[indexX], indexY, indexX) : undefined,
    //     "right": indexX + 1 < maxX && check ? getBorder(player.parent.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
    //     "bottom": indexY + 1 < maxY && check ? getBorder(player.parent.children[indexY + 1].children[indexX], indexY-1, indexX) : undefined,
    // }
    const indexX = parseInt((player.posX + FRAME_WIDTH / 2) / player.parent.tileSize);
    const indexY = player.parent.atlas.length - (parseInt((player.posY * -1 + FRAME_WIDTH) / player.parent.tileSize) - 1);
    const cross = initCross(indexX, indexY, player.parent);
    // console.log(cross)
    keys.forEach(key => {
        const blockBorder = cross[key]
        if (blockBorder === undefined || solid.filter((el) => el == blockBorder.type).length === 0) return;
        switch (key) {
            case "top":
                groundObj.groundUp = blockBorder.borderDown - 20 >= playerBorder.up
                break;
            case "left":
                groundObj.groundLeft = blockBorder.borderRight - 8 >= playerBorder.left
                break;
            // case "in":
            //     break;
            case "right":
                groundObj.groundRight = blockBorder.borderLeft + 8 <= playerBorder.right
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
        left: player.posX,
        right: player.posX + FRAME_WIDTH,
        // up: player.posY * -1,
        // down: (player.posY - FRAME_WIDTH) * -1,
        up: player.posY + 608,
        down: (player.posY - FRAME_WIDTH) + 608,

    }
}

export function checkTrigger(player, obj) {
    const playerBorder = getPlayerBorder(player);
    const triggerTop = obj.borderUp <= playerBorder.up && playerBorder.up <= obj.borderDown;
    const triggerBottom = obj.borderUp <= playerBorder.down && playerBorder.down <= obj.borderDown;
    const triggerLeft = obj.borderLeft <= playerBorder.left && playerBorder.left <= obj.borderRight;
    const triggerRight = obj.borderLeft <= playerBorder.right && playerBorder.right <= obj.borderRight;
    // console.log("(triggerTop || triggerBottom) && (triggerLeft || triggerRight)")
    // console.log(triggerTop, triggerBottom, triggerLeft, triggerRight)
    if (
        (triggerTop || triggerBottom) &&
        (triggerLeft || triggerRight)
    ) {
        return true;
    }
    // console.log(obj);
    return false;
}