import { Viewport } from "../Canvas/Viewport.js";
import { Game } from "../Game.js";
import { Background } from "./Background.js";

export class ParallaxBackground {
    static backgrounds = [];

    static start() {
        ParallaxBackground.setDimensionBackground();
    }

    static setDimensionBackground() {
        const dim = Game.currentDimension;

        ParallaxBackground.removeBackground();

        for (let i = 0; i < 3; i++) {
            Game.loadBackground(dim, i);
        }

    }

    static addBackground(arr) {
        ParallaxBackground.backgrounds.push(arr);
    }

    static removeBackground() {
        if (ParallaxBackground.backgrounds) {
            for (let i = 0; i < ParallaxBackground.backgrounds.length; i++) {
                const bg = ParallaxBackground.backgrounds[i];

                for (let j = 0; j < bg.length; j++) {
                    const instance = bg[j];

                    instance.remove();
                }
            }

            ParallaxBackground.backgrounds = [];
        }
    }

    static update(x) {
        for (let i = 0; i < ParallaxBackground.backgrounds.length; i++) {
            const arr = ParallaxBackground.backgrounds[i];

            for (let j = 0; j < arr.length; j++) {     
                const bg = arr[j];

                const num = x * bg.speed;
                const sign = Math.sign(x);

                bg.x = -sign * ((((sign * num + 1280) % 2560) - 1280) + ((i - 1) * 1280));
            }
        }
    }
}