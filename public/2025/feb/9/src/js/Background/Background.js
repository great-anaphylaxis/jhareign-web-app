import { Canvas } from "../Canvas/Canvas.js";
import { Player } from "../Objects/Player.js";
import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";

export class Background extends Sprite {
    constructor(name, y, z, height, num, speed) {
        super({
            x: 0, y: y, z: SpriteZMap[z],
            width: 1280, height: height, 
            imageName: name, layer: 'screen'
        });

        const player = Player.get();

        this.num = num;
        this.x = num * 1280;
        this.speed = speed;

        Canvas.addObject(this);
    }
}