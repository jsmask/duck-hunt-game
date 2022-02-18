import { Sprite } from "pixi.js"
import { getTextures } from "./textures"


export function createSprite({ name, width = 100, height = 100, x = 0, y = 0, zIndex = 0, anchor = 0 }) {
    let sprite = new Sprite(getTextures(name));
    sprite.x = x;
    sprite.y = y;
    sprite.width = width;
    sprite.height = height;
    sprite.zIndex = zIndex;
    sprite.anchor.set(anchor)
    return sprite;
}

export function getImageUrl(name) {
    return new URL(name, import.meta.url).href
}

export function addAim({
    x,
    y,
    stage, 
    handleClick
}) {
    let aim = createSprite({
        name: "aim",
        x,
        y,
        height: 36,
        width: 36,
        anchor: 0.5
    })
    aim.zIndex = 100;
    stage.addChild(aim)
    stage.on("pointerdown", e => {
        handleClick && handleClick()
    })
    stage.on("pointermove", e => {
        aim.position.copyFrom(e.data.global)
    })
}