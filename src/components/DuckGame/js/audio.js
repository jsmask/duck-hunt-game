import assets from "./assets"

let fireVoice = new Audio(assets["fire"])
let bgmVoice = new Audio(assets["bgm"])
let dogStart = new Audio(assets["dog_start"])
let dogLaugh = new Audio(assets["dog_laugh"])


export function playFire() {
    fireVoice.volume = 1
    fireVoice.currentTime = 0
    fireVoice.play()
    return fireVoice
}

export function playDogStart(){
    dogStart.volume = 1
    dogStart.currentTime = 0
    dogStart.play()
}

export function playDogLaugh(){
    dogLaugh.volume = 1
    dogLaugh.currentTime = 0
    dogLaugh.play()
}

export function pauseDogLaugh(){
    dogLaugh.pause();
}

export function playBgm() {
    bgmVoice.volume = 1
    bgmVoice.play()
}
