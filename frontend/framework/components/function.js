const FRAME_WIDTH = 32;

export function initCross(indexX, indexY, map) {
    const maxY = map.atlas.length;
    const maxX = map.atlas[0].length;
    const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);

    const cross = {
        "top": indexY - 1 >= 0 && check ? getBorder(map.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
        "left": indexX - 1 >= 0 && check ? getBorder(map.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
        "in": check ? getBorder(map.children[indexY].children[indexX], indexY, indexX) : undefined,
        "right": indexX + 1 < maxX && check ? getBorder(map.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,
        "bottom": indexY + 1 < maxY && check ? getBorder(map.children[indexY + 1].children[indexX], indexY - 1, indexX) : undefined,
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
        indexX:posX,
        indexY:posY
    }
}