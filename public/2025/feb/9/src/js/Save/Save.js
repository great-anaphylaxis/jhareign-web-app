import { Chunk } from "../Chunk/Chunk.js";
import { Game } from "../Game.js";
import { PlayerInventory } from "../Inventory/PlayerInventory.js";
import { Player } from "../Objects/Player.js";

export class Save {
    static db;
    static upgrade = false;

    static connect() {
        const req = indexedDB.open("savefile", 1);

        req.onerror = e => {
            throw new Error(e)
        }

        req.onupgradeneeded = e => {
            const db = e.target.result;
            Save.db = db;

            const hasObjectStore = (!db.objectStoreNames.contains("save"));

            if (hasObjectStore) {
                const store = db.createObjectStore("save", { autoIncrement: true });

                Save.upgrade = true;
            }
        }

        return req;
    }

    static save() {
        return;
        const req = Save.connect();

        Save.prepareSave();

        req.onsuccess = e => {
            const db = e.target.result;
            Save.db = db;

            if (Save.upgrade) {
                Save.init();
            }

            Save.get(cursor => {
                const data = Game.data;
                const json = JSON.stringify(data);

                cursor.value.save = json;

                cursor.update(cursor.value)
            });
        }
    }

    static prepareSave() {
        const data = Game.data;

        data.game = Game.save();
        
        data.player = Player.save();
        data.playerInventory = PlayerInventory.save();
        data.chunks = Chunk.save();

        Game.saveEntities(data);
    }

    static load(callback) {
        const req = Save.connect();

        req.onsuccess = e => {
            const db = e.target.result;
            Save.db = db;

            if (Save.upgrade) {
                Save.init();
            }

            Save.get(cursor => {
                const val = cursor.value.save || "{}";
                const json = JSON.parse(val);

                Game.data = json;
                
                callback();
            });
        }
    }

    static init() {
        const db = Save.db;
        const trans = db.transaction("save", "readwrite");
        const store = trans.objectStore("save");

        store.add({save: "{}"});

        Save.upgrade = false;
    }

    static get(callback) {
        const db = Save.db;
        const trans = db.transaction("save", "readwrite");
        const store = trans.objectStore("save");
        const cReq = store.openCursor();

        cReq.onsuccess = e => {
            const cursor = e.target.result;

            if (cursor) {
                callback(cursor)
            }
        }
    }
}