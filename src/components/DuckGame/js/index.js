import { Application, Container, Sprite, Loader } from "pixi.js";
import { assets, setTextures, getTextures } from "./assets"
import { createSprite } from "./tools"

export default class Game {
  constructor(options = {}) {
    this.width = 1200;
    this.height = 769;
    this.el = document.querySelector("div")
    this.resolution = 1;
    Object.assign(this, options)
    this.events = [];
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
      preserveDrawingBuffer: true,
    });

    el.appendChild(this.app.view);
    this.stage = this.app.stage;
    this.loader = new Loader();
    this.stageContainer = new Container();
    this.stageContainer.zIndex = 1;
    this.stage.addChild(this.stageContainer);

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
    const { loader } = this;
    return new Promise((resolve, reject) => {
      loader
        .add("stage", assets["stage"])
        .load((loader, resources) => {
          resolve(resources)
        })
    })
  }
  render() {
    this.draw();
  }
  draw() {
    this.drawBackground();
  }
  drawBackground() {
    this.stageContainer.addChild(createSprite({
      name: "stage",
      width: this.width,
      height: this.height,
      x: 0,
      y: 0
    }))
  }
  addTicker(event) {
    this.events.push(event)
  }
  update() {
    this.app.ticker.add((delta) => {
      this.events.forEach(event => event(delta));
    })
  }
}