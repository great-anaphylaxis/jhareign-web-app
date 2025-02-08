import { Canvas } from "../../Canvas/Canvas.js";
import { Game } from "../../Game.js";
import { Sprite } from "../../Sprites/Sprite.js";

export class WorldTiles extends Sprite {
    constructor(x) {
        super({
            width: 4096, height: 640, 
            x: x, y: Game.ground, 
            imageName: "worldtiles"});

        Canvas.addObject(this)
    }
}