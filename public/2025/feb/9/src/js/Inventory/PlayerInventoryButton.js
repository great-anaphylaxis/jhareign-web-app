import { Canvas } from "../Canvas/Canvas.js";
import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";

export class PlayerInventoryButton extends Sprite {
    static uiClick = false;

    constructor(x, y, player) {
        super({
            width: 64, 
            height: 64, 
            x: x, y: y, z: SpriteZMap['itemslots'], 
            imageName: 'playerinventorybutton', 
            layer: 'screen'
        });
        this.r = "1"

        this.player = player;

        Canvas.addObject(this)
    }

    mousedown() {
        return;
        PlayerInventoryButton.uiClick = true;
    }

    mouseup() {
        return;
        this.player.toggleVisibility();
        PlayerInventoryButton.uiClick = false;
    }

    keyup(e) {
        return;
        if (e.key == "Tab") {
            this.player.toggleVisibility();
        } 
    }
}