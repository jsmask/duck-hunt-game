import { createSprite } from "./tools"
import { Text, Graphics, Container } from "pixi.js";
import assets from "./assets"
import Bus from "@/utils/bus"
import { addAim } from "./tools"
import { playFire } from "./audio"

function checkScore(score) {
    return (Math.min(999999, score) + "").padStart(6, "0")
}

export default class MainScene {
    constructor(game) {
        this.game = game;
        this.stage = new Container();
        this.stageContainer = new Container();
        this.uiContainer = new Container();
        this.stage.addChild(this.stageContainer);
        this.stage.addChild(this.uiContainer);
        this.stageContainer.sortableChildren = true
        this.stage.interactive = true;
        this.stage.buttonMode = true;
        this.hitList = [];
        this.timeCount = 30;
        this.bulletNum = 3;
        this.score = 0;
        return this;
    }
    init() {
        const { game,stage, handleClick } = this;
        this.hitList = [...Array(10).keys()].map(() => false)
        this.timeCount = 30;
        this.bulletNum = 3;
        this.drawBackground()
        this.drawFireBox()
        this.drawDuckBox()
        this.drawScoreBox()
        addAim({
            x: game.width,
            y: game.height,
            stage,
            handleClick: handleClick.bind(this)
        });
        this.onStart();
    }
    update(delta) {
        if (!this.stage.visible) return;
        const { score = 0 } = this;
        this.scoreTxt && (this.scoreTxt.text = checkScore(score))
        this.drawDuckNum();
        this.drawTimeCount();
        this.drawBulletNum()
    }
    handleClick() {
        this.bulletNum -= 1;
        if (this.bulletNum < 0) return this.bulletNum = 3;
        this.score += 500;
        this.hitList[0] = true;
        playFire()
    }
    onStart() {

    }
    show() {
        this.stage.visible = true
    }
    hide() {
        this.stage.visible = false
    }
    drawBackground() {
        const { width, height } = this.game;
        let bg = new Graphics();
        bg.beginFill(0x3cbcfc, 1);
        bg.drawRect(0, 0, width, height);
        bg.endFill();
        bg.zIndex = 0;
        this.stageContainer.addChild(bg)

        let sprite = createSprite({
            name: "stage",
            width,
            height,
            x: 0,
            y: 0
        })
        sprite.zIndex = 9
        this.stageContainer.addChild(sprite)
    }
    drawScore(parent) {
        const { score } = this;
        this.scoreTxt = new Text(checkScore(score), {
            fontFamily: 'Press Start 2P',
            fontSize: 24,
            leading: 20,
            fill: 'white',
            align: 'left',
            letterSpacing: 4
        });
        this.scoreTxt.position.set(20, 10);

        const scoreTxt2 = new Text("score".toUpperCase(), {
            fontFamily: 'Press Start 2P',
            fontSize: 23,
            leading: 20,
            fill: 'white',
            align: 'left',
            letterSpacing: 4
        });
        scoreTxt2.position.set(52, 42)

        parent.addChild(this.scoreTxt);
        parent.addChild(scoreTxt2);
    }
    drawFireBox() {
        const box = new Container()
        box.x = 230;
        box.y = 670;
        const graphics = new Graphics();
        graphics.lineStyle(2, 0x66DB33, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawRoundedRect(0, 0, 110, 75, 10);
        graphics.endFill();
        box.addChild(graphics)

        const txt = new Text("shot".toUpperCase(), {
            fontFamily: 'Press Start 2P',
            fontSize: 20,
            leading: 20,
            fill: 0x3cbcfc,
            align: 'left',
            letterSpacing: 1
        });
        txt.position.set(15, 45)
        box.addChild(txt)

        this.bulletNumBox = new Container();
        this.drawBulletNum()
        box.addChild(this.bulletNumBox)
        this.uiContainer.addChild(box)
    }
    drawBulletNum() {
        const { bulletNum } = this;
        if (!this.bulletNumBox) return
        this.bulletNumBox.removeChildren(0, this.bulletNumBox.children.length)

        for (let i = 0; i < bulletNum; i++) {
            let bullet = createSprite({
                name: "bullet",
                width: 20,
                height: 20,
                x: 15 + i * 30,
                y: 12
            })
            this.bulletNumBox.addChild(bullet)
        }
    }
    drawDuckNum() {
        const { hitList } = this;
        if (!this.duckNumBox) return
        this.duckNumBox.removeChildren(0, this.duckNumBox.children.length)
        for (let i = 0; i < 10; i++) {
            let bird = createSprite({
                name: hitList[i] ? "bird1" : "bird0",
                width: 20,
                height: 20,
                x: 100 + i * 25,
                y: 12
            })
            this.duckNumBox.addChild(bird)
        }
    }
    drawTimeCount() {
        const { timeCount } = this;
        if (!this.timeCountBox) return
        this.timeCountBox.removeChildren(0, this.timeCountBox.children.length)

        for (let i = 0; i < 30; i++) {
            let tb = new Graphics();
            tb.beginFill(0x3cbcfc, 1);
            tb.drawRoundedRect(100 + i * 8.2, 45, 5, 15, 1);
            tb.endFill();
            this.timeCountBox.addChild(tb)
        }
    }
    drawDuckBox() {
        const box = new Container()
        box.x = 380;
        box.y = 670;
        const graphics = new Graphics();
        graphics.lineStyle(2, 0x66DB33, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawRoundedRect(0, 0, 360, 75, 10);
        graphics.endFill();
        box.addChild(graphics)
        const txt = new Text("hit".toUpperCase(), {
            fontFamily: 'Press Start 2P',
            fontSize: 22,
            leading: 20,
            fill: 0x66DB33,
            align: 'left',
            letterSpacing: 4
        });
        txt.position.set(12, 12)
        this.duckNumBox = new Container();
        this.timeCountBox = new Container();
        this.drawDuckNum();
        this.drawTimeCount();
        box.addChild(txt)
        box.addChild(this.duckNumBox)
        box.addChild(this.timeCountBox)
        this.uiContainer.addChild(box)
    }
    drawScoreBox() {
        const box = new Container()
        box.x = 780;
        box.y = 670;
        const graphics = new Graphics();
        graphics.lineStyle(2, 0x66DB33, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawRoundedRect(0, 0, 200, 75, 10);
        graphics.endFill();
        box.addChild(graphics)
        this.drawScore(box)
        this.uiContainer.addChild(box)
    }
}