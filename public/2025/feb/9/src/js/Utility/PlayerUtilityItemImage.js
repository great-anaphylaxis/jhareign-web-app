import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { Canvas } from "../Canvas/Canvas.js";

export class PlayerUtilityItemImage extends Sprite {
    constructor() {
        super({
            x: 740, y: 50, z: SpriteZMap['playerutilityitemimage'],
            width: 96, height: 96,
            layer: 'screen', visible: false,
        });
        
        Canvas.addObject(this);
    }
}