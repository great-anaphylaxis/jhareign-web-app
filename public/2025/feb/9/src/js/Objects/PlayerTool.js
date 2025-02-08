import { Canvas } from "../Canvas/Canvas.js";
import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";

export class PlayerTool extends Sprite {
    static allowed = [
        "stone_pickaxe", "stone_axe", "stone_sword"
    ];

    constructor(name, player) {
        super({
            width: 64, height: 64,
            x: 0, y: 0, z: SpriteZMap["playertool"],
            imageName: name, origin: "bottom", visible: false,
        });

        this.player = player;
        this.x = this.player.x;
        this.y = this.player.y;

        Canvas.addObject(this);
    }

    isAllowed(name) {
        if (PlayerTool.allowed.includes(name)) {
            return true;
        }

        return false
    }
}