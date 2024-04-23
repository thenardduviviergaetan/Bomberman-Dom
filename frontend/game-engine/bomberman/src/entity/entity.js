export default class Entity {
    constructor(SystemeData, type) {
        this.directionRight = true;
        this.SystemeData = SystemeData;
        this.HTML = document.createElement("div");
        this.HTML.classList.add(type);
        this.posy = 0;
        this.posx = 0;
        this.isGround = true;
        this.isGroundRight = true;
        this.isGroundLeft = true;
        this.isGroundTop = true;
        this.lastGroundX = 0;
        this.animationId = 0;
    }
    // set la sprite envoyer en entrer a l'entiter
    setSprite(sprite) {
        this.HTML.style.width = sprite.width;
        this.HTML.style.height = sprite.height;
        this.HTML.style.backgroundImage = sprite.image;
        this.HTML.style.backgroundPosition = sprite.position;
    }
    //checkGround permet de detecter les collision avec les block type solide en entrand le classType qui est la class de ou des objet a tester (brick,solid, ect)
    checkGround(classType, entityBorder) {
        const listBlock = document.querySelectorAll(classType);
        listBlock.forEach(block => {
            const blockBorder = block.getBoundingClientRect();
            ///TODO:
            /// paramettre a rendre editable pour chaque entiter
            const quoteOffset = 12
            const quoteTop = 32
            ///
            const testX = (
                (blockBorder.left < entityBorder.left + quoteOffset && entityBorder.left + quoteOffset < blockBorder.right) ||
                (blockBorder.left < entityBorder.right - quoteOffset && entityBorder.right - quoteOffset < blockBorder.right)
            );
            const testBottom = entityBorder.bottom == blockBorder.top;
            const testTop = entityBorder.top + quoteTop == blockBorder.bottom;
            const testY = (
                (entityBorder.bottom > blockBorder.top && entityBorder.bottom < blockBorder.bottom) ||
                (entityBorder.top + quoteTop < blockBorder.bottom && entityBorder.top + quoteTop > blockBorder.top)
            );
            const testLeft = (
                (entityBorder.left + quoteOffset > blockBorder.right - 1) &&
                (entityBorder.left + quoteOffset < blockBorder.right + 1)
            ) && testY
            const testRight = (
                (entityBorder.right - quoteOffset > blockBorder.left - 2) &&
                (entityBorder.right - quoteOffset < blockBorder.left + 2)
            ) && testY
            if (testLeft && !testBottom) {
                this.isGroundLeft = true;
            }
            if (testRight && !testBottom) {
                this.isGroundRight = true;
            }
            if (testBottom && testX && (!testRight && !testLeft)) {
                this.isGround = true;
                // console.log(block)
                // console.log("testBottom && testX && (!testRight && !testLeft)")
                // console.log(testBottom , testX ,!testRight , !testLeft)
            }
            if (testTop && testX && (!testRight && !testLeft)) {
                this.isGroundTop = true;
                // console.log(block)
                // console.log("testTop && testX && (!testRight && !testLeft)")
                // console.log(testTop , testX ,!testRight , !testLeft)
            }
        });
    }
    //checkTrigger
    checkTrigger(propsTriger) {
        const entityBorder = this.HTML.getBoundingClientRect();
        const propsBorder = propsTriger.HTML !== undefined ? propsTriger.HTML.getBoundingClientRect() : propsTriger.getBoundingClientRect() ;
        const trigerTop = propsBorder.top <= entityBorder.top && entityBorder.top <= propsBorder.bottom;
        const trigerBottom = propsBorder.top <= entityBorder.bottom && entityBorder.bottom <= propsBorder.bottom;
        const trigerLeft = propsBorder.left <= entityBorder.left && entityBorder.left <= propsBorder.right;
        const trigerRight = propsBorder.left <= entityBorder.right && entityBorder.right <= propsBorder.right;
        console.log("(trigerTop || trigerBottom) && (trigerLeft || trigerRight)")
        console.log(trigerTop, trigerBottom, trigerLeft, trigerRight)
        if (
            (trigerTop || trigerBottom) &&
            (trigerLeft || trigerRight)
        ) {
            return true;
        }
        return false;
    }
}