import { Sprite, Text, Graphics, Container } from "pixi.js"
import { getTextures } from "./textures"

import { showToast, showScore } from "./toast"

export {
    showToast,
    showScore
}

export function getTopScore() {
    return window.localStorage.getItem("topScore") || 0;
}

export function setTopScore(score = 0) {
    let top_score = Math.max(score, getTopScore());
    window.localStorage.setItem("topScore", top_score)
}

export function random(lower, upper) {
    lower = +lower || 0
    upper = +upper || 0
    return Math.random() * (upper - lower) + lower;
}

export function wait(t = 1) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, t * 1000)
    })
}

export function createSprite({ name, x = 0, y = 0, scale = 1, width, height, zIndex = 0, anchor = 0 }) {
    let texture = getTextures(name);
    let sprite = new Sprite(texture);
    sprite.x = x;
    sprite.y = y;
    sprite.width = (width || texture.width) * scale;
    sprite.height = (height || texture.height) * scale;
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