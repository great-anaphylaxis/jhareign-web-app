import { Canvas } from "../Canvas/Canvas.js";
import { SpritePathMap } from "./SpritePathMap.js";
import { Viewport } from "../Canvas/Viewport.js";
import { SpriteAnimationMap } from "./SpriteAnimationMap.js";
import { GameResizer } from "../Canvas/GameResizer.js";
import { Game } from "../Game.js";

export class Sprite {
    constructor(params) {
        this.width = params.width || 100;
        this.height = params.height || 100;
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.z = params.z || 0;
        this.layer = params.layer || "world"; // or screen
        this.img = SpritePathMap[params.imageName || "unknown"];
        this.imageName = params.imageName || "unknown";
        this.visible = params.visible ?? true;
        this.filter = params.filter || "none";
        this.animationName = params.animationName
        this.animation = SpriteAnimationMap[this.animationName] || [];
        this.animationDelay = params.animationDelay || 100;
        this.animationPlayed = false;
        this.angle = params.angle || 0;
        this.origin = params.origin || "center"; // or bottom
        this.flipped = params.flipped || false;
        this.opacity = params.opacity || 1.0;
        this.drawFunction = params.drawFunction || undefined;
    }

    isPlayingAnimation(...names) {
        for (let i = 0; i < names.length; i++) {
            if (names[i] == this.animationName) {
                if (this.animationPlayed) {
                    return true;
                }
            }
        }

        return false;
    }

    playAnimation(name, delay, repeat=true, finishScript=()=>{}) {
        if (!(name == this.animationName) || !repeat) {
            this.stopAnimation();
            this.animationDelay = delay || this.animationDelay;
            this.animationName = name;
            this.animation = [...SpriteAnimationMap[this.animationName]];
            this.animationPlayed = true;
            this.repeatAnimation = repeat;
            this.finishScript = finishScript;

            this.nextAnimation();
        }
    }

    nextAnimation() {
        this.animationTimeout = setTimeout(function() {
            if (this.animationPlayed) {
                this.animation.push(this.animation.shift());

                if (!this.repeatAnimation && this.hasRepeatedAnimation()) {
                    this.stopAnimation();
                }

                this.nextAnimation();
            }
        }.bind(this), this.animationDelay)
    }

    stopAnimation() {
        clearTimeout(this.animationTimeout)
        this.animationPlayed = false;

        if (this.finishScript) {
            this.finishScript();
        }
    }
    
    hasRepeatedAnimation() {
        const hasRepeated = (this.animation[0] == SpriteAnimationMap[this.animationName][0]);

        if (hasRepeated) {
            return true;
        }

        return false;
    }

    draw() {
        let finalX = this.x;
        let finalY = this.y;
        let finalWidth = this.width;
        let finalHeight = this.height;

        let filter = this.filter;

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
            finalWidth *= scale;
            finalHeight *= scale;
        }

        // rotation
        let scaleX = Canvas.element.width / GameResizer.aspectRatioWidth;
        let scaleY = Canvas.element.height / GameResizer.aspectRatioHeight

        finalX = (finalX + finalWidth / 2) * scaleX;
        finalY = (finalY + finalHeight / 2) * scaleY;

        Canvas.canvas.setTransform(canvasWidth, 0, 0, canvasHeight, finalX, finalY);

        if (this.flipped) {
            Canvas.canvas.scale(-1, 1)
        }

        Canvas.canvas.rotate(this.angle);

        if (this.origin == "center") {
            finalX = -finalWidth / 2;
            finalY = -finalHeight / 2;
        }

        else if (this.origin == "bottom") {
            finalX = -finalWidth / 2;
            finalY = -finalHeight;
        }

        
        Canvas.canvas.globalAlpha = this.opacity;

        if (this.animation.length > 0 && !this.drawFunction) {
            const img = this.animation[0];

            Canvas.canvas.filter = filter;
            Canvas.canvas.globalCompositeOperation = "source-over";

            if (!this.drawFunction) {
                Canvas.canvas.drawImage(img, finalX, finalY, finalWidth, finalHeight);
            }
        }
        
        else if (this.img.complete && !this.drawFunction) {
            Canvas.canvas.filter = filter;
            Canvas.canvas.globalCompositeOperation = "source-over";
            
            if (!this.drawFunction) {
                Canvas.canvas.drawImage(this.img, finalX, finalY, finalWidth, finalHeight);
            }
        }

        else if (this.drawFunction) {
            this.drawFunction(Canvas.canvas, finalX, finalY, finalWidth, finalHeight);
        }

        Canvas.canvas.setTransform(1, 0, 0, 1, 0, 0)

    }

    remove(removeCall=true, removeParameter="") {
        if (this.removeCall && removeCall) {
            this.removeCall(removeParameter);
        }
        
        this.visible = false;
        Game.splice(Canvas.objects, this);
    }
}