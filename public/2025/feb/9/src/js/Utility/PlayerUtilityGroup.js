import { Sprite } from "../Sprites/Sprite.js";
import { Canvas } from "../Canvas/Canvas.js";
import { SpriteZMap } from "../Sprites/SpriteZMap.js";
import { SpritePathMap } from "../Sprites/SpritePathMap.js";

export class PlayerUtilityGroup extends Sprite {
    static chosenGroup;
    utilityItems = [];
    
    constructor(name, disabledname, utility) {
        super({
            x: 0, y: 0, z: SpriteZMap['playerutilitygroup'], 
            width: 64, height: 64, 
            layer: 'screen',
            imageName: disabledname
        });
        this.name = name;
        this.disabledname = disabledname;
        this.utility = utility;
        
        Canvas.addObject(this);
    }
    
    toggleVisibility() {
        this.visible = !this.visible;
    }

    show() {
        const chosenGroup = PlayerUtilityGroup.chosenGroup;

        if (chosenGroup) {
            chosenGroup.img = SpritePathMap[chosenGroup.disabledname];

            for (let i = 0; i < chosenGroup.utilityItems.length; i++) {
                const utilityItem = chosenGroup.utilityItems[i];
                
                utilityItem.visible = false;
            }
        }

        PlayerUtilityGroup.chosenGroup = this;
        PlayerUtilityGroup.chosenGroup.img = SpritePathMap[PlayerUtilityGroup.chosenGroup.name];

        for (let i = 0; i < this.utilityItems.length; i++) {
            const utilityItem = this.utilityItems[i];
            
            utilityItem.visible = true;
        }

        
    }
    
    addUtilityItem(item) {
        const length = this.utilityItems.length;
        const x = 740 + ((length % 11) * 48)
        const y = 260 + (Math.floor(length / 11) * 48)
        
        item.x = x;
        item.y = y;
        item.playerUtility = this.playerUtility;
        
        this.utilityItems.push(item);
    }

    mouseup() {
        this.show()
    }
}