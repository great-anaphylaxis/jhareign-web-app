import { Canvas } from "../Canvas/Canvas.js";
import { DroppedItem } from "../Inventory/DroppedItem.js";
import { Sprite } from "../Sprites/Sprite.js";
import { Game } from "../Game.js";
import { Player } from "./Player.js";
import { Chunk } from "../Chunk/Chunk.js";
import { ItemSlot } from "../Inventory/ItemSlot.js";

export class Rock extends Sprite {
    constructor(x, health=-1) {
        super({
            x: x, y: Game.ground - 96,
            width: 96, height: 96,
            imageName: "rock"
        });

        this.chunk = Chunk.getChunkByPosition(x, Game.currentDimension);
        
        if (health == -1) {
            this.health = 40;
        }

        else {
            this.health = health;
        }

        this.chunk.add("rocks", this)
        Canvas.addObject(this);

        this.player = Player.get();
        this.player.hitListeners.push(this);
    }

    removeCall(val) {
        const rocks = this.chunk.objects.rocks;
        const hitListeners = this.player.hitListeners;

        if (val == "dimensional") {
            Game.splice(hitListeners, this);
        }

        else {
            Game.splice(hitListeners, this);
            Game.splice(rocks, this);
        }
    }
    
    static save(rocks) {
        let save = [];

        if (!rocks) {
            return;
        }

        for (let i = 0; i < rocks.length; i++) {
            const rock = rocks[i];

            save.push({x: rock.x, health: rock.health});
        }
        
        return save;
    }

    static load(rocks) {
        if (!rocks) {
            return;
        }

        for (let i = 0; i < rocks.length; i++) {
            const rock = rocks[i];

            new Rock(rock.x, rock.health);
        }
    }
}