import stage from "../../../assets/stage.png"
export const assets = {
    stage
}

let textures = {}

export function setTextures(key, value) {
    textures[key] = value;
}

export function getTextures(key) {
    return textures[key]
}