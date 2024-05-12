const FRAME_WIDTH = 32;
const crossKeys = ["top", "left", "right", "bottom"]
export function initCrossBlast(posX, posY, map, range) {
    const maxY = map.atlas.length;
    const maxX = map.atlas[0].length;
    const indexX = parseInt((posX + FRAME_WIDTH / 2) / FRAME_WIDTH);
    const indexY = parseInt((posY * -1 + FRAME_WIDTH) / FRAME_WIDTH) - 1;
    const check = (indexX >= 0 && indexX < maxX) && (indexY >= 0 && indexY < maxY);

    const cross = {
        "top": [],
        "left": [],
        "in": [],
        "right": [],
        "bottom": [],
    }
    if (check) cross.in.push(getBorder(map.children[indexY].children[indexX], indexY, indexX));
    crossKeys.forEach((key) => {
        let compt = 0;
        let next = true;
        let tempY = indexY;
        let tempX = indexX;
        while (next) {
            compt++;
            switch (key) {
                case "top":
                    tempY--;
                    next = tempY >= 0 && check;
                    break;
                case "left":
                    tempX--;
                    next = tempX >= 0 && check;
                    break;
                case "right":
                    tempX++;
                    next = tempX < maxX && check;
                    break;
                case "bottom":
                    tempY++;
                    next = tempY < maxY && check;
                    break;
            }
            if (next) {
                let mapCase = map.children[tempY].children[tempX];
                if (mapCase.props.class !== "wall") {
                    cross[key].push(getBorder(mapCase, tempY, tempX));
                }else{
                    next = false;
                }
            }
            next = !next ? false : compt < range;
        }
    });
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
    const square = {
        "top-left": mY && check && mX ? getBorder(map.children[indexY - 1].children[indexX - 1], indexY - 1, indexX - 1) : undefined,
        "top": mY && check ? getBorder(map.children[indexY - 1].children[indexX], indexY - 1, indexX) : undefined,
        "top-right": mY && check && gX ? getBorder(map.children[indexY - 1].children[indexX + 1], indexY - 1, indexX + 1) : undefined,

        "left": mX && check ? getBorder(map.children[indexY].children[indexX - 1], indexY, indexX - 1) : undefined,
        "in": check ? getBorder(map.children[indexY].children[indexX], indexY, indexX) : undefined,
        "right": gX && check ? getBorder(map.children[indexY].children[indexX + 1], indexY, indexX + 1) : undefined,

        "bottom-left": gY && check && mX ? getBorder(map.children[indexY + 1].children[indexX - 1], indexY + 1, indexX - 1) : undefined,
        "bottom": gY && check ? getBorder(map.children[indexY + 1].children[indexX], indexY + 1, indexX) : undefined,
        "bottom-right": gY && check && gX ? getBorder(map.children[indexY + 1].children[indexX + 1], indexY + 1, indexX + 1) : undefined,
    };
    return square;
}

export function getBorder(obj, posY, posX) {
    return {
        type: obj.props.class,
        bonus: obj.props.bonus,
        children: obj.children,
        parent: obj.parent,
        borderLeft: posX * FRAME_WIDTH,
        borderRight: (posX + 1) * FRAME_WIDTH,
        borderUp: posY * FRAME_WIDTH,
        borderDown: (posY + 1) * FRAME_WIDTH,
        indexX: posX,
        indexY: posY
    }
}