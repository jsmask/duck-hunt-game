import { Text, Graphics, Container } from "pixi.js";
import Bus from "@/utils/bus"
import { TimelineMax } from "gsap"
import Scene from "./scene"
import { getTopScore } from "./tools"

class StartScene extends Scene {
    constructor(game) {
        super(game)
        this.topScore = null;
        return this
    }
    init() {
        const { game } = this;
        this.drawBg()
        this.drawTitle()
        this.drawStartBtn()
        this.drawTopScore()
        return this
    }
    drawBg() {
        const { width, height } = this.game;
        const graphics = new Graphics();
        graphics.beginFill(0x000000, 1);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        this.stage.addChild(graphics)
    }
    drawTitle() {
        const { width } = this.game;
        const txt1 = new Text("dock".toUpperCase(), {
            fontFamily: 'Press Start 2P',
            fontSize: 148,
            leading: 20,
            fill: 0x1596EE,
            align: 'left',
            letterSpacing: 4
        });
        txt1.position.set(120, 80)

        const graphics = new Graphics();
        graphics.beginFill(0xFF5900, 1);
        graphics.drawRect(width * 0.1, 260, width * 0.8, 5);
        graphics.endFill();
        this.stage.addChild(graphics)

        const txt2 = new Text("hunt".toUpperCase(), {
            fontFamily: 'Press Start 2P',
            fontSize: 148,
            leading: 20,
            fill: 0x1596EE,
            align: 'left',
            letterSpacing: 4
        });
        txt2.position.set(490, 300)

        this.stage.addChild(txt1)
        this.stage.addChild(txt2)
    }
    drawStartBtn() {
        const { width } = this.game;
        this.btn = new Text("Click to start the game".toUpperCase(), {
            fontFamily: 'Press Start 2P',
            fontSize: 24,
            leading: 10,
            fill: 0xFF5900,
            align: 'left',
            letterSpacing: 2
        });
        this.btn.anchor.set(0.5, 0.5);
        this.btn.position.set(width / 2, 560)
        this.stage.addChild(this.btn)

        this.btn.interactive = true;
        this.btn.buttonMode = true;
        this.stage.on("pointerdown", e => {
            Bus.$emit("startGame")
        })

        let btnAni = new TimelineMax().fromTo(this.btn, { alpha: 0 }, { alpha: 1, duration: .45, immediateRender: true, ease: "SteppedEase(1)" });
        btnAni.repeat(-1)
        btnAni.yoyo(true);
    }
    update() {
        if (!this.stage.visible) return;
        this.topScore && (this.topScore.text = "top score = ".toUpperCase() + getTopScore())
    }
    drawTopScore(score = 0) {
        const { width, height } = this.game;
        this.topScore = new Text("top score = ".toUpperCase() + score, {
            fontFamily: 'Press Start 2P',
            fontSize: 24,
            leading: 20,
            fill: 0x66DB33,
            align: 'center',
            letterSpacing: 4
        });
        this.topScore.anchor.set(0.5, 0.5);
        this.topScore.position.set(width / 2, height - 60)
        this.stage.addChild(this.topScore)
    }
}

export default StartScene