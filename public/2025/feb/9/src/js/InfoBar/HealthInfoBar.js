import { Canvas } from "../Canvas/Canvas.js";
import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { Text } from "../Sprites/Text.js";

export class HealthInfoBar {
    constructor(x, y, maxValue, value) {
        this.background = new Sprite({
            x: x, y: y, z: SpriteZMap["infobarbackground"],
            width: 512, height: 64,
            layer: 'screen', imageName: 'healthinfobar_background'
        });

        this.bar = new Sprite({
            x: x, y: y, z: SpriteZMap["infobars"],
            width: 512, height: 64,
            layer: 'screen', imageName: 'healthinfobar_bar'
        });
        this.text = new Text({
            x: x + 20, y: y + 5, z: SpriteZMap["infobartext"],
            layer: 'screen', font: '54px VT323', color: 'white'
        })

        this.value = value;
        this.maxValue = maxValue;
        this.update(this.value, this.maxValue);

        Canvas.addObject(this.background);
        Canvas.addObject(this.bar);
    }

    update(maxValue, value) {
        this.maxValue = maxValue;
        this.value = value;

        const percent = this.value / this.maxValue;
        const width = this.clamp(this.lerp(0, this.background.width, percent), 0, this.lerp(0, this.background.width, 1));
        
        this.bar.width = width;

        this.updateText();
    }

    updateText() {
        const text = `Strength: ${this.value}`;

        // text
        this.text.text = text;
    }

    lerp(x, y, value) {
        return x * (1 - value) + y * value;
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max)
    }
}