/**
 * Initializes the cross blast for a given position on the map.
 * @param {number} posX - The x-coordinate of the position.
 * @param {number} posY - The y-coordinate of the position.
 * @param {object} map - The map object.
 * @param {number} range - The blast range.
 * @returns {object} - The cross blast object.
 */
export function initCrossBlast(posX, posY, map, range) {
    const FRAME_WIDTH = 32;
    const crossKeys = ["top", "left", "right", "bottom"];
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
    };

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
                } else {
                    next = false;
                }
            }

            next = !next ? false : compt < range;
        }
    });

    return cross;
}

/**
 * Initializes the square collision for a given position on the map.
 * @param {number} posX - The x-coordinate of the position.
 * @param {number} posY - The y-coordinate of the position.
 * @param {object} map - The map object.
 * @returns {object} - The square collision object.
 */
export function initSquareCollision(posX, posY, map) {
    const FRAME_WIDTH = 32;
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
    map.tabBomb.returnBomb().forEach((bomb) => {
        const bombX = bomb.posX / 32;
        const bombY = bomb.posY / 32;
        switch (true) {
            case (bombY === indexY - 1) && (bombX === indexX - 1):
                square["top-left"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY - 1) && (bombX === indexX):
                square["top"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY - 1) && (bombX === indexX + 1):
                square["top-right"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY) && (bombX === indexX - 1):
                square["left"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY) && (bombX === indexX):
                square["in"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY) && (bombX === indexX + 1):
                square["right"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY + 1) && (bombX === indexX - 1):
                square["bottom-left"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY + 1) && (bombX === indexX):
                square["bottom"] = getBorder(bomb, bombY, bombX);
                break;
            case (bombY === indexY + 1) && (bombX === indexX + 1):
                square["bottom-right"] = getBorder(bomb, bombY, bombX);
                break;
        }
    });
    return square;
}

/**
 * Gets the border information for a given object on the map.
 * @param {object} obj - The object on the map.
 * @param {number} posY - The y-coordinate of the object.
 * @param {number} posX - The x-coordinate of the object.
 * @returns {object} - The border information object.
 */
export function getBorder(obj, posY, posX) {
    const FRAME_WIDTH = 32;

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
    };
}