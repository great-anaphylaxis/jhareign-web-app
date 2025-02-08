import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { Canvas } from "../Canvas/Canvas.js"
import { SpritePathMap } from "../Sprites/SpritePathMap.js";
import { ItemDefaults } from "../Inventory/ItemDefaults.js";

export class PlayerUtilityItem extends Sprite {
    constructor(name, count, requiredItems) {
        super({
            x: 0, y: 0, z: SpriteZMap["playerutilityitems"],
            width: 48, height: 48, visible: false,
            imageName: name, layer: "screen"
        });
   
        this.name = name;
        this.requiredItems = requiredItems;
        this.count = count;
        this.information = ItemDefaults[this.name];
        
        Canvas.addObject(this);
    }
    
    mouseup() {
        const utility = this.playerUtility;
        
        utility.title.visible = true;
        utility.itemImage.visible = true;
        utility.button.visible = true;
        
        for (let i = 0; i < this.requiredItems.length; i++) {
            const requiredItem = this.requiredItems[i];
            const hint = utility.requiredItemsHint[i];
            const available = utility.player.inventory.howManyItems(requiredItem);
            
            hint.show(requiredItem, available);
        }
        
        utility.title.text = this.information.displayName;
        utility.itemImage.img = SpritePathMap[this.name];
        
        utility.item = this;
    }
}
