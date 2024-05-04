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
    const playerBoder = {
        left: player.posX,
        right: player.posX + FRAME_WIDTH,
        // up: player.posY * -1,
        // down: (player.posY - FRAME_WIDTH) * -1,
        up: player.posY + 608,
        down: (player.posY - FRAME_WIDTH) + 608,

    }
    const maxY = player.parent.atlas.length;
    const maxX = player.parent.atlas[0].length;
    const indexX = parseInt((player.posX + FRAME_WIDTH / 2) / player.parent.tileSize);
    const indexY = maxY - (parseInt((player.posY * -1 + FRAME_WIDTH) / player.parent.tileSize) - 1);
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
    const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);
    const cross = {
        "top": indexY - 1 >= 0 && check ? getBorder(player.parent.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
        "left": indexX - 1 >= 0 && check ? getBorder(player.parent.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
        "in": check ? getBorder(player.parent.children[indexY].children[indexX], indexY, indexX) : undefined,
        "right": indexX + 1 < maxX && check ? getBorder(player.parent.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
        "bottom": indexY + 1 < maxY && check ? getBorder(player.parent.children[indexY + 1].children[indexX], indexY-1, indexX) : undefined,
    }
    keys.forEach(key => {
        const blockBorder = cross[key]
        if (blockBorder === undefined || solid.filter((el) => el == blockBorder.type).length === 0) return;
        switch (key) {
            case "top":
                groundObj.groundUp = blockBorder.borderDown-20 >= playerBoder.up
                console.log("up",blockBorder.borderDown-20, playerBoder.up,groundObj.groundUp)
                break;
            case "left":
                groundObj.groundLeft = blockBorder.borderRight-8 >= playerBoder.left
                console.log("left",blockBorder.borderRight-8, playerBoder.left,groundObj.groundLeft)
                break;
            // case "in":
            //     break;
            case "right":
                groundObj.groundRight = blockBorder.borderLeft+8 <= playerBoder.right
                console.log("right",blockBorder.borderLeft+8 , playerBoder.right,groundObj.groundRight)
                break;
            case "bottom":
                groundObj.groundDown = blockBorder.borderUp <= playerBoder.down
                console.log("bottom",blockBorder.borderUp, playerBoder.down,groundObj.groundDown)
                break;
        }
    });
    // console.log(groundObj)
    return groundObj;
}

function getBorder(obj, posY, posX) {
    return {
        type: obj.props.class,
        borderLeft: posX * FRAME_WIDTH,
        borderRight: (posX + 1) * FRAME_WIDTH,
        borderUp: posY * FRAME_WIDTH,
        borderDown: (posY + 1) * FRAME_WIDTH
    }
}