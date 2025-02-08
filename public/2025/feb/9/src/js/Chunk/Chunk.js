import { ParallaxBackground } from "../Background/ParallaxBackground.js";
import { Game } from "../Game.js";
import { Save } from "../Save/Save.js";

export class Chunk {
    static chunks = {};
    objects = {

    };

    constructor(num, dimension) {
        if (Chunk.isRendered(num, dimension)) {
            return;
        }

        if (!Chunk.chunks[dimension]) {
            Chunk.chunks[dimension] = {};
        }

        Chunk.chunks[dimension]["c" + num] = this;

        this.num = num;
        this.dimension = dimension;
        this.left = (num * 4096) - 2048;
        this.right = (num * 4096) + 2048;
        this.isHidden = false;
    }

    canLoad() {
        const chunks = Game.data.chunks;

        if (chunks && chunks[this.dimension] && chunks[this.dimension]["c" + this.num]) {
            return true;
        }

        return false;
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    randomPos() {
        return this.random(this.left, this.right);
    }

    add(name, obj) {
        const store = this.objects[name];

        if (!store) {
            this.objects[name] = [];
        }

        this.objects[name].push(obj)
    }

    load() {
        console.log(this.num + " " + this.dimension + " chunk loaded")
        
        const data = Game.data.chunks[this.dimension]["c" + this.num];

        this.generateGround();

        Game.loadObjects(data);
    }

    static getChunkByPosition(x, dimension) {
        const num = Chunk.getChunkNumByPosition(x);
        const chunk = Chunk.getChunk(num, dimension);
        
        if (chunk) {
            return chunk;
        }
    }

    static getChunkNumByPosition(x) {
        return Math.floor((x + 2048) / 4096);
    }

    static getChunk(num, dimension) {
        if (Chunk.chunks[dimension]) {
            return Chunk.chunks[dimension]["c" + num];
        }
    }

    static save() {
        let save = Game.data.chunks || {};

        for (let i in Chunk.chunks) {
            const dimension = Chunk.chunks[i];
            const store = {};

            for (let j in dimension) {
                const chunk = dimension[j];
                const chunkStore = {};
                const obj = chunk.objects;
    
                chunkStore.num = chunk.num;

                Game.saveObjects(chunkStore, obj);
    
                store["c" + chunk.num] = chunkStore;
            }

            save[i] = store;
        }

        return save;
    }

    static isRendered(num, dimension) {
        const chunk = Chunk.getChunk(num, dimension);

        if (chunk && !chunk.isHidden) {
            return true;
        }

        else {
            return false;
        }
    }

    static remove(num, dimension) {
        const chunk = Chunk.getChunk(num, dimension);

        for (let i in chunk.objects) {
            const objects = chunk.objects[i];
            const store = [];

            for (let j = 0; j < objects.length; j++) {
                const obj = objects[j];

                store.push(obj)
            }

            for (let j = 0; j < store.length; j++) {
                store[j].remove(true, "dimensional");
            }
        }

        chunk.groundTile.remove();
        chunk.isHidden = true;
    }


    static changeDimensions(dimension) {
        const current = Game.currentDimension;

        if (dimension == current) {
            return;
        }
        
        for (let i in Chunk.chunks[current]) {
            const chunk = Chunk.chunks[current][i];

            Chunk.remove(chunk.num, current);
        }

        Game.currentDimension = dimension;

        ParallaxBackground.setDimensionBackground();
        GlobalLight.changeGlobalLight();
        Save.save();
        
        Game.loadEntities();

    }
}