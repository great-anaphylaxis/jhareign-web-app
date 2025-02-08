export const ItemDefaults = {
    
}

// abstract functions
function item(displayName) {
    return {
        displayName: displayName
    };
}

function tool(displayName, toolType, toolDamage, toolCooldown) {
    return {
        displayName: displayName,
        toolType: toolType,
        toolDamage: toolDamage,
        toolCooldown: toolCooldown
    };
}