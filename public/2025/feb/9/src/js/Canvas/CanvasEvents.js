import { Canvas } from "./Canvas.js";
import { Viewport } from "./Viewport.js";

export class CanvasEvents {
    static addCanvasEvents() {
        Canvas.element.addEventListener('mousedown', e => {
            const [pointX, pointY] = Viewport.getScreenToWorldPoints(e);
            const [fixedX, fixedY] = Viewport.getScreenPoints(e);
            const positives = [];

            for (let i = 0; i < Canvas.objects.length; i++) {
                const obj = Canvas.objects[i];
                const onWorldLayer = (obj.layer === "world")
                const onScreenLayer = (obj.layer === "screen")

                if (!obj.visible) {
                    continue;
                }

                if (Viewport.pointOnObject(obj, pointX, pointY) && onWorldLayer) {
                    if (obj.mousedown) {
                        positives.push(obj.mousedown.bind(obj))
                    }
                }

                else if (Viewport.pointOnObject(obj, fixedX, fixedY) && onScreenLayer) {
                    if (obj.mousedown) {
                        positives.push(obj.mousedown.bind(obj))
                    }
                }
            }

            for (let i = 0; i < positives.length; i++) {
                const func = positives[i];

                func(e)
            }
        })

        Canvas.element.addEventListener('mouseup', e => {
            const [pointX, pointY] = Viewport.getScreenToWorldPoints(e);
            const [fixedX, fixedY] = Viewport.getScreenPoints(e);

            // this solves the crazy bug
            const positives = [];

            for (let i = 0; i < Canvas.objects.length; i++) {
                const obj = Canvas.objects[i];
                const onWorldLayer = (obj.layer === "world")
                const onScreenLayer = (obj.layer === "screen")

                if (!obj.visible) {
                    continue;
                }
                
                if (Viewport.pointOnObject(obj, pointX, pointY) && onWorldLayer) {
                    if (obj.mouseup) {
                        positives.push(obj.mouseup.bind(obj))
                    }
                }

                else if (Viewport.pointOnObject(obj, fixedX, fixedY) && onScreenLayer) {
                    if (obj.mouseup) {
                        positives.push(obj.mouseup.bind(obj))
                    }
                }
            }

            for (let i = 0; i < positives.length; i++) {
                const func = positives[i];

                func(e)
            }
        })
    }

    static addEventsToObject(obj) {
        if (obj.keydown) {
            window.addEventListener('keydown', e => {
                if (obj.visible) {
                    obj.keydown(e)
                }
            });
        }

        if (obj.keyup) {
            window.addEventListener('keyup', e => {
                if (obj.visible) {
                    obj.keyup(e);
                }
            });
        }

        if (obj.mousemove) {
            Canvas.element.addEventListener('mousemove', e => {
                if (obj.visible) {
                    obj.mousemove(e);
                }
            });
        }
    }
}