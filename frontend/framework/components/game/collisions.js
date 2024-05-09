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
        up: player.posY + 608,
        down: (player.posY - FRAME_WIDTH) + 608,

    }
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
    return groundObj;
}
