import { Application, Container, Sprite, Loader, Text } from "pixi.js";
import assets from "./assets"
import { createSprite } from "./tools"
import { setTextures, getTextures } from "./textures"
import UI from "./UI"

export default class Game {
  constructor(options = {}) {
    this.width = 1200;
    this.height = 769;
    this.el = document.querySelector("div")
    this.resolution = 1;
    this.score = 0;
    this.onProgress = function () { }
    Object.assign(this, options)
    this.fireVoice = new Audio(assets["fire"])
    return this;
  }
  init() {
    let { resolution, width, height, el } = this;

    this.app = new Application({
      width: width,
      height: height,
      backgroundColor: 0x000000,
      resolution: resolution || 1,
      antialias: true,
      autoDensity: true,
      preserveDrawingBuffer: true,
    });

    el.appendChild(this.app.view);
    this.stage = this.app.stage;
    this.stage.sortableChildren = true;

    this.events = [];
    this.loader = new Loader();

    this.stageContainer = new Container();
    this.stage.addChild(this.stageContainer);

    this.uiContainer = new Container();
    this.stage.addChild(this.uiContainer);

    this.ui  = new UI(this)

    this.loaderTextures().then(res => {
      Object.entries(res).forEach(([key, value]) => setTextures(key, value.texture))
      this.render()
    })
    return this;
  }
  destroy() {
    this.app.destroy(true, true);
  }
  loaderTextures() {
    const { loader, onProgress } = this;
    return new Promise((resolve, reject) => {
      Object.entries(assets).forEach(([key, value]) => loader.add(key, value, () => {
        onProgress(loader.progress)
      }))
      loader.load((loader, resources) => {
        onProgress(loader.progress)
        resolve(resources)
      })
    })
  }
  render() {
    this.draw(); 
    this.update();
  }
  addAim(){
    this.stage.interactive = true;
    // this.stage.buttonMode = true;
    this.stage.sortableChildren = true
    let aim = createSprite({
      name:"aim",
      x:this.width/2,
      y:this.height/2,
      height:50,
      width:50,
      anchor:0.5
    })
    aim.zIndex = 100;
    this.stage.addChild(aim)
    
    this.stage.on("pointerdown", e => {
      this.score += 23500;
      this.fireVoice.currentTime = 0
      this.fireVoice.play()
    })
    this.stage.on("pointermove",e=>{
      aim.position.copyFrom(e.data.global)
    })
  }
  draw() {
    this.addAim();
    this.ui.init();
  }
  addTicker(event) {
    this.events.push(event)
  }
  update() {
    this.app.ticker.add((delta) => {
      this.ui.update();
      this.events.forEach(event => event(delta));
    })
  }
}