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

// function getPlayerBorder(player) {
//     // return {
//     //     left: player.posX + 8,
//     //     right: player.posX + FRAME_WIDTH - 8,
//     //     up: player.posY + 608 + 20,
//     //     down: (player.posY - FRAME_WIDTH) + 608,

//     // }
    // return {
    //     left: player.posX,
    //     right: player.posX + FRAME_WIDTH,
    //     up: player.posY + 608,
    //     down: (player.posY - FRAME_WIDTH) + 608,

    // }
// }

export function checkTrigger(player, objBorder) {
    const playerBorder = {
        left: player.posX,
        right: player.posX + FRAME_WIDTH,
        up: player.posY - FRAME_WIDTH + 672,
        down: (player.posY ) + 672,

    }
    // player.up += 32;
    // player.down += 32;
    // const triggerTop = objBorder.borderUp < playerBorder.up+8 && playerBorder.up+8 < objBorder.borderDown;
    // const triggerBottom = objBorder.borderUp < playerBorder.down && playerBorder.down < objBorder.borderDown;
    // const triggerLeft = objBorder.borderLeft< playerBorder.left +8 && playerBorder.left+8 < objBorder.borderRight;
    // const triggerRight = objBorder.borderLeft< playerBorder.right-8 && playerBorder.right-8 < objBorder.borderRight;
    const triggerTop = objBorder.borderUp <= playerBorder.down;
    const triggerBottom = objBorder.borderDown >= playerBorder.up;
    const triggerLeft = objBorder.borderLeft <= playerBorder.right;
    const triggerRight = objBorder.borderRight >= playerBorder.left;
    // console.log("triggerTop :",triggerTop,"objBorder.borderUp <= playerBorder.down",objBorder.borderUp , playerBorder.down)
    // console.log("triggerBottom :",triggerBottom,"objBorder.borderDown >= playerBorder.up",objBorder.borderDown , playerBorder.up)
    // console.log("triggerLeft :",triggerLeft,"objBorder.borderLeft <= playerBorder.right",objBorder.borderLeft , playerBorder.right)
    // console.log("triggerRight :",triggerRight,"objBorder.borderRight >= playerBorder.left",objBorder.borderRight , playerBorder.left)
    // console.log("(triggerTop || triggerBottom) && (triggerLeft || triggerRight)")
    // console.log(triggerTop , triggerBottom ,triggerLeft , triggerRight)
    if (
        // (triggerTop || triggerBottom) &&
        // (triggerLeft || triggerRight)
        (triggerTop && triggerBottom) &&
        (triggerLeft && triggerRight)
    ) {
        // if (triggerTop) console.log("triggerTop :")
        // if (triggerTop) console.log("objBorder.borderUp, playerBorder.up, objBorder.borderDown")
        // if (triggerTop) console.log(objBorder.borderUp, playerBorder.up, objBorder.borderDown)
        // if (triggerBottom) console.log("triggerBottom :")
        // if (triggerBottom) console.log("objBorder.borderUp, playerBorder.down, objBorder.borderDown")
        // if (triggerBottom) console.log( objBorder.borderUp, playerBorder.down, objBorder.borderDown)
        // if (triggerLeft) console.log("triggerLeft :")
        // if (triggerLeft) console.log("objBorder.borderLeft, playerBorder.left, objBorder.borderRight")
        // if (triggerLeft) console.log( objBorder.borderLeft, playerBorder.left, objBorder.borderRight)
        // if (triggerRight) console.log("triggerRight :")
        // if (triggerRight) console.log("objBorder.borderLeft, playerBorder.right, objBorder.borderRight")
        // if (triggerRight) console.log( objBorder.borderLeft, playerBorder.right, objBorder.borderRight)
        return true;
    }
    return false;
}