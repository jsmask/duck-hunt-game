import {Sprite} from "pixi.js"
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