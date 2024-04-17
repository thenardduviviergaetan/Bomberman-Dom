import Gui from "./gui.js";

export default class MenuPause extends Gui{
    constructor(systemeData){
        // constructor(id,name,width,height,posx,posy){
        // super(id,name,width,height,posx,posy);
        super("menu-paused","menu-paused",250,200,(window.innerWidth/2),(window.innerHeight/2),systemeData);
        this.HTML.style.display = "none";
        this.HTML.appendChild(createElementH("Pause",1));
        this.HTML.appendChild(createButton("Resume",()=>{
            this.systemeData.isPaused = false;
            this.systemeData.isMenuPaused = false;
            this.update();
        }))
        this.HTML.appendChild(createButton("Restart",()=>{

        }))
        this.HTML.appendChild(createButton("Exit",()=>{
            // window.close();
        }))
    }
    update(){
        this.draw(this.systemeData.isMenuPaused);
    }
}