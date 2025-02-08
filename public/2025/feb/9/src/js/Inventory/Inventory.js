import { Item } from "./Item.js";

export class Inventory {
    inventory = [];
    
    addSlot(slot) {
        this.inventory.push(slot);
        this.updateFunction();
    }

    addItem(newItem) {
        let emptySlot;

        for (let i = 0; i < this.inventory.length; i++) {
            const slot = this.inventory[i];
            const item = slot.item;

            if (!item && !emptySlot) {
                emptySlot = slot;
                
                continue;
            }

            else if (item && Item.areTheSameItems(item, newItem)) {
                const total = item.count + newItem.count;

                item.setCount(total);
                
                newItem.counter.remove();
                newItem.remove();
                
                if (newItem.slot) {
                    newItem.slot.item = undefined;
                    newItem.slot = undefined;
                }
                
                break;
            }

            else {
                continue;
            }
        }

        // no way this works
        if (emptySlot) {
            const slot = emptySlot;

            slot.item = newItem;
            newItem.slot = slot;

            slot.positionItem(slot.item);
        }

        this.updateFunction();
    }
    
    howManyItems(itemChecking) {
        let count = 0;
        
        for (let i = 0; i < this.inventory.length; i++) {
            const slot = this.inventory[i];
            const item = slot.item;
            
            if (item && Item.areTheSameItems(item, itemChecking)) {
                count += item.count;
                continue;
            }
        }

        return count;
    }
    
    removeItems(itemRemoving) {
        let count = itemRemoving.count;
        if (this.howManyItems(itemRemoving) >= count) {
            for (let i = 0; i < this.inventory.length; i++) {
                const slot = this.inventory[i];
                const item = slot.item;
                
                if (item && Item.areTheSameItems(item, itemRemoving)) {
                    count -= item.count;
                    
                    if (count < 0) {
                        item.setCount(-count);
                        break;
                    }
                    
                    else if (count == 0) {
                        item.counter.remove();
                        item.remove();
                        
                        item.slot.item = undefined;
                        item.slot = undefined;
                        break;
                    }
                    
                    else if (count > 0) {
                        item.counter.remove();
                        item.remove();
                        
                        item.slot.item = undefined;
                        item.slot = undefined;
                        continue;
                    }
                        
                }
            }
            
            this.updateFunction();
            return true;
        }
        
        else {
            this.updateFunction();
            return false;
        }
    }

}