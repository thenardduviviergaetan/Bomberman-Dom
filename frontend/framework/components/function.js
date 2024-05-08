const FRAME_WIDTH = 32;
// export function initCross(indexX, indexY, map) {
//     const maxY = map.atlas.length;
//     const maxX = map.atlas[0].length;
//     const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);

//     const cross = {
//         "top": indexY - 1 >= 0 && check ? getBorder(map.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
//         "left": indexX - 1 >= 0 && check ? getBorder(map.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
//         "in": check ? getBorder(map.children[indexY].children[indexX], indexY, indexX) : undefined,
//         "right": indexX + 1 < maxX && check ? getBorder(map.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
//         "bottom": indexY + 1 < maxY && check ? getBorder(map.children[indexY + 1].children[indexX], indexY - 1, indexX) : undefined,
//     };
//     return cross;
// }

export function initCrossBlast(posX, posY, map) {
    const maxY = map.atlas.length;
    const maxX = map.atlas[0].length;
    const indexX = parseInt((posX + FRAME_WIDTH / 2) / FRAME_WIDTH);
    const indexY = parseInt((posY * -1 + FRAME_WIDTH) / FRAME_WIDTH) - 1;
    const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);

    const cross = {
        "top": indexY - 1 >= 0 && check ? getBorder(map.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
        "left": indexX - 1 >= 0 && check ? getBorder(map.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
        "in": check ? getBorder(map.children[indexY].children[indexX], indexY, indexX) : undefined,
        "right": indexX + 1 < maxX && check ? getBorder(map.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
        "bottom": indexY + 1 < maxY && check ? getBorder(map.children[indexY + 1].children[indexX], indexY + 1, indexX) : undefined,
    };
    return cross;
}

export function initSquareCollision(posX, posY, map) {
    const maxY = map.atlas.length;
    const maxX = map.atlas[0].length;
    const indexX = parseInt((posX + FRAME_WIDTH / 2) / FRAME_WIDTH);
    const indexY = maxY - (parseInt((posY * -1 + FRAME_WIDTH) / FRAME_WIDTH) - 1);
    const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);
    const mX = indexX - 1 >= 0;
    const mY = indexY - 1 >= 0;
    const gX = indexX + 1 < maxX;
    const gY = indexY + 1 < maxY;
    const cross = {
        "top-left": mY && check && mX ? getBorder(map.children[indexY - 1].children[indexX - 1], indexY - 1, indexX - 1) : undefined,
        "top": mY && check ? getBorder(map.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
        "top-right": mY && check && gX ? getBorder(map.children[indexY - 1].children[indexX + 1], indexY - 1, indexX + 1) : undefined,

        "left": mX && check ? getBorder(map.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
        "in": check ? getBorder(map.children[indexY].children[indexX], indexY, indexX) : undefined,
        "right": gX && check ? getBorder(map.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,

        "bottom-left": gY && check && mX ? getBorder(map.children[indexY + 1].children[indexX - 1], indexY - 1, indexX - 1) : undefined,
        "bottom": gY && check ? getBorder(map.children[indexY + 1].children[indexX], indexY - 1, indexX) : undefined,
        "bottom-right": gY && check && gX ? getBorder(map.children[indexY + 1].children[indexX + 1], indexY - 1, indexX + 1) : undefined,
    };
    return cross;
}

function getBorder(obj, posY, posX) {
    return {
        type: obj.props.class,
        borderLeft: posX * FRAME_WIDTH,
        borderRight: (posX + 1) * FRAME_WIDTH,
        borderUp: posY * FRAME_WIDTH,
        borderDown: (posY + 1) * FRAME_WIDTH,
        indexX: posX,
        indexY: posY
    }
}