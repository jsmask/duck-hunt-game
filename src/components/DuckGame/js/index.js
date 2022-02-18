import { Application, Loader } from "pixi.js";
import assets from "./assets"
import { setTextures} from "./textures"
import MainScene from "./mainScene"
import StartScene from "./startScene"
import Bus from "@/utils/bus"

export default class Game {
  constructor(options = {}) {
    this.width = 1200;
    this.height = 769;
    this.el = document.querySelector("div")
    this.resolution = 1;
    this.onProgress = function () { }
    Object.assign(this, options)
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

    this.app.renderer.plugins.interaction.cursorStyles.default = `none`;
    this.app.renderer.plugins.interaction.cursorStyles.hover = `none`;
    this.app.renderer.plugins.interaction.cursorStyles.pointer = `none`;

    el.appendChild(this.app.view);
    this.stage = this.app.stage;
    this.stage.sortableChildren = true;
    this.stage.interactive = true;

    this.events = [];
    this.loader = new Loader();

    this.startScene = new StartScene(this);
    this.stage.addChild(this.startScene.stage)
    
    this.mainScene  = new MainScene(this)
    this.stage.addChild(this.mainScene.stage)

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
  draw() {
    this.startScene.init()
    
    Bus.$on("startGame",()=>{
      this.startScene.hide();
      this.mainScene.init()
    })
  }
  addTicker(event) {
    this.events.push(event)
  }
  update() {
    this.app.ticker.add((delta) => {
      this.startScene && this.startScene.update(delta);
      this.mainScene && this.mainScene.update(delta);
      this.events.forEach(event => event(delta));
    })
  }
}