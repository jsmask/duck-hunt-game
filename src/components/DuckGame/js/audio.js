import assets from "./assets"

let fireVoice = new Audio(assets["fire"])
let bgmVoice = new Audio(assets["bgm"])

export function playFire() {
    fireVoice.currentTime = 0
    fireVoice.play()
}

export function playBgm() {
    bgmVoice.volume = 0.6
    bgmVoice.loop = true
    bgmVoice.play()
}