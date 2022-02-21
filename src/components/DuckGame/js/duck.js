
import { createSprite, wait } from "./tools"
import { getTextures } from "./textures"
import { TimelineMax } from "gsap"
import Bus from "@/utils/bus"

let TYPES = ["green", "red", "black"]

export default class Duck {
    constructor({ x = 0, y = 0, stage }) {
        this.x = x;
        this.y = y;
        this.score = 500;
        this.isHit = false;
        this.isDie = false;
        this.duck = createSprite({
            name: "duck_0",
            x,
            y,
            // width:getTextures("duck_0").width,
            // height:getTextures("duck_0").height,
        })
        this.duck.buttonMode = true;
        this.duck.interactive = true;
        this.duck.on("pointerdown", () => {
            if (!this.isHit) this.isHit = true;
        })
        this.normalAni = new TimelineMax()
        this.dieAni = new TimelineMax()
        this.fly();

        stage.addChild(this.duck)
        Bus.$on("sendBullet", ({ e, callback }) => {
            if (this.isHit && !this.isDie) {
                this.isDie = true;
                this.hit();
                callback && callback(this)
            }
        })
        return this;
    }
    async hit() {
        this.normalAni.kill();
        this.duck.texture = getTextures("duck_9")
        this.duck.width = getTextures("duck_9").width
        this.duck.height = getTextures("duck_9").height
        await wait(.3)
        this.die()
    }
    die() {
        this.duck.texture = getTextures("duck_10")
        this.duck.width = getTextures("duck_10").width
        this.duck.height = getTextures("duck_10").height
        this.dieAni.to(this.duck, .5, {
            y: 600,
            onComplete: () => {
                this.destroy()
            }
        })
    }
    fly() {
        this.normalAni
            .from(this.duck, .1, {
                texture: getTextures("duck_0"),
                width: getTextures("duck_0").width,
                height: getTextures("duck_0").height,
                ease: "SteppedEase(1)"
            })
            .to(this.duck, .1, {
                texture: getTextures("duck_1"),
                width: getTextures("duck_1").width,
                height: getTextures("duck_1").height,
                ease: "SteppedEase(1)"
            })
            .to(this.duck, .1, {
                texture: getTextures("duck_2"),
                width: getTextures("duck_2").width,
                height: getTextures("duck_2").height,
                y: this.y - 15,
                ease: "SteppedEase(1)"
            })
        this.normalAni.repeat(-1)
        this.normalAni.play()
    }
    destroy() {
        if (this.duck.parent) {
            this.duck.parent.removeChild(this.duck)
        }
    }
}