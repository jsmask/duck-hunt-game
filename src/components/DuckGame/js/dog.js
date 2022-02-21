import { playDogStart, playDogLaugh, playCaughtDuck } from "./audio"
import { createSprite } from "./tools"
import { getTextures } from "./textures"
import { TimelineMax } from "gsap"

export default class Dog {
    constructor(stage) {
        this.stage = stage;
    }
    start() {
        return new Promise((resolve, reject) => {
            let dog = createSprite({
                name: "dog3",
                x: 0,
                y: 570
            })
            dog.zIndex = 100;
            this.stage.addChild(dog)
            let dogSearchAni = new TimelineMax()
            dogSearchAni
                .from(dog, 0.16, { texture: getTextures("dog0"), ease: "SteppedEase(1)" })
                .to(dog, 0.16, { texture: getTextures("dog1"), ease: "SteppedEase(1)" })
                .to(dog, 0.16, { texture: getTextures("dog2"), ease: "SteppedEase(1)" })
                .to(dog, 0.16, { texture: getTextures("dog3"), ease: "SteppedEase(1)" })
                .to(dog, 0.2, { texture: getTextures("dog4"), ease: "SteppedEase(1)" })
            dogSearchAni.repeat(-1)
            dogSearchAni.play()

            let dogMoveAni = new TimelineMax()
            dogMoveAni.fromTo(dog, { x: 240 }, {
                x: 440,
                duration: 2.5,
                ease: "Power0.easeInOut",
                onComplete: () => {
                    dogSearchAni.kill();
                    dogSearchAni = new TimelineMax()
                    dogSearchAni
                        .from(dog, .8, {
                            texture: getTextures("dog5"), x: 440, y: 570, ease: "SteppedEase(1)",
                        })
                        .to(dog, .2, { 
                            texture: getTextures("dog6"), 
                            width: getTextures("dog6").width,
                            height: getTextures("dog6").height,
                            x: 460, y: 430, ease: "SteppedEase(1)" })
                        .to(dog, .2, {
                            texture: getTextures("dog7"),
                            width: getTextures("dog7").width,
                            height: getTextures("dog7").height,
                            x: 480, y: 440, ease: "SteppedEase(1)"
                        })
                        .to(dog, .5, {
                            x: 530, y: 480, alpha: 0,
                            onComplete: () => {
                                dogSearchAni.kill()
                                dogMoveAni.kill()
                                playDogStart()
                                resolve()
                            }
                        })
                }
            })
        })
    }
    caughtDuck(num = 1) {
        return new Promise((resolve, reject) => {
            playCaughtDuck()
            let dog = createSprite({
                name: num == 1 ? "dog10" : "dog11",
                x: 560,
                y: 485,
                scale:1.2
            })
            this.stage.addChild(dog)
            let dogShowAni = new TimelineMax()
            dogShowAni
                .from(dog, { y: 570 })
                .to(dog, { y: 485, duration: .5, })
                .to(dog, {
                    delay: 0.5, y: 570, onComplete: () => {
                        dogShowAni.kill();
                        this.stage.removeChild(dog)
                        resolve()
                    }
                })
            dogShowAni.play()
        })
    }
    laugh() {
        return new Promise((resolve, reject) => {
            let dog = createSprite({
                name: "dog8",
                x: 560,
                y: 485,
                scale:1.2
            })
            this.stage.addChild(dog)
            playDogLaugh();
            let laughAni = new TimelineMax();
            laughAni.fromTo(dog, .22, { texture: getTextures("dog8") }, {
                texture: getTextures("dog9"),
                immediateRender: true,
                ease: "SteppedEase(1)"
            });
            laughAni.repeat(-1)
            laughAni.play()
            let dogShowAni = new TimelineMax()
            dogShowAni
                .from(dog, { y: 570 })
                .to(dog, { y: 485, duration: .5, })
                .to(dog, {
                    delay: 0.5, y: 570, onComplete: () => {
                        laughAni.kill();
                        dogShowAni.kill();
                        this.stage.removeChild(dog)
                        resolve()
                    }
                })
            dogShowAni.play()
        })

    }
}
