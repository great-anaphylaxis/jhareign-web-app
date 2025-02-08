export const SpriteAnimationMap = {
    playerwalking: createAnimation("playerwalking", 7),
    playeridle: createAnimation("playeridle", 1),
    playerattack: createAnimation("playerattack", 10),
    playertool: createAnimation("playertool", 7),
}

function createAnimation(prefix, lastIndex) {
    let animationArray = []
    for (let i = 0; i <= lastIndex; i++) {
        //bro
        animationArray.push(createImage(`../9/src/images/${prefix}/${prefix}_${i}.png`))
    }

    return animationArray;
}

function createImage(path) {
    const img = new Image();
    img.src = path;

    return img;
}