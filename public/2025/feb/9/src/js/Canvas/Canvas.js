import { CanvasEvents } from "./CanvasEvents.js";
import { GameResizer } from "./GameResizer.js";

export class Canvas {
    static element = document.getElementById('game');
    static canvas = this.element.getContext('2d', {
        willReadFrequently: true,
    });
    static objects = [];

    static start() {
        this.drawLoop();
        this.noImageSmoothing();
        CanvasEvents.addCanvasEvents();
    }

    static draw(loop=true) {
        this.canvas.clearRect(0, 0, GameResizer.aspectRatioWidth, GameResizer.aspectRatioHeight);

        this.sortObjects();

        const objectSnapshot = [...this.objects]; // this solves the bug ok

        for (let i = 0; i < objectSnapshot.length; i++) {
            const obj = objectSnapshot[i];

            if (!obj.visible) {
                continue;
            }

            obj.draw();
            
            if (obj.loop && loop) {
                obj.loop();
            }
        }
    }

    static sortObjects() {
        this.objects.sort((a, b) => a.z - b.z);
    }
    
    static drawLoop() {
        this.draw();
        window.requestAnimationFrame(() => this.drawLoop());
    }

    static addObject(obj) {
        CanvasEvents.addEventsToObject(obj)

        // from push to unshift, HOW DID IT FIX THE BUG?
        this.objects.unshift(obj);
    }

    static noImageSmoothing() {
        this.canvas.imageSmoothingEnabled = false;
    }
}