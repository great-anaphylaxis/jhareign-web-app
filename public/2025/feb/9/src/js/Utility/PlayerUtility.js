import { Canvas } from "../Canvas/Canvas.js";
import { Sprite } from "../Sprites/Sprite.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { PlayerUtilityGroup } from "../Utility/PlayerUtilityGroup.js";
import { PlayerUtilityItem } from "../Utility/PlayerUtilityItem.js";
import { Text } from "../Sprites/Text.js";
import { PlayerUtilityItemImage } from "../Utility/PlayerUtilityItemImage.js";
import { PlayerUtilityButton } from "../Utility/PlayerUtilityButton.js";
import { PlayerUtilityRequiredItem } from "../Utility/PlayerUtilityRequiredItem.js";
import { Item } from "../Inventory/Item.js";
import { Game } from "../Game.js";

export class PlayerUtility extends Sprite {
    utilityGroups = {};
    requiredItemsHint = [];
    
    constructor(player, name) {
        super({
            x: 731, y: 25, z: SpriteZMap['playerutility'], 
            width: 547, height: 548, 
            layer: 'screen',
            imageName: 'playerutility',
        });
        
        this.player = player;
        
        this.title = new Text({
            x: 860, y: 50, z: SpriteZMap['playerutilitytitle'],
            layer: 'screen', font: '35px monospace',
            text: ''
        });
        
        this.itemImage = new PlayerUtilityItemImage();
        this.button = new PlayerUtilityButton(this, this.player.inventory);
        this.createRequiredItemsHint()
        
        Canvas.addObject(this);
        
        Game.initUtility(this, name);
    }

    toggleVisibility() {
        const chosenGroup = PlayerUtilityGroup.chosenGroup;

        this.visible = !this.visible;
        this.title.visible = false;
        this.itemImage.visible = false;
        this.button.visible = false;
        
        this.title.text = '';

        if (chosenGroup) {
            for (let i = 0; i < chosenGroup.utilityItems.length; i++) {
                const utilityItem = chosenGroup.utilityItems[i];
                
                utilityItem.visible = false;
            }
        }
        
        for (let i = 0; i < this.requiredItemsHint.length; i++) {
            const requiredItem = this.requiredItemsHint[i];
            
            requiredItem.hide();
        }
        
        for (const key in this.utilityGroups) {
            const utilityGroup = this.utilityGroups[key];
            
            utilityGroup.toggleVisibility();
        }
        
        if (this.visible) {
            this.utilityGroups["maingroup"].show();
        }
    }
    
    addUtilityGroup(group) {
        const name = group.name;
        const length = Object.keys(this.utilityGroups).length;
        const x = 740 + (length * 72)
        
        group.x = x;
        group.y = 175;
        group.playerUtility = this;
        
        this.utilityGroups[name] = group;
    }
    
    createRequiredItemsHint() {
        for (let i = 0; i < 9; i++) {
            const x = 860 + ((i % 3) * 75);
            const y = 90 + (Math.floor(i / 3) * 25)
            const requiredItem = new PlayerUtilityRequiredItem(x, y);
            
            this.requiredItemsHint.push(requiredItem)
        }
    }

    updateRequiredItemHints() {
        if (!this.visible) {
            return;
        }

        if (this.item) {
            const requiredItems = this.item.requiredItems;

            for (let i = 0; i < requiredItems.length; i++) {
                const requiredItem = requiredItems[i];
                const hint = this.requiredItemsHint[i];
                const available = this.player.inventory.howManyItems(requiredItem);

                hint.show(requiredItem, available);
            }
        }
    }
}
