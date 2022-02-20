import { Sprite, Text, Graphics, Container } from "pixi.js"
import { getTextures } from "./textures"

import { showToast } from "./toast"

export {
    showToast
}

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

export function getImageUrl(name, ext = "png") {
    return new URL(`/src/assets/${name}.${ext}`, import.meta.url).href
}

export function createAim({
    x,
    y,
    // handleClick
}) {
    let aim = createSprite({
        name: "aim",
        x,
        y,
        height: 36,
        width: 36,
        anchor: 0.5
    })
    aim.zIndex = 100000;
    return aim
}