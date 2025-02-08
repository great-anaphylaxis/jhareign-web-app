import { Player } from "../Objects/Player.js";

export class PlayerUtilityManager {
    utilities = {

    };
    pastKey;

    constructor(utilities, player) {
        this.player = player;
        this.utilities = utilities;

        for (let i in this.utilities) {
            const utility = this.utilities[i];

            utility.toggleVisibility();
        }
    }

    getUtility(key) {
        return this.utilities[key];
    }

    toggle(key) {
        const utility = this.utilities[key];

        if (this.player.inventory.visible) {
            if (this.pastKey && this.pastKey !== key) {
                this.player.inventory.toggleVisibility();
                this.utilities[this.pastKey].toggleVisibility();
            }
        }

        this.player.inventory.toggleVisibility();
        utility.toggleVisibility();

        this.pastKey = key;
    }
}