import { Canvas } from "./Canvas/Canvas.js";
import { Tree } from "./Objects/Tree.js";
import { Sprite } from "./Sprites/Sprite.js";
import { Text } from "./Sprites/Text.js";

export class Scene {
    tx = 0;
    
    t(x, y, text) {
        let txt = new Text({
            x: x + this.tx, y: y, z: 1, layer: "world", font: `128px VT323`, text: text, outline: true,
        });

        this.tx = x + this.tx;

        return txt;
    }

    i(x, y, img) {
        let sprite = new Sprite({
            x: x + this.tx, y: y, z: 1,
            width: 256, height: 124,
            layer: 'world', imageName: img
        });

        this.tx = x + this.tx;

        Canvas.addObject(sprite);
    }

    scene() {
        let t = this.t.bind(this);
        let i = this.i.bind(this);

        t(0, 350, "Move [Right] to proceed");

        t(550, 350, "The principle of overload");
        t(0, 400, "Presented by: Group 4");

        t(550, 325, "Definition:");
        t(0, 350, "The principle of overload is a practice that");
        t(0, 375, "involves gradually increasing the stress on");
        t(0, 400, "the body to improve performance");

        t(850, 325, "The principle of overload works by increasing");
        t(0, 350, "the external load on your body, which forces");
        t(0, 375, "it to adapt and improve. This can help you build");
        t(0, 400, "strength, endurance, and cardiovascular fitness.");

        i(750, 325, "i1");

        t(550, 325, "Pros:")
        t(0, 350, "- Improve performance");
        t(0, 375, "- Build endurance");
        t(0, 400, "- increase muscle");

        i(550, 325, "i2");

        t(550, 325, "Cons:")
        t(0, 350, "- Risk to injury");
        t(0, 375, "- Over training");
        t(0, 400, "- Soreness of muscles");
        t(0, 425, "- Burn out and fatigue");

        i(550, 325, "i3");

        this.tx += 550
        new Tree(this.tx, 100);

        this.tx += 300
        new Tree(this.tx, 90);

        this.tx += 300
        new Tree(this.tx, 90);

        t(550, 325, "Examples:")

        t(550, 325, "A weightlifter who has been bench-pressing 175 pounds")
        t(0, 350, "for a month can apply the overload principle by");
        t(0, 375, "increasing the weight or number of repetitions");

        i(850, 325, "i4");

        t(550, 325, "A cyclist who rides for 10 hours one week can")
        t(0, 350, "increase their ride time to 10.5 hours the next week,");
        t(0, 375, "and then 11 hours the following week");

        i(850, 325, "i5");

        t(600, 325, "The end. Thank you for listening");

        this.tx += 500;

        new Tree(this.tx, 10000000000000);
    }
}

