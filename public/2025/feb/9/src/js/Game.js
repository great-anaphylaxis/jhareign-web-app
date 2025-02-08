import { Background } from "./Background/Background.js";
import { ParallaxBackground } from "./Background/ParallaxBackground.js";
import { Canvas } from "./Canvas/Canvas.js";
import { GameResizer } from "./Canvas/GameResizer.js";
import { Chunk } from "./Chunk/Chunk.js";
import { WorldChunk } from "./Chunk/WorldChunk.js";
import { DroppedItem } from "./Inventory/DroppedItem.js";
import { Item } from "./Inventory/Item.js";
import { ItemSlot } from "./Inventory/ItemSlot.js";
import { PlayerInventoryButton } from "./Inventory/PlayerInventoryButton.js";
import { Player } from "./Objects/Player.js";
import { Rock } from "./Objects/Rock.js";
import { Tree } from "./Objects/Tree.js";
import { Save } from "./Save/Save.js";
import { PlayerUtilityGroup } from "./Utility/PlayerUtilityGroup.js";
import { PlayerUtilityItem } from "./Utility/PlayerUtilityItem.js";
import { Text } from "./Sprites/Text.js";
import { Scene } from "./Scene.js";

export class Game {
    static data = Save.load(() => Game.start());
    static gravity = 0.6;
    static ground = 500;
    static renderDistance = 2;
    static currentDimension = "world";
    static timeOfDay = 6;


    static start() {
        GameResizer.resizeAlways();
        Canvas.start();

        Game.setEvents();
        Game.load();

        ParallaxBackground.start();
        new Player();

        Game.loadEntities();

        new Scene().scene();
    }


    
    static loadEntities() {
    }

    static saveEntities(data) {
        data.entities = {};
    }

    static loadObjects(data) {
        Tree.load(data.trees);
        Rock.load(data.rocks);
        DroppedItem.load(data.droppedItems);
    }

    static saveObjects(chunkStore, obj) {
        chunkStore.trees = Tree.save(obj.trees);
        chunkStore.rocks = Rock.save(obj.rocks);
        chunkStore.droppedItems = DroppedItem.save(obj.droppedItems);
    }

    static loadDimensions(num, dim) {
        if (dim == "world") {
            new WorldChunk(num);
        }
    }

    static loadBackground(dim, i) {
        if (dim == "world") {
            ParallaxBackground.addBackground([
                new Background("world_background1", -60, "background1", 480, i - 1, 1 / 32),
                new Background("world_background2", 100, "background2", 480, i - 1, 1 / 16),
                new Background("world_background3", 350, "background3", 480, i - 1, 1 / 8),
            ]);
        }
    }

    static initUtility(utility, name) {
        if (name == "player") {
            const main = new PlayerUtilityGroup('maingroup', 'disabledmaingroup');
            const tool = new PlayerUtilityGroup('toolgroup', 'disabledtoolgroup');

            utility.addUtilityGroup(main);
            utility.addUtilityGroup(tool);
        }
    }

    static setEvents() {
        window.addEventListener("error", e => {
            alert(e.message);
        })

        window.addEventListener("keydown", e => {
            if (e.key == "s" && e.ctrlKey) {
                e.preventDefault();
                Save.save();
                alert("Saved")
                console.log(Game.data)
            }

            if (e.key == "a" && e.ctrlKey) {
                e.preventDefault();
                console.log(Game.data, Chunk.chunks)
            }

            if (e.key == "y" && e.ctrlKey) {
                e.preventDefault();
                Chunk.changeDimensions("world")
            }

            if (e.key == "u" && e.ctrlKey) {
                e.preventDefault();
                Chunk.changeDimensions()
            }

            if (e.key == "d" && e.ctrlKey) {
                e.preventDefault();
                let p = Player.get();
                p.hit(Math.floor(p.health / 2));
            }
        });

        window.addEventListener("wheel", e => {
            return;
            const zoom = GameResizer.zoom;
            const wheel = e.deltaY;
            const delta = wheel / 300;
            const setZoom = zoom + delta;

            GameResizer.setZoom(setZoom);
        });

        window.addEventListener("mousedown", e => {
            const player = Player.get();

            if (e.button == 0) {
                if (!player.isDamageCooldown) {
                    if (!player.inventory.visible && !ItemSlot.uiClick && !PlayerInventoryButton.uiClick) {
                        player.attack(0);
                    }
                }
            }

            else if (e.button == 2) {
                if (!player.inventory.visible && !ItemSlot.uiClick && !PlayerInventoryButton.uiClick) {
                    player.attack(2);
                }
            }
        });

        window.addEventListener("contextmenu", e => {
            e.preventDefault();
        })
    }

    static splice(arr, obj) {
        let i = arr.length;

        while (i--) {
            const item = arr[i];

            if (item == obj) { 
                arr.splice(i, 1);
                return;
            } 
        }
    }

    static lerp(x, y, a) {
        return x * (1 - a) + y * a;
    }

    static clamp(a, min=0, max=1) {
        return Math.min(max, Math.max(min, a));
    }

    static invLerp(x, y, a) {
        return Game.clamp((a - x) / (y - x));
    }

    static easeInOutQuint(x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }

    static save() {
        return {
            gravity: Game.gravity,
            ground: Game.ground,
            renderDistance: Game.renderDistance,
            currentDimension: Game.currentDimension,
            timeOfDay: Game.timeOfDay,
        };
    }

    static load() {
        const data = Game.data.game;

        if (!data) {
            return;
        }

        Game.gravity = data.gravity;
        Game.ground = data.ground;
        Game.renderDistance = data.renderDistance;
        Game.currentDimension = data.currentDimension;
        Game.timeOfDay = data.timeOfDay;
    }
}