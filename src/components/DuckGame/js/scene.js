import { Container } from "pixi.js";
export default class Scene {
    constructor(game) {
        this.game = game;
        this.stage = new Container();
        this.stage.interactive = true;
        this.stage.buttonMode = true;
        this.stage.sortableChildren = true
        this.stage.zIndex = 1
        return this
    }
    onStart() { }
    init() { }
    show() {
        this.stage.visible = true
    }
    hide() {
        this.stage.visible = false
    }
    update(delta) {
        if (!this.stage.visible) return;
    }
    wait(t = 1) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, t * 1000)
        })
    }
}