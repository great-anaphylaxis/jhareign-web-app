import { Sprite } from "../Sprites/Sprite.js";
import { Canvas } from "../Canvas/Canvas.js"
import { Game } from "../Game.js";
import { Text } from "../Sprites/Text.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { InventoryItem } from "../Inventory/InventoryItem.js";
import { Player } from "../Objects/Player.js";
import { Chunk } from "../Chunk/Chunk.js";

export class DroppedItem extends Sprite {
    accelerationY = 0.6;
    velocityY = 0;
    floatAllowance = 15;
    collectionAllowed = false;
    
    constructor(name, count, x, y) {
        super({
            x: x, y: y, z: SpriteZMap["droppeditems"],
            width: 48, height: 48,
            imageName: name
        });
        
        this.counter = new Text({
            x: x, y: y, z: SpriteZMap["droppeditemtext"],
            layer: "world",
            color: "yellow", 
            text: count
        });
        this.chunk = Chunk.getChunkByPosition(x, Game.currentDimension);
        this.name = name;
        this.count = count;
        
        this.chunk.add("droppedItems", this);
        Canvas.addObject(this);

        setTimeout(function() {
            this.collectionAllowed = true;
        }.bind(this), 500)
    }
    
    loop() {
        const player = Player.get();
        
        this.velocityY += this.accelerationY;
        
        if (this.y + this.height + this.floatAllowance >= Game.ground) {
            this.y = Game.ground - this.height - this.floatAllowance;
            this.velocityY = 0;
        }
        
        this.y += this.velocityY;
        
        this.counter.x = this.x + 30;
        this.counter.y = this.y + 30;
        
        if (this.collectionAllowed && player.collides(this)) {
            player.inventory.addItem(new InventoryItem(this.name, this.count));
            
            this.counter.remove();
            this.remove();
        }
    }

    removeCall(val) {
        const items = this.chunk.objects.droppedItems;

        if (val == "dimensional") {
            
        }

        else {
            Game.splice(items, this);
        }

        this.counter.remove();
    }

    static save(items) {
        let save = [];

        if (!items) {
            return;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            save.push({
                name: item.name,
                count: item.count,
                x: item.x,
                y: item.y
            });
        }

        return save;
    }

    static load(items) {
        if (!items) {
            return;
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            new DroppedItem(item.name, item.count, item.x, item.y);
        }
    }
}