import { Sprite, Text, Graphics, Container } from "pixi.js"
import gsap from "gsap"
export function showToast({
    parent,
    msg = "",
    duration = 2.2,
    x = 0,
    y = 0,
    width = 155,
    height = 70,
    raduis = 6
}) {
    if (!parent) return false;
    let box = new Container()
    let rect = new Graphics()
    box.x = x - width/2;
    box.y = y - height/2;
    rect.lineStyle(2, 0xffffff, 1);
    rect.beginFill(0x000000, 1);
    rect.drawRoundedRect(0, 0, width, height, raduis);
    rect.endFill();
    let txt = new Text(msg.toUpperCase(), {
        fontFamily: 'Press Start 2P',
        fontSize: 24,
        leading: 6,
        fill: 0xffffff,
        align: 'center',
        letterSpacing: 4
    });
    txt.anchor.set(0, 0);
    txt.position.set(10, 10)
    txt.zIndex = 10
    box.addChild(rect)
    box.addChild(txt)
    parent.addChild(box)
    box.zIndex = 99;
    return new Promise((resolve, reject) => {
        let ani = gsap.fromTo(box,
            { alpha: 1 },
            {
                alpha: 0,
                duration: duration,
                ease: "SteppedEase(1)",
                immediateRender: true,
                onUpdate:()=>{
                    if(box.alpha) return;
                    resolve()
                    ani.kill()
                    hideToast(parent, box)
                },
                onComplete: () => {}
            })
    })
}

export function hideToast(parent, box) {
    parent.removeChild(box)
}
