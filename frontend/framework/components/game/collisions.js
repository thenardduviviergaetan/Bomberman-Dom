import { initSquareCollision } from "../function.js";

const FRAME_WIDTH = 32;
const keys = ["top-left", "top", "top-right", "left", "in", "right", "bottom-left", "bottom", "bottom-right"];
const solid = ["wall", "block", "covered"];

// export function checkGround(player) {
//     const groundObj = {
//         groundLeft: false,
//         groundRight: false,
//         groundUp: false,
//         groundDown: false
//     }
//     const playerBoder = {
//         left: player.posX,
//         right: player.posX + FRAME_WIDTH,
//         up: player.posY + 608,
//         down: (player.posY - FRAME_WIDTH) + 608,
//     }
//     const cross = initSquareCollision(player.posX, player.posY, player.parent)
//     keys.forEach(key => {
//         const blockBorder = cross[key]
//         if (blockBorder === undefined || solid.filter((el) => el == blockBorder.type).length === 0) return;
//         switch (key) {
//             case "top-right":
//                 groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderLeft + 12 < playerBoder.right : true;
//                 groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderLeft + 12 < playerBoder.right : true;
//                 break;
//             case "top-left":
//                 groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderRight - 12 > playerBoder.left : true;
//                 groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderDown - 20 > playerBoder.up && blockBorder.borderRight - 12 > playerBoder.left : true;
//                 break;
//             case "top":
//                 groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderDown - 20 >= playerBoder.up : true;
//                 break;
//             case "left":
//                 groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderRight - 8 >= playerBoder.left : true;
//                 break;
//             // case "in":
//             //     break;
//             case "right":
//                 groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderLeft + 8 <= playerBoder.right : true;
//                 break;
//             case "bottom":
//                 groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderUp <= playerBoder.down : true;
//                 break;
//             case "bottom-right":
//                 groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderUp < playerBoder.down && blockBorder.borderLeft + 12 < playerBoder.right : true;
//                 groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderUp < playerBoder.down && blockBorder.borderLeft + 12 < playerBoder.right : true;
//                 break;
//             case "bottom-left":
//                 groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderUp < playerBoder.down && blockBorder.borderRight - 12 > playerBoder.left : true;
//                 groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderUp < playerBoder.down && blockBorder.borderRight - 12 > playerBoder.left : true;
//                 break;
//         }
//     });
//     return groundObj;
// }

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
    // const playerBorder = {
    //     left: player.posX+8,
    //     right: player.posX + FRAME_WIDTH-8,
    //     up: player.posY - FRAME_WIDTH + 640+8,
    //     down: player.posY + 640,
    // };
    const square = initSquareCollision(player.posX, player.posY, player.parent)
    keys.forEach(key => {
        const blockBorder = square[key]
        const top = () => {
            if (!groundObj.groundUp && blockBorder.borderDown - 12 > playerBorder.up - player.speed) {
                groundObj.groundUp = true;
                groundObj.up = blockBorder.borderDown - 12 - playerBorder.up;
            }
        }
        const bottom = () => {
            if (!groundObj.groundDown && blockBorder.borderUp < playerBorder.down + player.speed) {
                groundObj.groundDown = true;
                groundObj.down = playerBorder.down - blockBorder.borderUp;
            }
        }
        const left = () => {
            if (!groundObj.groundLeft && blockBorder.borderRight > playerBorder.left - player.speed) {
                groundObj.groundLeft = true;
                groundObj.left = blockBorder.borderRight - playerBorder.left;
            }
        }
        const right = () => {
            if (!groundObj.groundRight && blockBorder.borderLeft < playerBorder.right + player.speed) {
                groundObj.groundRight = true;
                groundObj.right = blockBorder.borderLeft - playerBorder.right;
                // console.log("groundObj.right =  blockBorder.borderLeft - playerBorder.right")
                // console.log(groundObj.right, blockBorder.borderLeft, playerBorder.right)
            }
        }
        const corner = (corner) => {
            switch (corner) {
                case "top-right":
                    // groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderLeft < playerBorder.right + player.speed : true;
                    // groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderDown - 12 > playerBorder.up - player.speed : true;
                    // groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderLeft < playerBorder.right && blockBorder.borderDown - 12 > playerBorder.up - player.speed : true;
                    if (!groundObj.groundUp && blockBorder.borderLeft < playerBorder.right && blockBorder.borderDown - 12 > playerBorder.up - player.speed) {
                        groundObj.groundUp = true;
                        groundObj.right = !groundObj.groundRight ? blockBorder.borderLeft - playerBorder.right : groundObj.right;
                    }
                    // groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderDown - 12 > playerBorder.up && blockBorder.borderLeft < playerBorder.right + player.speed: true;
                    if (!groundObj.groundRight && blockBorder.borderDown - 12 > playerBorder.up && blockBorder.borderLeft < playerBorder.right + player.speed) {
                        groundObj.groundRight = true;
                        groundObj.up = !groundObj.groundUp ? blockBorder.borderDown - 12 - playerBorder.up : groundObj.up;
                    }
                    break;
                case "top-left":
                    // groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderRight < playerBorder.left - player.speed : true;
                    // groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderDown - 12 > playerBorder.up - player.speed : true;
                    // groundObj.groundUp = !groundObj.groundUp ? blockBorder.borderRight > playerBorder.left && blockBorder.borderDown - 12 > playerBorder.up - player.speed: true;
                    if (!groundObj.groundUp && blockBorder.borderRight > playerBorder.left && blockBorder.borderDown - 12 > playerBorder.up - player.speed) {
                        groundObj.groundUp = true;
                        groundObj.left = !groundObj.groundLeft ? blockBorder.borderRight - playerBorder.left : groundObj.left;
                    }
                    // groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderDown - 12 > playerBorder.up && blockBorder.borderRight < playerBorder.left - player.speed: true;
                    if (!groundObj.groundLeft && blockBorder.borderDown - 12 > playerBorder.up && blockBorder.borderRight > playerBorder.left - player.speed) {
                        groundObj.groundLeft = true;
                        groundObj.up = !groundObj.groundUp ? blockBorder.borderDown - 12 - playerBorder.up : groundObj.up;
                    }
                    break;
                case "bottom-right":
                    // groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderLeft < playerBorder.right + player.speed : true;
                    // groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderUp < playerBorder.down + player.speed : true;
                    // groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderLeft < playerBorder.right && blockBorder.borderUp < playerBorder.down + player.speed : true;
                    if (!groundObj.groundDown && blockBorder.borderLeft < playerBorder.right && blockBorder.borderUp < playerBorder.down + player.speed){
                        groundObj.groundDown = true;
                        groundObj.right = !groundObj.groundRight ? blockBorder.borderLeft - playerBorder.right : groundObj.right;
                    }
                    // groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderUp < playerBorder.down && blockBorder.borderLeft < playerBorder.right + player.speed : true;
                    if (!groundObj.groundRight && blockBorder.borderUp < playerBorder.down && blockBorder.borderLeft < playerBorder.right + player.speed) {
                        groundObj.groundRight = true;
                        groundObj.down = !groundObj.groundDown ? playerBorder.down - blockBorder.borderUp : groundObj.down;
                    }
                    break;
                case "bottom-left":
                    // groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderRight < playerBorder.left - player.speed : true;
                    // groundObj.groundRight = !groundObj.groundRight ? blockBorder.borderUp < playerBorder.down + player.speed : true;
                    // groundObj.groundDown = !groundObj.groundDown ? blockBorder.borderRight > playerBorder.left && blockBorder.borderUp < playerBorder.down + player.speed : true;
                    if (!groundObj.groundDown && blockBorder.borderRight > playerBorder.left && blockBorder.borderUp < playerBorder.down + player.speed) {
                        groundObj.groundDown = true;
                        groundObj.left = !groundObj.groundLeft ? blockBorder.borderRight - playerBorder.left : groundObj.left;
                    }
                    // groundObj.groundLeft = !groundObj.groundLeft ? blockBorder.borderUp < playerBorder.down && blockBorder.borderRight > playerBorder.left - player.speed : true;
                    if (!groundObj.groundLeft && blockBorder.borderUp < playerBorder.down && blockBorder.borderRight > playerBorder.left - player.speed) {
                        groundObj.groundLeft = true;
                        groundObj.down = !groundObj.groundDown ? playerBorder.down - blockBorder.borderUp : groundObj.down;
                    }
                    break;

            }
        }
        if (blockBorder === undefined || solid.filter((el) => el == blockBorder.type).length === 0) return;
        switch (key) {
            case "top":
                top();
                break;
            case "left":
                left();
                break;
            // case "in":
            //     break;
            case "right":
                right();
                break;
            case "bottom":
                bottom();
                break;
            default:
                corner(key);
                break;
        }
    });
    return groundObj;
}

//FIXME
export function checkTrigger(player, objBorder) {
    const playerBorder = getPlayerBorder(player);
    // = {
    //     left: player.posX+8,
    //     right: player.posX + FRAME_WIDTH-8,
    //     up: player.posY - FRAME_WIDTH + 640+8,
    //     down: player.posY + 640,
    // };

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