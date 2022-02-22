import { createSprite, wait } from "./tools"
import { Text, Graphics, Container } from "pixi.js";
import Bus from "@/utils/bus"
import { showToast, random, setTopScore } from "./tools"
import { playFire, playBgm, playPerfect,playGameWin,playGameOver } from "./audio"
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
        this.stageContainer.width = game.width;
        this.stageContainer.height = game.height;
        this.dog = new Dog(this.stageContainer)
        this.bg = new Graphics();
        this.round = 1;
        this.hitList = [];
        this.duckList = []
        this.bulletNum = 3;
        this.score = 0;
        this.count = 10;
        this.createCount = 2;
        this.totalCount = 0
        this.maxRound = 3;
        this.hitCount = 0;
        this.timeCount = this.maxTimeCount;
        this.isStart = false
        this.isOver = false
        this.isFlyaway = false
        this.maxTimeCount = 360;
        this.stageContainer.on("pointerdown", this.handleClick.bind(this))
        return this;
    }
    init() {
        this.duckList = []
        this.score = 0;
        this.totalCount = 0
        this.hitList = [...Array(this.count).keys()].map(() => false)
        this.bulletNum = 3;
        this.round = 1;
        this.hitCount = 0;
        this.isStart = false
        this.isOver = false
        this.isFlyaway = false
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

        this.duckList && this.duckList.forEach(duck => {
            duck.move(delta)
        })
        if (!this.isStart || this.hitCount >= this.createCount) return;
        this.timeCount -= delta
        if (this.timeCount < 0) {
            this.isStart = false;
            this.timeCount = this.maxTimeCount;
            this.isFlyaway = true;
            this.duckFlyAway();
            this.endRound()
        }
    }
    duckFlyAway() {
        this.duckList && this.duckList.forEach(duck => {
            duck.isFlyaway = true;
            duck.vx *= 2.2;
            duck.vy = -12;
        })
    }
    async handleClick(e) {
        if (!this.isStart) return;
        this.bulletNum -= 1;
        playFire()
        Bus.$emit("sendBullet", {
            e: e.data.global,
            callback: async duck => {
                this.score += duck.score;
                this.hitCount += 1;

                if (this.hitList[duck.dIndex]) {
                    this.hitList[duck.dIndex + 1] = true;
                }else {
                    this.hitList[duck.dIndex] = true;
                }

                if (this.hitCount >= this.createCount && this.isStart) {
                    await this.computeRound()
                }
            }
        })
        if (this.bulletNum <= 0 && this.isStart) {
            await this.duckFlyAway();
            await this.computeRound()
        };
    }
    async computeRound() {
        this.isStart = false;
        this.timeCount = this.maxTimeCount;
        await wait(.5)
        await this.endRound()
    }
    async onStart() {
        await this.beginGame()
    }
    async createDuck() {
        this.clearDuck();
        const { createCount, game, totalCount, count } = this;
        this.bulletNum = 3;
        this.totalCount += createCount;
        for (let i = 0; i < createCount; i++) {
            const duck = new Duck({
                dIndex: totalCount / count * 10,
                x: random(80, game.width - 120),
                y: random(50, game.height - 220),
                speed: 3 + this.round,
                stage: this.stageContainer,
                direction: [-1, 1][~~(Math.random() * 2)]
            })
            this.duckList.push(duck)
        }
    }
    async beginGame() {
        playBgm()
        await this.dog.start();
        await this.nextRound();
    }
    async flyAway() {
        const { game, stage } = this;
        this.isStart = false;
        this.drawBackground(0xffaaaa)
        await showToast({
            game,
            msg: "fly away",
            parent: stage,
            x: game.width / 2,
            y: game.height / 2,
            duration: 2.5,
            width: 240,
            height: 40,
        })
    }
    async laugh() {
        await this.dog.laugh();
    }
    clearDuck() {
        this.drawBackground();
        this.isStart = false;
        this.timeCount = this.maxTimeCount;
        this.hitCount = 0;
        this.duckList.forEach(duck => {
            duck && duck.destroy()
        })
        this.duckList.length = 0
    }
    async endRound() {
        this.isStart = false;
        if (this.isFlyaway) {
            this.isFlyaway = false;
            await this.flyAway();
        }
        this.timeCount = this.maxTimeCount;
        if (this.hitCount >= 2) {
            await this.dog.caughtDuck(2)
        }
        else if (this.hitCount == 1) {
            await this.dog.caughtDuck(1)
        }
        else {
            await this.laugh();
        }
        
        if (this.totalCount < this.count) {
            await this.createDuck()
            this.isStart = true;
        }
        else {
            this.round += 1;
            let hitNum = this.hitList.filter(h => h).length;
            if (hitNum === this.count) {
                await this.onPerfect()
            }
            setTopScore(this.score)
            if(hitNum/this.count*100<60){
                return await this.gameOver()
            }
            if (this.round > this.maxRound) {
                await this.gameWin()
            } else {
                await this.nextRound()
            }
        }
    }
    async gameWin(){
        const { game, stage } = this;
        playGameWin()
        await showToast({
            game,
            msg: "you win!!!",
            parent: stage,
            x: game.width / 2,
            y: game.height / 2,
            duration: 4,
            width: 286,
            height: 40,
        })
        this.hide();
        game.startScene.show();
    }
    async gameOver() {
        const { game, stage } = this;
        playGameOver()
        await showToast({
            game,
            msg: "game over",
            parent: stage,
            x: game.width / 2,
            y: game.height / 2,
            duration: 4,
            width: 270,
            height: 40,
        })
        this.hide();
        game.startScene.show();
    }
    async onPerfect(num = 10000) {
        const { game, stage } = this;
        playPerfect()
        await showToast({
            game,
            msg: "perfect!!\n" + num,
            parent: stage,
            duration: 3,
            x: game.width / 2,
            y: game.height / 2,
            width: 262,
            height: 70,
        })
        this.score += num;
    }
    async nextRound() {
        const { game, stage } = this
        this.hitList = [...Array(this.count).keys()].map(() => false)
        this.bulletNum = 3;
        this.totalCount = 0;
        this.hitCount = 0;
        this.isFlyaway = false
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
        await this.createDuck()
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