import Gui from "./gui.js";

export default class MainMenu extends Gui{
    constructor(systemeData){
        super("menu-main","menu-main",250,200,(window.innerWidth/2),(window.innerHeight/2),systemeData);
        this.HTML.appendChild(createElementH("Super Mario",2))
        this.HTML.appendChild(createSpace(30));
        this.HTML.appendChild(createButton("Continue",()=>{
            this.systemeData.isPaused = false;
            this.systemeData.isMainMenu = false;
            this.update();
        }))
        this.HTML.appendChild(createSpace(5));
        this.HTML.appendChild(createButton("New Game",()=>{

        }))
    }
    update(){
        this.draw(this.systemeData.isMainMenu);
    }
}