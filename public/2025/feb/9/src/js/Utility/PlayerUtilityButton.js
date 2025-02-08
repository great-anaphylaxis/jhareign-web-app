import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { Canvas } from "../Canvas/Canvas.js";
import { InventoryItem } from "../Inventory/InventoryItem.js";

export class PlayerUtilityButton extends Sprite {
    constructor(playerUtility, inventory) {
        super({
            x: 1150, y: 100, z: SpriteZMap["playerutilitybutton"],
            width: 96, height: 48,
            layer: 'screen', imageName: 'playerutilitybutton'
        });
        
        this.playerUtility = playerUtility;
        this.inventory = inventory;
       
        Canvas.addObject(this);
    }
    
    mouseup() {
        const utilityItem = this.playerUtility.item;
        const requiredItems = utilityItem.requiredItems;
        
        for (let i = 0; i < requiredItems.length; i++) {
            const requiredItem = requiredItems[i];
            
            if (this.inventory.howManyItems(requiredItem) >= requiredItem.count) {
                continue;
            }
            
            else {
                return;
            }
            
        }
        
        for (let i = 0; i < requiredItems.length; i++) {
            const requiredItem = requiredItems[i];
            
            this.inventory.removeItems(requiredItem);
        }
        
        this.inventory.addItem(new InventoryItem(utilityItem.name, utilityItem.count));
        
        this.playerUtility.updateRequiredItemHints();
    }
}