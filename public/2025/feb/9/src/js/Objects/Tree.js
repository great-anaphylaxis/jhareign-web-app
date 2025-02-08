import { Canvas } from "../Canvas/Canvas.js";
import { DroppedItem } from "../Inventory/DroppedItem.js";
import { Sprite } from "../Sprites/Sprite.js";
import { Game } from "../Game.js";
import { Player } from "./Player.js";
import { Chunk } from "../Chunk/Chunk.js";
import { ItemSlot } from "../Inventory/ItemSlot.js";

export class Tree extends Sprite {
    constructor(x, health=-1) {
        super({
            x: x, y: Game.ground - 164,
            width: 96, height: 164,
            imageName: "tree"
        });
        
        if (health == -1) {
            this.health = 35;
        }

        else {
            this.health = health;
        }
        Canvas.addObject(this);

        this.player = Player.get();
        this.player.hitListeners.push(this);
    }

    removeCall(val) {
        const trees = this.chunk.objects.trees;
        const hitListeners = this.player.hitListeners;

        if (val == "dimensional") {
            Game.splice(hitListeners, this);
        }

        else {
            Game.splice(hitListeners, this);
            Game.splice(trees, this);
        }

    }

    playerHitListener(player) {
        const slot = ItemSlot.activeSlot;
        let item;
        let tool;

        if (slot) {
            item = slot.item;
        }

        if (item) {
            tool = item.information.toolType;
        }

        if (player.collides(this)) {
            let damage = player.health

            if (tool) {
                damage = item.information.toolDamage;
            }

            this.health -= damage;
            this.filter = "brightness(0) invert(1)";

            player.hit(-10 - (player.random(1, 5)));

            setTimeout(function() {
                this.filter = "none";
            }.bind(this), 100);

            if (this.health <= 0) {
                this.remove();
            }
        }
    }

    removeCall(val) {
        const hitListeners = this.player.hitListeners;

        if (val == "dimensional") {
            Game.splice(hitListeners, this);
        }

        else {
            Game.splice(hitListeners, this);
        }

    }

    static save(trees) {
        let save = [];

        if (!trees) {
            return;
        }
        
        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            
            save.push({x: tree.x, health: tree.health});
        }

        return save;
    }

    static load(trees) {
        if (!trees) {
            return;
        }

        for (let i = 0; i < trees.length; i++) {
            const tree = trees[i];
            
            new Tree(tree.x, tree.health);
        }
    }
}