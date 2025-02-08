import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { Canvas } from "../Canvas/Canvas.js";
import { SpritePathMap } from "../Sprites/SpritePathMap.js";
import { Text } from "../Sprites/Text.js";

export class PlayerUtilityRequiredItem extends Sprite {
    constructor(x, y) {
        super({
            x: x, y: y, z: SpriteZMap["playerutilityrequireditem"],
            width: 24, height: 24,
            layer: 'screen', visible: false,
        });
        
        this.counter = new Text({
            x: x + 30, y: y + 4, z: SpriteZMap["playerutilityrequireditem"],
            layer: 'screen', visible: false,
            text: '0/0', font: '20px monospace'
        })
        
        Canvas.addObject(this);
    }
    
    show(requiredItem, available) {
        const isEnough = (available >= requiredItem.count);
        const text = `${available}/${requiredItem.count}`;
        
        this.visible = true;
        this.counter.visible = true;
        
        this.img = SpritePathMap[requiredItem.name]
        this.counter.text = text;
        
        if (isEnough) {
            this.counter.color = "lightgreen";
        }
        else {
            this.counter.color = "red";
        }
    }
    
    hide() {
        this.visible = false;
        this.counter.visible = false;
    }
}