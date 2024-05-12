import { initSquareCollision } from "../function.js";

const FRAME_WIDTH = 32;
const keys = ["top-left", "top", "top-right", "left", "in", "right", "bottom-left", "bottom", "bottom-right"];
const solid = new Set(["wall", "block", "covered"]);
// const solid = ["wall", "block", "covered"];

export function checkGround(player) {
    const groundObj = {
        groundLeft: false,
        left: 0,
        groundRight: false,
        right: 0,
        groundUp: false,
        up: 0,
        groundDown: false,
        down: 0
    }
    const playerBorder = getPlayerBorder(player);
    const square = initSquareCollision(player.posX, player.posY, player.parent)
    keys.forEach(key => {
        const blockBorder = square[key]
        if (blockBorder === undefined || !solid.has(blockBorder.type)) return;
        switch (key) {
            case "top":
                top(groundObj, blockBorder, playerBorder, player.speed);
                break;
            case "left":
                left(groundObj, blockBorder, playerBorder, player.speed);
                break;
            // case "in":
            //     break;
            case "right":
                right(groundObj, blockBorder, playerBorder, player.speed);
                break;
            case "bottom":
                bottom(groundObj, blockBorder, playerBorder, player.speed);
                break;
            default:
                corner(key, groundObj, blockBorder, playerBorder, player.speed);
                break;
        }
    });
    return groundObj;
}

export function checkTrigger(player, objBorder) {
    const playerBorder = getPlayerBorder(player);

    const triggerTop = objBorder.borderUp <= playerBorder.down;
    const triggerBottom = objBorder.borderDown >= playerBorder.up;
    const triggerLeft = objBorder.borderLeft <= playerBorder.right;
    const triggerRight = objBorder.borderRight >= playerBorder.left;

    return triggerTop && triggerBottom && triggerLeft && triggerRight;
}

function getPlayerBorder(player) {
    return {
        left: player.posX + 8,
        right: player.posX + FRAME_WIDTH - 8,
        up: player.posY - FRAME_WIDTH + 640 + 8,
        down: player.posY + 640,
    }
}

const top = (groundObj, blockBorder, playerBorder, playerSpeed) => {
    if (!groundObj.groundUp && blockBorder.borderDown - 12 > playerBorder.up - playerSpeed) {
        groundObj.groundUp = true;
        groundObj.up = blockBorder.borderDown - 12 - playerBorder.up;
    }
}
const bottom = (groundObj, blockBorder, playerBorder,playerSpeed) => {
    if (!groundObj.groundDown && blockBorder.borderUp < playerBorder.down + playerSpeed) {
        groundObj.groundDown = true;
        groundObj.down = playerBorder.down - blockBorder.borderUp;
    }
}
const left = (groundObj, blockBorder, playerBorder,playerSpeed) => {
    if (!groundObj.groundLeft && blockBorder.borderRight > playerBorder.left - playerSpeed) {
        groundObj.groundLeft = true;
        groundObj.left = blockBorder.borderRight - playerBorder.left;
    }
}
const right = (groundObj, blockBorder, playerBorder,playerSpeed) => {
    if (!groundObj.groundRight && blockBorder.borderLeft < playerBorder.right + playerSpeed) {
        groundObj.groundRight = true;
        groundObj.right = blockBorder.borderLeft - playerBorder.right;
    }
}
const corner = (corner, groundObj, blockBorder, playerBorder, playerSpeed) => {
    switch (corner) {
        case "top-right":
            if (!groundObj.groundUp && blockBorder.borderLeft < playerBorder.right && blockBorder.borderDown - 12 > playerBorder.up - playerSpeed) {
                groundObj.groundUp = true;
                groundObj.right = !groundObj.groundRight ? blockBorder.borderLeft - playerBorder.right : groundObj.right;
            }
            if (!groundObj.groundRight && blockBorder.borderDown - 12 > playerBorder.up && blockBorder.borderLeft < playerBorder.right + playerSpeed) {
                groundObj.groundRight = true;
                groundObj.up = !groundObj.groundUp ? blockBorder.borderDown - 12 - playerBorder.up : groundObj.up;
            }
            break;
        case "top-left":
            if (!groundObj.groundUp && blockBorder.borderRight > playerBorder.left && blockBorder.borderDown - 12 > playerBorder.up - playerSpeed) {
                groundObj.groundUp = true;
                groundObj.left = !groundObj.groundLeft ? blockBorder.borderRight - playerBorder.left : groundObj.left;
            }
            if (!groundObj.groundLeft && blockBorder.borderDown - 12 > playerBorder.up && blockBorder.borderRight > playerBorder.left - playerSpeed) {
                groundObj.groundLeft = true;
                groundObj.up = !groundObj.groundUp ? blockBorder.borderDown - 12 - playerBorder.up : groundObj.up;
            }
            break;
        case "bottom-right":
            if (!groundObj.groundDown && blockBorder.borderLeft < playerBorder.right && blockBorder.borderUp < playerBorder.down + playerSpeed) {
                groundObj.groundDown = true;
                groundObj.right = !groundObj.groundRight ? blockBorder.borderLeft - playerBorder.right : groundObj.right;
            }
            if (!groundObj.groundRight && blockBorder.borderUp < playerBorder.down && blockBorder.borderLeft < playerBorder.right + playerSpeed) {
                groundObj.groundRight = true;
                groundObj.down = !groundObj.groundDown ? playerBorder.down - blockBorder.borderUp : groundObj.down;
            }
            break;
        case "bottom-left":
            if (!groundObj.groundDown && blockBorder.borderRight > playerBorder.left && blockBorder.borderUp < playerBorder.down + playerSpeed) {
                groundObj.groundDown = true;
                groundObj.left = !groundObj.groundLeft ? blockBorder.borderRight - playerBorder.left : groundObj.left;
            }
            if (!groundObj.groundLeft && blockBorder.borderUp < playerBorder.down && blockBorder.borderRight > playerBorder.left - playerSpeed) {
                groundObj.groundLeft = true;
                groundObj.down = !groundObj.groundDown ? playerBorder.down - blockBorder.borderUp : groundObj.down;
            }
            break;

    }
}