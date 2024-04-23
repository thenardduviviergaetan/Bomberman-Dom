import Props from "../props.js";

export default class Blast extends Props {
    constructor(systemeData, posx, posy) {
        super(systemeData, "blast-jaune");
        this.posx = posx;
        this.posy = posy;
        this.generate();
    }
    generate() {
        let raws, col;
        // console.log(this.SystemeData.level.tab.back);
        // this.SystemeData.level.tab.back.forEach((backline, key) => {
            // console.log(key, backline)
            const backline = this.SystemeData.level.tab.back[1];
            backline.forEach((element) => {
                // let elementHTML = document.getElementById(element.id)
                // console.log(elementHTML)
                    console.log(element)
                    // console.log(element)
                if (this.checkTrigger(element)) {
                    console.log(element)
                }
            })
        // });
    }
}