import { createSprite, wait } from "./tools"
import { Text, Graphics, Container } from "pixi.js";
import assets from "./assets"
import Bus from "@/utils/bus"
import { showToast } from "./tools"
import { playFire, playBgm } from "./audio"
import Scene from "./scene"
import Dog from "./dog"
import Duck from "./duck"


function checkScore(score) {
    return (Math.min(999999, score) + "").padStart(6, "0")
}

export default class MainScene extends Scene {
    constructor(game) {
        super(game)
        this.stageContainer = new Container();
        this.uiContainer = new Container();
        this.stage.addChild(this.stageContainer);
        this.stage.addChild(this.uiContainer);
        this.stageContainer.sortableChildren = true
        this.stageContainer.interactive = true;
        this.dog = new Dog(this.stageContainer)
        this.bg = new Graphics();
        this.round = 1;
        this.hitList = [];
        this.bulletNum = 3;
        this.score = 0;
        this.count = 10;
        this.createCount = 2;
        this.totalCount = 0
        this.maxRound = 3;
        this.hitCount = 0;
        this.isStart = false
        this.stageContainer.on("pointerdown", this.handleClick.bind(this))
        return this;
    }
    init() {
        this.duckList = []
        this.score = 0;
        this.createCount = 2;
        this.totalCount = 0
        this.hitList = [...Array(this.count).keys()].map(() => false)
        this.bulletNum = 3;
        this.round = 1;
        this.hitCount = 0;
        this.stageContainer.removeChildren(0, this.stageContainer.children.length)
        this.uiContainer.removeChildren(0, this.uiContainer.children.length)
        this.stageContainer.addChild(this.drawBackground())
        this.stageContainer.addChild(this.drawBgStage())
        this.drawFireBox()
        this.drawDuckBox()
        this.drawScoreBox()
        this.onStart();
        return this
    }
    update(delta) {
        if (!this.stage.visible) return;
        const { score = 0 } = this;
        this.scoreTxt && (this.scoreTxt.text = checkScore(score))
        this.drawDuckNum();
        this.drawTimeCount();
        this.drawBulletNum()
    }
    async handleClick(e) {
        if (!this.isStart) return;
        console.log(e.data.global)
        this.bulletNum -= 1;
        playFire()
        Bus.$emit("sendBullet", {
            e: e.data.global,
            callback:async duck => {
                this.score += duck.score;
                this.hitCount += 1;
                this.hitList = this.hitList.map(item => item = true);
                if(this.hitCount>=this.createCount){
                    await this.computeRound()
                }
            }
        })
        if (this.bulletNum <= 0) {
            await this.computeRound()
        };
    }
    async computeRound(){
        this.isStart = false;
        await wait(.5)
        await this.endRound()
    }
    async onStart() {
        await this.beginGame()

        await this.createDuck()

        // await this.endRound();

        // await this.nextRound();

    }
    async createDuck() {
        const { createCount,game } = this;
        this.isStart = true;
        this.bulletNum = 3;
        for (let i = 0; i < createCount; i++) {
            const duck = new Duck({
                x: game.width*Math.random(),
                y: (game.height-220)*Math.random(),
                stage: this.stageContainer
            })
            this.duckList.push(duck)
        }
       
    }
    async beginGame() {
        playBgm()
        await this.dog.start();
        await this.nextRound();
        console.log('onStart')
    }
    async flyAway() {
        const { game, stage } = this;
        this.drawBackground(0xffaaaa)
        await showToast({
            game, msg: "fly away",
            parent: stage,
            x: game.width / 2,
            y: game.height / 2,
            duration: 2.5,
            width: 240,
            height: 40,
        })
    }
    async laugh() {
        this.drawBackground();
        await this.dog.laugh();
    }
    async endRound() {
        this.isStart = false;
        if (this.hitCount >= 2) {
            await this.dog.caughtDuck(2)
        }
        else if (this.hitCount == 1) {
            await this.dog.caughtDuck(1)
        }
        else {
            await this.flyAway();
            await this.laugh();
        }
        this.hitCount = 0;
        this.totalCount += 2;
        this.duckList.forEach(duck=>{
            duck && duck.destroy()
        })
        this.duckList.length = 0
        if (this.totalCount <= this.count) {
            await this.createDuck()
        } else {
            this.round += 1;
            if (this.round > this.maxRound) {
                await this.gameOver()
                return
            } else {
                await this.nextRound()
            }
        }
    }
    async gameOver() {
        const { game, stage } = this;
        await showToast({
            game,
            msg: "game over",
            parent: stage,
            x: game.width / 2,
            y: game.height / 2,
            duration: 2.5,
            width: 270,
            height: 40,
        })
        // await this.dog.laugh();

        this.hide();
        game.startScene.show();
    }
    async onPerfect(num = 10000) {
        const { game, stage } = this;
        await showToast({
            game,
            msg: "perfect!!\n" + num,
            parent: stage,
            duration: 2.5,
            x: game.width / 2,
            y: game.height / 2,
            width: 262,
            height: 70,
        })
        this.score += num;
    }
    async nextRound() {
        const { game, stage } = this
        if (this.hitList.filter(h => h).length === this.count) {
            await this.onPerfect()
        }
        this.hitList = [...Array(this.count).keys()].map(() => false)
        this.bulletNum = 3;
        this.totalCount = 0;
        this.hitCount = 0;
        await showToast({
            game,
            msg: "round\n" + this.round,
            parent: stage,
            duration: 2.5,
            x: game.width / 2,
            y: game.height / 2,
            width: 152,
            height: 70,
        })
        this.isStart = true
    }
    drawBackground(color = 0x3cbcfc) {
        const { bg, game } = this;
        const { width, height } = game;
        bg.beginFill(color, 1);
        bg.drawRect(0, 0, width, height);
        bg.endFill();
        bg.zIndex = 0;
        return bg
    }
    drawBgStage() {
        const { game } = this;
        const { width, height } = game;
        let sprite = createSprite({
            name: "stage",
            width,
            height,
            x: 0,
            y: 0
        })
        sprite.zIndex = 9
        return sprite;
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
        const { hitList, count } = this;
        if (!this.duckNumBox) return
        this.duckNumBox.removeChildren(0, this.duckNumBox.children.length)
        for (let i = 0; i < count; i++) {
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