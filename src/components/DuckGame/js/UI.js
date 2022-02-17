import { createSprite } from "./tools"
import { Text, Graphics, Container } from "pixi.js";


// function drawBackground(game) {
//     return createSprite({
//         name: "stage",
//         width: game.width,
//         height: game.height,
//         x: 0,
//         y: 0
//     })
// }

// function drawScore(game, parent) {
//     const { score = 0 } = game;
//     const scoreStr = (score + "").padStart(6, "0")
//     scoreTxt1 = new Text(scoreStr, {
//         fontFamily: 'Press Start 2P',
//         fontSize: 24,
//         leading: 20,
//         fill: 'white',
//         align: 'left',
//         letterSpacing: 4
//     });
//     scoreTxt1.position.set(20, 10);

//     const scoreTxt2 = new Text("score".toUpperCase(), {
//         fontFamily: 'Press Start 2P',
//         fontSize: 23,
//         leading: 20,
//         fill: 'white',
//         align: 'left',
//         letterSpacing: 4
//     });
//     scoreTxt2.position.set(52, 42)

//     parent.addChild(scoreTxt1);
//     parent.addChild(scoreTxt2);
// }

// function drawFireBox(game) {
//     const box = new Container()
//     box.x = 220;
//     box.y = 670;
//     const graphics = new Graphics();
//     graphics.lineStyle(2, 0x33DB66, 1);
//     graphics.beginFill(0x000000, 1);
//     graphics.drawRoundedRect(0, 0, 100, 75, 10);
//     graphics.endFill();
//     box.addChild(graphics)
//     return box
// }

// function drawDuckBox(game) {
//     const box = new Container()
//     box.x = 380;
//     box.y = 670;
//     const graphics = new Graphics();
//     graphics.lineStyle(2, 0x33DB66, 1);
//     graphics.beginFill(0x000000, 1);
//     graphics.drawRoundedRect(0, 0, 320, 75, 10);
//     graphics.endFill();
//     box.addChild(graphics)
//     return box
// }

// function drawScoreBox(game) {
//     const box = new Container()
//     box.x = 750;
//     box.y = 670;
//     const graphics = new Graphics();
//     graphics.lineStyle(2, 0x33DB66, 1);
//     graphics.beginFill(0x000000, 1);
//     graphics.drawRoundedRect(0, 0, 200, 75, 10);
//     graphics.endFill();
//     box.addChild(graphics)

//     setTimeout(() => {
//         drawScore(game, box)
//     })
//     return box
// }

function checkScore(score){
    return (Math.min(999999,score) + "").padStart(6, "0")
}

export default class UI {
    constructor(game) {
        this.game = game;
    }
    init() {
        const { game } = this;
        const { stageContainer, uiContainer } = game
        stageContainer.addChild(this.drawBackground(game))
        uiContainer.addChild(this.drawFireBox(game))
        uiContainer.addChild(this.drawDuckBox(game))
        uiContainer.addChild(this.drawScoreBox(game))
    }
    update() {
        const { score = 0 } = this.game;
        this.scoreTxt && (this.scoreTxt.text = checkScore(score))
    }
    drawBackground() {
        const { game } = this;
        return createSprite({
            name: "stage",
            width: game.width,
            height: game.height,
            x: 0,
            y: 0
        })
    }
    drawScore(parent) {
        const { game } = this;
        const { score = 0 } = game;
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
        box.x = 220;
        box.y = 670;
        const graphics = new Graphics();
        graphics.lineStyle(2, 0x33DB66, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawRoundedRect(0, 0, 100, 75, 10);
        graphics.endFill();
        box.addChild(graphics)
        return box
    }

    drawDuckBox() {
        const box = new Container()
        box.x = 380;
        box.y = 670;
        const graphics = new Graphics();
        graphics.lineStyle(2, 0x33DB66, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawRoundedRect(0, 0, 320, 75, 10);
        graphics.endFill();
        box.addChild(graphics)
        return box
    }
    drawScoreBox() {
        const box = new Container()
        box.x = 750;
        box.y = 670;
        const graphics = new Graphics();
        graphics.lineStyle(2, 0x33DB66, 1);
        graphics.beginFill(0x000000, 1);
        graphics.drawRoundedRect(0, 0, 200, 75, 10);
        graphics.endFill();
        box.addChild(graphics)

        setTimeout(() => {
            this.drawScore(box)
        })
        return box
    }
}