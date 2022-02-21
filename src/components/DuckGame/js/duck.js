
import { createSprite } from "./tools"
import { getTextures } from "./textures"
import { TimelineMax } from "gsap"

let TYPES = ["green", "red", "black"]

export default class Duck {
    constructor({ x = 0, y = 0, stage }) {
        this.x = x;
        this.y = y;
        let sprite = createSprite({
            name: "duck_0",
            x,
            y
        })
        stage.addChild(sprite)
        return this;
    }
    fly() {

    }
}