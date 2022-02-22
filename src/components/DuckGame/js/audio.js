import assets from "./assets"

let fireVoice = new Audio(assets["fire"])
let bgmVoice = new Audio(assets["bgm"])
let dogStart = new Audio(assets["dog_start"])
let dogLaugh = new Audio(assets["dog_laugh"])
let caught_duck = new Audio(assets["caught_duck"])
let perfect = new Audio(assets["perfect"])
let game_win = new Audio(assets["game_win"])
let game_over = new Audio(assets["game_over"])


export function playGameWin() {
    game_win.volume = 1
    game_win.play()
}

export function playGameOver() {
    game_over.volume = 1
    game_over.play()
}

export class DuckSound{
    constructor(){
        this.audio = new Audio(assets["duck_sound"])
        this.down = new Audio(assets["duck_down"])
        this.down.playbackRate = 2.5
    }
    playDown(){
        this.down.play()
    }
    pauseDown(){
        this.down.pause()
    }
    play(){
        this.audio.play()
    }
    pause(){
        this.audio.pause()
    }
}

export function playPerfect(){
    perfect.volume = 1
    perfect.currentTime = 0
    perfect.play()
}

export function playCaughtDuck(){
    caught_duck.volume = 1
    caught_duck.currentTime = 0
    caught_duck.play()
}

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
