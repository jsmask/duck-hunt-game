
import { showScore, createSprite, wait,random } from "./tools"
import { getTextures } from "./textures"
import { TimelineMax } from "gsap"
import Bus from "@/utils/bus"
import { Container } from "pixi.js";
import { DuckSound } from "./audio"

let TYPES = ["green", "red", "black"]

export default class Duck {
    constructor({ dIndex = 0, x = 0, y = 0, speed = 3, direction = 1, stage, rect = [0, 0, 1200, 759] }) {
        this.dIndex = dIndex;
        this.vx = speed * direction;
        this.vy = speed
        this.rect = rect;
        this.stage = stage;
        this.score = 500;
        this.isHit = false;
        this.isDie = false;
        this.target = new Container();
        this.target.x = x;
        this.target.y = y;
        this.isFlyaway = false;
        // this.soundDuration = random(20,100)
        // this.duckDelta = 0;
        this.sprite = createSprite({
            name: "duck_0",
        })
        this.duck_sound = new DuckSound();
        this.sprite.scale.x *= direction;
        this.target.addChild(this.sprite)
        this.target.buttonMode = true;
        this.target.interactive = true;
        this.target.on("pointerdown", () => {
            if (!this.isHit) this.isHit = true;
        })
        this.normalAni = new TimelineMax()
        this.dieAni = new TimelineMax()
        this.fly();

        this.stage.addChild(this.target)
        Bus.$on("sendBullet", ({ e, callback }) => {
            if (this.isHit && !this.isDie) {
                this.isDie = true;
                this.hit();
                this.duck_sound.play()
                callback && callback(this)
            }
        })
        Bus.$on("flyaway", () => {
            this.isFlyaway = true;
        })
        return this;
    }
    move(delta) {
        if (this.isHit || this.isDie) return;
        const [X, Y, W, H] = this.rect
        this.target.x += this.vx;
        this.target.y += this.vy;
        if (this.isFlyaway) return;
        if (this.target.x < X || this.target.x > W - this.sprite.width / 2) {
            this.vx *= -1;
            this.sprite.scale.x *= -1;
        }
        if (this.target.y < Y + this.sprite.height / 2 || this.target.y > H - 180 - this.sprite.height / 2) {
            this.vy *= -1;
        }
        // this.duckDelta += delta;
        // if(this.duckDelta>this.soundDuration){
        //     this.duckDelta = 0;
        //     this.soundDuration = random(50,150)
        //     this.duck_sound.play()
        // }
    }
    async hit() {
        const { sprite, score, target } = this;
        this.normalAni.kill();
        sprite.texture = getTextures("duck_9")
        sprite.width = getTextures("duck_9").width
        sprite.height = getTextures("duck_9").height
        showScore({
            parent: this.stage,
            score,
            x: target.x - (this.vx < 0 ? + sprite.width : 0),
            y: target.y
        })
        await wait(.35)
        this.die()
    }
    die() {
        this.duck_sound.playDown()
        const { sprite } = this;
        sprite.texture = getTextures("duck_10")
        sprite.width = getTextures("duck_10").width
        sprite.height = getTextures("duck_10").height
        this.dieAni.to(sprite, .6, {
            y: 600,
            onComplete: () => {
                this.destroy()
                this.duck_sound.pauseDown()
            }
        })
    }
    fly() {
        const { sprite } = this;
        this.normalAni
            .from(sprite, .1, {
                texture: getTextures("duck_0"),
                width: getTextures("duck_0").width,
                height: getTextures("duck_0").height,
                ease: "SteppedEase(1)"
            })
            .to(sprite, .1, {
                texture: getTextures("duck_1"),
                width: getTextures("duck_1").width,
                height: getTextures("duck_1").height,
                ease: "SteppedEase(1)"
            })
            .to(sprite, .1, {
                texture: getTextures("duck_2"),
                width: getTextures("duck_2").width,
                height: getTextures("duck_2").height,
                y: -15,
                ease: "SteppedEase(1)"
            })
        this.normalAni.repeat(-1)
        this.normalAni.play()
    }
    destroy() {
        if (this.target.parent) {
            this.target.parent.removeChild(this.target)
        }
    }
}