import { playDogStart, playDogLaugh, pauseDogLaugh} from "./audio"
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
                y: 550
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
                            texture: getTextures("dog5"), x: 440, y: 550, ease: "SteppedEase(1)",
                        })
                        .to(dog, .2, { texture: getTextures("dog6"), x: 460, y: 420, ease: "SteppedEase(1)" })
                        .to(dog, .2, { texture: getTextures("dog7"), x: 460, y: 430, ease: "SteppedEase(1)" })
                        .to(dog, .5, {
                            x: 520, y: 460, alpha: 0,
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
    laugh() {
        return new Promise((resolve, reject) => {
            let dog = createSprite({
                name: "dog8",
                x: 570,
                y: 480
            })
            this.stage.addChild(dog)
            playDogLaugh();
            let doglaughAni = new TimelineMax();
            doglaughAni.fromTo(dog, .22, { texture: getTextures("dog8") }, {
                texture: getTextures("dog9"),
                immediateRender: true,
                ease: "SteppedEase(1)"
            });
            doglaughAni.repeat(-1)
            doglaughAni.play()
            let dogShowAni = new TimelineMax()
            dogShowAni
                .from(dog, { y: 570 })
                .to(dog, { y: 480, duration: .5, })
                .to(dog, {
                    delay: 0.5, y: 570, onComplete: () => {
                        doglaughAni.kill();
                        dogShowAni.kill();
                        this.stage.removeChild(dog)
                        resolve()
                    }
                })
            dogShowAni.play()
        })

    }
}
