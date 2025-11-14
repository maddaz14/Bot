let handler = async (m, { args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    
    // Check if user's health is already at max limit (based on armor level)
    const maxHealth = [500, 550, 600, 650, 700, 750, 900, 1200, 1500][user.armor];
    if (user.health >= maxHealth) {
        return m.reply(`😊 Kamu sudah sehat.`);
    }
    
    // Define maximum health limit based on armor level
    const maxHealLimit = maxHealth;
    
    // Define healing values
    const healthPerPotion = 50;
    const healthPerHerbal = 30;
    
    // Check if they specified 'potion' or 'herbal'
    const itemType = args[0]?.toLowerCase();
    let healthPerItem, userItemCount, itemTypeName;
    
    if (itemType === 'potion') {
        healthPerItem = healthPerPotion;
        userItemCount = user.potion;
        itemTypeName = 'Potion';
    } else if (itemType === 'herbal') {
        healthPerItem = healthPerHerbal;
        userItemCount = user.herbs;  // Assume 'herbal' property exists in the user's data
        itemTypeName = 'Herbal';
    } else {
        return m.reply(`❌ Item tidak ada.\nGunakan\n* '${usedPrefix}heal potion'\n* '${usedPrefix}heal herbal'.`);
    }
    
    // Calculate the number of items needed to reach max heal limit
    let requiredItems = Math.ceil((maxHealLimit - user.health) / healthPerItem);
    
    // If a specific amount is provided in args, use that
    if (isNumber(args[1])) {
        requiredItems = Math.max(1, parseInt(args[1]));
    }
    
    // Ensure the user has enough items
    if (userItemCount < requiredItems) {
        return m.reply(`
❌ ${itemTypeName} Kamu Tidak Cukup. Kamu Memiliki *${userItemCount}* ${itemTypeName}.
💡 Ketik *${usedPrefix}shop buy ${itemType} ${requiredItems - userItemCount}* Untuk Membelinya
`.trim());
    }
    
    // Calculate total health restored and items used
    const healthRestored = Math.min(healthPerItem * requiredItems, maxHealLimit - user.health);
    const itemsUsed = Math.ceil(healthRestored / healthPerItem);
    
    // Update user's item count and health
    if (itemType === 'potion') {
        user.potion -= itemsUsed;
    } else if (itemType === 'herbal') {
        user.herbs -= itemsUsed;
    }
    user.health += healthRestored;
    
    // Return any excess items
    let excessItems = requiredItems - itemsUsed;
    if (itemType === 'potion') {
        user.potion += excessItems;  // Return excess potions to inventory
    } else if (itemType === 'herbal') {
        user.herbs += excessItems;  // Return excess herbs to inventory
    }
    
    m.reply(`
✨ Sukses Menggunakan ${itemTypeName}!
❤️ Jumlah health yang dipulihkan: ${healthRestored}
🔄 ${itemTypeName} yang dikembalikan: ${excessItems}
`.trim());
}

handler.help = ['heal'];
handler.tags = ['rpg'];
handler.command = /^(heal)$/i;
handler.register = true;

export default handler;

// Helper function to check if a value is a number
function isNumber(value) {
    value = parseInt(value);
    return !isNaN(value);
}