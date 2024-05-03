const FRAME_WIDTH = 32;

export function checkGround(player) {
    const groundObj = {
        groundLeft: false,
        groundRight: false,
        groundUp: false,
        groundDown: false
    }
    const playerBoder = {
        borderLeft: player.posX,
        borderRight: player.posX + FRAME_WIDTH,
        borderUp: player.posY * -1,
        borderDown: (player.posY - FRAME_WIDTH) * -1,
    }
    const maxY = player.parent.atlas.length;
    const maxX = player.parent.atlas[0].length;
    const indexX = parseInt((player.posX + FRAME_WIDTH / 2) / player.parent.tileSize);
    const indexY = maxY - (parseInt((player.posY * -1 + FRAME_WIDTH) / player.parent.tileSize) - 1);
    // console.log(indexX,indexY,"\n",playerBoder);
    // console.log(player.parent.children[indexY-1].children[indexX+1]);
    // console.log(player.parent.children[indexY-1].children[indexX-1]);
    // console.log(player.parent.children[indexY-1].children[indexX]);
    // console.log(player.parent.children[indexY].children[indexX+1]);
    // console.log(player.parent.children[indexY].children[indexX-1]);
    // console.log(player.parent.children[indexY].children[indexX]);
    // console.log(player.parent.children[indexY+1].children[indexX+1]);
    // console.log(player.parent.children[indexY+1].children[indexX-1]);
    // console.log(player.parent.children[indexY+1].children[indexX]);
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
    // console.log(indexX,indexY)
    const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);
    // const cross = {
    //     "top": indexY - 1 >= 0 && check ? player.parent.children[indexY - 1].children[indexX].props.class : undefined,
    //     "left": indexX - 1 >= 0 && check ? player.parent.children[indexY].children[indexX - 1].props : undefined,
    //     "in": check ? player.parent.children[indexY].children[indexX].props : undefined,
    //     "right": indexX + 1 < maxX && check ? player.parent.children[indexY].children[indexX + 1].props : undefined,
    //     "bottom": indexY + 1 < maxY && check ? player.parent.children[indexY + 1].children[indexX].props : undefined,
    // }
    const cross = {
        "top": indexY - 1 >= 0 && check ? getBorder(player.parent.children[indexY - 1].children[indexX],indexY - 1,indexX) : undefined,
        "left": indexX - 1 >= 0 && check ? getBorder(player.parent.children[indexY].children[indexX - 1],indexY,indexX-1) : undefined,
        "in": check ? getBorder(player.parent.children[indexY].children[indexX],indexY,indexX) : undefined,
        "right": indexX + 1 < maxX && check ? getBorder(player.parent.children[indexY].children[indexX + 1] ,indexY,indexX+1) : undefined,
        "bottom": indexY + 1 < maxY && check ? getBorder(player.parent.children[indexY + 1].children[indexX],indexY + 1,indexX) : undefined,
    }
    console.log(cross);
}

function getBorder(obj,posY,posX){
    return {
        type:obj.props.class,
        borderLeft: posX* FRAME_WIDTH,
        borderRight: (posX+1) * FRAME_WIDTH,
        borderUp: posY* FRAME_WIDTH,
        borderDown: (posY+1) * FRAME_WIDTH
    }
}