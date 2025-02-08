import { Canvas } from "../Canvas/Canvas.js";
import { Viewport } from "../Canvas/Viewport.js";
import { PlayerInventory } from "../Inventory/PlayerInventory.js";
import { PlayerUtility } from "../Utility/PlayerUtility.js";
import { Game } from "../Game.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { Sprite } from "../Sprites/Sprite.js";
import { GameResizer } from "../Canvas/GameResizer.js";
import { Chunk } from "../Chunk/Chunk.js";
import { HealthInfoBar } from "../InfoBar/HealthInfoBar.js";
import { ParallaxBackground } from "../Background/ParallaxBackground.js";
import { ItemSlot } from "../Inventory/ItemSlot.js";
import { PlayerTool } from "./PlayerTool.js";
import { SpritePathMap } from "../Sprites/SpritePathMap.js";
import { PlayerUtilityManager } from "../Utility/PlayerUtilityManager.js";

export class Player extends Sprite {
    left = false;
    right = false;
    velocityY = 0;
    accelerationY = 0.6;
    allowJump = false;
    jumped = false;
    inventory = new PlayerInventory(this);
    utilityManager = new PlayerUtilityManager({
        player: new PlayerUtility(this, "player")
    }, this);
    utility = this.utilityManager.getUtility("player");
    direction = "right";

    player;

    isDamageCooldown = false;

    damageCooldown = 500;

    damage = 4; // 4
    jumpStrength = 15.5;
    speed = 7; // 7
    maxHealth = 100;
    health = 0;

    hitListeners = [];
    healthInfoBar = new HealthInfoBar(10, 10, this.health, this.maxHealth);

    enablePlayerTool = false;

    cooldownAnimations = ["playerattack", "playertool"];

    constructor() {
        super({
            width: 64, height: 64, 
            x: 100, y: 300, z: SpriteZMap['player']
        });
        this.inventory.toggleVisibility();
        
        Player.player = this;
        
        Player.load();
        PlayerInventory.load();

        this.playerTool = new PlayerTool("stone_pickaxe", this)

        Canvas.addObject(this);
    }

    static get() {
        return Player.player;
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    collides(obj) {
        if (
            obj.x < this.x + this.width &&
            obj.x + obj.width > this.x &&
            obj.y < this.y + this.height &&
            obj.y + obj.height > this.y
        ) {
            return true;
        }

        return false;
    }

    loop() {
        if (this.left && !this.isPlayingAnimation(...this.cooldownAnimations)) {
            this.x += -this.speed;

            this.playAnimation('playerwalking', 100);
        }
    
        if (this.right && !this.isPlayingAnimation(...this.cooldownAnimations)) {
            this.x += this.speed;
            
            this.playAnimation('playerwalking', 100);
        }

        if (!this.animationPlayed) {
            this.playAnimation("playeridle", 1000);
        }
        
        this.velocityY += this.accelerationY;
        
        if (this.y + this.height >= Game.ground && !this.jumped) {
            this.y = Game.ground - this.height;
            this.velocityY = 0;
            
            this.allowJump = true;
        }
    
        if (this.jumped) {
            this.jumped = false;
    
            this.velocityY = -this.jumpStrength;
        }
    
        this.y += this.velocityY;
        if (GameResizer.adjust <= 1.45) {
            Viewport.setCenter(this.x + (this.width / 2), this.y + (this.height / 4));
        }
        
        else {
            Viewport.setCenter(this.x + (this.width / 2), this.y + 640 - (GameResizer.aspectRatioHeight / 2));
        }

        this.playerTool.x = this.x;
        this.playerTool.y = this.y;

        ParallaxBackground.update(this.x);

        // chunk
        this.chunk = Chunk.getChunkByPosition(this.x, Game.currentDimension);

        if (this.chunk) {
            const totalChunks = Game.renderDistance * 2 + 1;
            const visibleChunks = {};

            for (let i = 0; i < totalChunks; i++) {
                const num = this.chunk.num - Game.renderDistance + i;
                
                this.newChunkByDimension(num);
                visibleChunks["c" + num] = true;
            }

            for (let i in Chunk.chunks[Game.currentDimension]) {
                const chunk = Chunk.chunks[Game.currentDimension][i];
                const num = chunk.num;
                const supposedToBeVisible = visibleChunks["c" + num];
                const isRendered = Chunk.isRendered(chunk.num, Game.currentDimension);

                if (!supposedToBeVisible && isRendered) {
                    Chunk.remove(chunk.num, Game.currentDimension);
                }
            }
        }

        else {
            this.chunk = this.newChunkByDimension(Chunk.getChunkNumByPosition(this.x));
        }

        // tool

        if (this.enablePlayerTool) {
            let angle = 0.07;

            if (!this.playerTool.visible) {
                this.playerTool.visible = true;
            }

            if (this.direction == "left") {
                if (!this.playerTool.flipped) {
                    this.playerTool.flipped = true;
                }
                
                angle = -angle;
                this.playerTool.angle -= angle;
            }

            else if (this.direction == "right") {
                if (this.playerTool.flipped) {
                    this.playerTool.flipped = false;
                }

                this.playerTool.angle += angle;
            }

            if (-this.playerTool.angle <= -(Math.PI / 2) || this.playerTool.angle >= Math.PI / 2) {
                this.enablePlayerTool = false;
            }

        }
    }

    newChunkByDimension(num) {
        const dim = Game.currentDimension;

        Game.loadDimensions(num, dim);
    }

    playerToolFinishAnimation() {
        this.playerTool.angle = 0;
        this.playerTool.visible = false;
    }

    attack(type=0) {
        this.hit(-1 - (this.random(1, 2)));
        const slot = ItemSlot.activeSlot;
        let cooldown = this.damageCooldown;

        for (let i = 0; i < this.hitListeners.length; i++) {
            const hit = this.hitListeners[i];

            if (type == 0) {
                const hitListener = hit.playerHitListener;

                if (hitListener) {
                    const callback = hitListener.bind(hit);

                    callback(this)
                }
            }

            else if (type == 2) {
                const interact = hit.playerInteract;

                if (interact) {
                    const callback2 = interact.bind(hit);

                    callback2(this);
                }
            }
        }

        if (type == 2) {
            return;
        }

        if (slot) {
            const item = slot.item || {name: -1};

            if (this.playerTool.isAllowed(item.name)) {
                this.playerTool.img = SpritePathMap[item.name] || SpritePathMap["unknown"]
                this.playAnimation('playertool', 50, false, this.playerToolFinishAnimation);
                this.enablePlayerTool = true;

                cooldown = item.information.toolCooldown;
            }

            else {
                this.playAnimation("playerattack", 30, false);
            }
        }

        else {
            this.playAnimation("playerattack", 30, false);
        }

        this.isDamageCooldown = true;
        setTimeout(function() {
            this.isDamageCooldown = false;
        }.bind(this), cooldown);
    }

    keydown(e) {
        let playingAnimations = this.isPlayingAnimation(...this.cooldownAnimations);
        let inInventory = this.inventory.visible;

        if (e.ctrlKey) {
            return;
        }
        
        if (e.key.toLowerCase() == "a" && !playingAnimations && !inInventory) {
            this.left = true;

            this.direction = "left";
            this.flipped = true;
        }
    
        if (e.key.toLowerCase() == "d" && !playingAnimations && !inInventory) {
            this.right = true;

            this.direction = "right";
            this.flipped = false;
        }
    
        if (e.key == " " && this.allowJump) {
            this.jumped = true
            this.allowJump = false;
        }
    }

    keyup(e) {
        if (e.key.toLowerCase() == "a") {
            this.left = false;

            if (this.right) {
                this.direction = "right";
                this.flipped = false;
            }

            if (!this.isPlayingAnimation(...this.cooldownAnimations)) {
                this.playAnimation('playeridle', 1000);
            }
        }
    
        if (e.key.toLowerCase() == "d") {
            this.right = false;

            if (this.left) {
                this.direction = "left";
                this.flipped = true;
            }

            if (!this.isPlayingAnimation(...this.cooldownAnimations)) {
                this.playAnimation('playeridle', 1000);
            }
        }

        if (e.key == "u") {
            new Furnace(this.x);
        }
    }

    toggleVisibility() {
        this.utilityManager.toggle("player");
    }

    hit(damage) {
        this.health -= damage;
        this.filter = "brightness(0) invert(1)";

        setTimeout(function() {
            this.filter = "none";
        }.bind(this), 100);

        if (this.health <= 0) {
            alert("dead");
        }

        this.healthInfoBar.update(this.maxHealth, this.health);
    }

    static save() {
        const player = Player.player;

        return {
            x: player.x, 
            y: player.y, 
            damage: player.damage, 
            jumpStrength: player.jumpStrength, 
            speed: player.speed,
            health: player.health,
            maxHealth: player.maxHealth,
        };
    }

    static load() {
        const data = Game.data.player;
        const player = Player.player;

        if (!data) {
            return;
        }

        player.x = data.x;
        player.y = data.y;
        player.damage = data.damage;
        player.jumpStrength = data.jumpStrength;
        player.speed = data.speed;
        player.health = data.health;
        player.maxHealth = data.maxHealth;

        player.healthInfoBar.update(data.maxHealth, data.health);
    }
}
