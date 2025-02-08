import { Game } from "../Game.js";
import { DroppedItem } from "../Inventory/DroppedItem.js";
import { WorldTiles } from "../Objects/Tiles/WorldTiles.js";
import { Rock } from "../Objects/Rock.js";
import { Tree } from "../Objects/Tree.js";
import { Save } from "../Save/Save.js";
import { Chunk } from "./Chunk.js";

export class WorldChunk extends Chunk {
    constructor(num) {
        super(num, "world");

        if (!this.dimension || this.num == undefined) {
            return;
        }

        this.treeFrequency = 15;
        this.rockFrequency = 7;

        if (this.canLoad()) {
            this.load();
        }

        else {
            this.generate();
        }
    }

    generate() {
        console.log(this.num + " " + this.dimension + " chunk generated");
        this.generateGround();

        Save.save();
    }
    
    generateGround() {
        this.groundTile = new WorldTiles(this.left);
    }

    generateTrees() {
        for (let i = 0; i < this.treeFrequency; i++) {
            const x = this.randomPos();

            const tree = new Tree(x);
        }
    }

    generateRocks() {
        for (let i = 0; i < this.rockFrequency; i++) {
            const x = this.randomPos();

            const rock = new Rock(x);
        }
    }
}