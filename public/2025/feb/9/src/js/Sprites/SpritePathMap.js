export const SpritePathMap = {
    unknown: createImage('../9/src/images/unknown.png'),

    itemslot: createImage('../9/src/images/itemslot.png'),
    activeitemslot: createImage('../9/src/images/activeitemslot.png'),

    playerinventorybutton: createImage('../9/src/images/playerinventorybutton.png'),
    playerutility: createImage('../9/src/images/playerutility.png'),
    playerutilitybutton: createImage('../9/src/images/playerutilitybutton.png'),

    maingroup: createImage('../9/src/images/maingroup.png'),
    disabledmaingroup: createImage('../9/src/images/disabledmaingroup.png'),

    world_background1: createImage('../9/src/images/world/background1.png'),
    world_background2: createImage('../9/src/images/world/background2.png'),
    world_background3: createImage('../9/src/images/world/background3.png'),

    rock: createImage('../9/src/images/rock.png'),
    tree: createImage('../9/src/images/tree.png'),

    worldtiles: createImage('../9/src/images/worldtiles.png'),

    healthinfobar_background: createImage('../9/src/images/healthinfobar_background.png'),
    healthinfobar_bar: createImage('../9/src/images/healthinfobar_bar.png'),

    i1: createImage('../9/src/images/i1.jpg'),
    i2: createImage('../9/src/images/i2.jpg'),
    i3: createImage('../9/src/images/i3.jpg'),
    i4: createImage('../9/src/images/i4.jpg'),
    i5: createImage('../9/src/images/i5.jpg'),
}

function createImage(path) {
    const img = new Image();
    img.src = path;

    return img;
}