import { initSquareCollision } from "../function.js";

const FRAME_WIDTH = 32;
const keys = ["top-left", "top", "top-right", "left", "in", "right", "bottom-left", "bottom", "bottom-right"];
const solid = ["wall", "block"];

export function checkGround(player) {
    const groundObj = {
        groundLeft: false,
        groundRight: false,
        groundUp: false,
        groundDown: false
    }
    const playerBoder = {
        left: player.posX,
        right: player.posX + FRAME_WIDTH,
        // up: player.posY * -1,
        // down: (player.posY - FRAME_WIDTH) * -1,
        up: player.posY + 608,
        down: (player.posY - FRAME_WIDTH) + 608,

    }
    // const maxY = player.parent.atlas.length;
    // const maxX = player.parent.atlas[0].length;
    // const indexX = parseInt((player.posX + FRAME_WIDTH / 2) / player.parent.tileSize);
    // const indexY = maxY - (parseInt((player.posY * -1 + FRAME_WIDTH) / player.parent.tileSize) - 1);
    // const square = {
    //     //"topLeft":player.parent.children[indexY - 1].children[indexX - 1],
    //     "top":player.parent.children[indexY - 1].children[indexX].props,
    //     //"topRight":player.parent.children[indexY - 1].children[indexX + 1],
    //     "left":player.parent.children[indexY].children[indexX - 1].props,
    //     "in":player.parent.children[indexY].children[indexX].props,
    //     "right":player.parent.children[indexY].children[indexX + 1].props,
    //     //"bottomLeft":player.parent.children[indexY + 1].children[indexX - 1],
    //     "bottom":player.parent.children[indexY + 1].children[indexX].props,
    //     //"bottomRight":player.parent.children[indexY + 1].children[indexX + 1]
    // }
    // const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);
    // const cross = {
    //     "top": indexY - 1 >= 0 && check ? getBorder(player.parent.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
    //     "left": indexX - 1 >= 0 && check ? getBorder(player.parent.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
    //     "in": check ? getBorder(player.parent.children[indexY].children[indexX], indexY, indexX) : undefined,
    //     "right": indexX + 1 < maxX && check ? getBorder(player.parent.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
    //     "bottom": indexY + 1 < maxY && check ? getBorder(player.parent.children[indexY + 1].children[indexX], indexY-1, indexX) : undefined,
    // }
    const cross = initSquareCollision(player.posX, player.posY, player.parent)
    keys.forEach(key => {
        const blockBorder = cross[key]
        if (blockBorder === undefined || solid.filter((el) => el == blockBorder.type).length === 0) return;
        switch (key) {
            case "top-right":
                groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderLeft + 12 < playerBoder.right : true;
                groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderLeft + 12 < playerBoder.right : true;
                break;
            case "top-left":
                groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderRight - 12 > playerBoder.left : true;
                groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderRight - 12 > playerBoder.left : true;
                break;
            case "top":
                groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderDown - 20 >= playerBoder.up : true;
                break;
            case "left":
                groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderRight - 8 >= playerBoder.left : true;
                break;
            // case "in":
            //     break;
            case "right":
                groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderLeft + 8 <= playerBoder.right : true;
                break;
            case "bottom":
                groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderUp <= playerBoder.down : true;
                break;
            case "bottom-right":
                groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderUp < playerBoder.down && blockBorder.borderLeft + 12 < playerBoder.right : true;
                groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderUp < playerBoder.down && blockBorder.borderLeft + 12 < playerBoder.right : true;
                break;
            case "bottom-left":
                groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderUp < playerBoder.down && blockBorder.borderRight - 12 > playerBoder.left : true;
                groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderUp < playerBoder.down && blockBorder.borderRight - 12 > playerBoder.left : true;
                break;
        }
    });
    // console.log(groundObj)
    return groundObj;
}
