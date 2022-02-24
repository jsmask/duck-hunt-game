import { Application, Loader, Container } from "pixi.js";
import assets from "./assets"
import { setTextures } from "./textures"
import MainScene from "./mainScene"
import StartScene from "./startScene"
import Bus from "@/utils/bus"
import { createAim } from "./tools"

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

    this.loader = new Loader();

    this.startScene = new StartScene(this);
    this.stage.addChild(this.startScene.stage)

    this.mainScene = new MainScene(this)
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
    this.addAim();
    this.startScene.init()
    Bus.$on("startGame", () => {
      this.startScene.hide();
      this.mainScene.init().show();
    })
  }
  addAim(){
    const isLandscape  =  window.innerHeight>window.innerWidth
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    let aim = createAim({
      x:-100,
      y:-100
    })
    this.stage.on("pointermove", e => {
      // if(isLandscape){
      //   e.data.global.x = clientWidth + e.data.global.x
      //   e.data.global.y = clientHeight + 375 + e.data.global.y
      // }
      if(isLandscape){
        // e.data.global.x += this.width
        // e.data.global.y = Math.sin(90)
        // console.log(e.data.global.y)
        // e.data.global.y = y
      }
      aim.position.copyFrom(e.data.global)
    })
    
    this.stage.on("pointerdown", e => {
      if(isLandscape){
        // e.data.global.x += this.width
        // e.data.global.y = Math.sin(90)
        // console.log(e.data.global.y)
        // e.data.global.y = y
      }
      console.log(e.data.global)
      aim.position.copyFrom(e.data.global)
    })
    this.stage.addChild(aim)
  }
  addTicker(event) {
    this.events.push(event)
  }
  update() {
    this.app.ticker.add((delta) => {
      this.startScene && this.startScene.update(delta);
      this.mainScene && this.mainScene.update(delta);
    })
  }
}