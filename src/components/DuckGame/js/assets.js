import { getImageUrl } from "./tools"

const audioList = {
    fire:getImageUrl("fire","mp3"),
    bgm:getImageUrl("bgm","mp3"),
    dog_start:getImageUrl("dog_start","mp3"),
    dog_laugh:getImageUrl("dog_laugh","mp3"),
    win:getImageUrl("win","mp3"),
}

const bird0 = getImageUrl("bird0");
const bird1 = getImageUrl("bird1");
const bullet = getImageUrl("bullet");
const press = getImageUrl("Press Start 2P","woff2")
const aim = getImageUrl("aim");
const stage = getImageUrl("stage");

const dogList = {}
for (let i = 0; i < 12; i++) {
    dogList["dog"+i] =  getImageUrl("dog"+ i)
}


export default {
    press,
    stage,
    aim,
    bird0,
    bird1,
    bullet,
    ...audioList,
    ...dogList
}