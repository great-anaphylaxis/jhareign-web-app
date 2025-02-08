import { Canvas } from "./Canvas.js";
import { Viewport } from "./Viewport.js";

export class GameResizer {
    static zoom = 0.1;
    static adjust = GameResizer.zoomAdjust(GameResizer.zoom);
    static aspectRatioWidth = 1280 * GameResizer.adjust;
    static aspectRatioHeight = 720 * GameResizer.adjust;

    static resizeAlways() {
        this.resize();
        window.addEventListener("resize", () => this.resize());
    }

    static resize() {
        const ratio = this.aspectRatioWidth / this.aspectRatioHeight;

        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;

        if (width / ratio > height) {
            width = height * ratio;
        }

        else {
            height = width / ratio;
        }

        Canvas.element.width = width;
        Canvas.element.height = height;

        this.scale(width, height);
        Canvas.noImageSmoothing();
        
        Canvas.draw();
    }

    static scale(width, height) {
        const scaleX = width / this.aspectRatioWidth;
        const scaleY = height / this.aspectRatioHeight;
        
        Canvas.canvas.scale(scaleX, scaleY);
    }

    static setZoom(num) {
        const zoom = num;
        const adjust = GameResizer.zoomAdjust(zoom);

        GameResizer.zoom = zoom;
        GameResizer.adjust = adjust;
        GameResizer.aspectRatioWidth = 1280 * adjust;
        GameResizer.aspectRatioHeight = 720 * adjust;

        GameResizer.resize();
    }

    static zoomAdjust(zoom) {
        let adjust;

        if (zoom >= 1) {
            adjust = zoom;
        }

        else if (zoom < 1) {
            adjust = Math.abs(1 / (zoom - 2));
        }

        return adjust
    }
}