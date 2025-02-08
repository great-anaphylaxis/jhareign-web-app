import { Game } from "../Game.js";
import { Player } from "../Objects/Player.js";
import { Inventory } from "./Inventory.js";
import { InventoryItem } from "./InventoryItem.js";
import { ItemSlot } from "./ItemSlot.js";
import { PlayerInventoryButton } from "./PlayerInventoryButton.js";

export class PlayerInventory extends Inventory {
    slots = [];
    visible = true;

    constructor(player) {
        super();

        this.player = player;
        this.playerInventory = this;
        this.createSlots();
        this.createPlayerInventoryButton();
    }

    createSlots() {
        for (let i = 0; i < 7; i++) {
            const itemSlot = new ItemSlot(410 + (i * 64), 600);
            this.addSlot(itemSlot);
        }

        for (let i = 0; i < 7; i++) {
            const itemSlot = new ItemSlot(100 + (i * 64), 100);
            this.addSlot(itemSlot);

            this.slots.push(itemSlot);
        }
    }

    createPlayerInventoryButton() {
        const button = new PlayerInventoryButton(858, 600, this.player);
    }

    toggleVisibility() {
        this.visible = !this.visible;

        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];

            slot.visible = this.visible;

            if (slot.item) {
                slot.item.counter.visible = this.visible;
                slot.item.visible = this.visible;
            }
        }
    }

    updateFunction() {
        if (this.player.utility) {
            const utility = this.player.utility;

            utility.updateRequiredItemHints();
        }
    }

    static save() {
        const save = [];
        const inventory = Player.player.inventory.inventory; // bro

        for (let i = 0; i < inventory.length; i++) {
            const slot = inventory[i];
            const item = slot.item;

            if (item) {
                save.push({name: item.name, count: item.count, position: i});
            }
        }

        return save;
    }

    static load() {
        const inventory = Game.data.playerInventory;

        if (!inventory) {
            return;
        }

        const playerInventory = Player.player.inventory.inventory;

        for (let i = 0; i < inventory.length; i++) {
            const item = inventory[i];
            const slot = playerInventory[item.position];

            slot.addItem(new InventoryItem(item.name, item.count));
        }

        Player.player.inventory.toggleVisibility();
        Player.player.inventory.toggleVisibility();
    }
}