import { Canvas } from "../Canvas/Canvas.js";
import { GameResizer } from "../Canvas/GameResizer.js";
import { Viewport } from "../Canvas/Viewport.js";
import { Game } from "../Game.js";

export class Text {
    constructor(params) {
        this.text = params.text || '';
        this.font = params.font || '20px monospace';
        this.color = params.color || 'black';
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.layer = params.layer || "screen";
        this.visible = params.visible || true;
        this.angle = params.angle || 0;
        this.origin = params.origin || "center"; // or bottom
        this.outline = params.outline || false;

        Canvas.addObject(this);
    }

    draw() {
        let finalX = this.x;
        let finalY = this.y;
        let finalFont;

        const scale = GameResizer.adjust;
        const canvasWidth = Canvas.element.width / GameResizer.aspectRatioWidth;
        const canvasHeight = Canvas.element.height / GameResizer.aspectRatioHeight;

        if (this.layer === "world") {
            finalX = finalX - Viewport.x;
            finalY = finalY - Viewport.y;
        }

        else if (this.layer === "screen") {
            finalX *= scale;
            finalY *= scale;

            const params = this.font.split(" ");
            const px = parseInt(params[0]) * Math.abs(scale);

            params[0] = px + "px";
            finalFont = params.join(" ");
        }

        Canvas.canvas.font = finalFont;
        Canvas.canvas.textBaseline = "top";
        Canvas.canvas.fillStyle = this.color;

        let dim = Canvas.canvas.measureText(this.text);
        let finalWidth = dim.width;
        let finalHeight = dim.fontBoundingBoxAscent + dim.fontBoundingBoxDescent;

        if (this.layer === "screen") {
            finalWidth *= scale;
            finalHeight *= scale;
        }

        let scaleX = Canvas.element.width / GameResizer.aspectRatioWidth;
        let scaleY = Canvas.element.height / GameResizer.aspectRatioHeight

        finalX = (finalX + finalWidth / 2) * scaleX;
        finalY = (finalY + finalHeight / 2) * scaleY;

        Canvas.canvas.setTransform(canvasWidth, 0, 0, canvasHeight, finalX, finalY);
        Canvas.canvas.rotate(this.angle);
        
        if (this.origin == "center") {
            finalX = -finalWidth / 2;
            finalY = -finalHeight / 2;
        }

        else if (this.origin == "bottom") {
            finalX = -finalWidth / 2;
            finalY = -finalHeight;
        }

        Canvas.canvas.filter = "none";

        if (this.outline) {
            Canvas.canvas.strokeStyle = 'black';
            Canvas.canvas.lineWidth = 8;
            Canvas.canvas.strokeText(this.text, finalX, finalY);
            Canvas.canvas.fillStyle = 'white';
            Canvas.canvas.fillText(this.text, finalX, finalY);
        }

        else {
            Canvas.canvas.fillText(this.text, finalX, finalY);
        }

        Canvas.canvas.setTransform(1, 0, 0, 1, 0, 0)
    }

    remove() {
        Game.splice(Canvas.objects, this);
    }
}