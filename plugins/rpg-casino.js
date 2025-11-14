let fruits = ['🍒', '🍋', '🍉', '🍇', '🍊', '🍓', '🍍']; // List of possible fruits
let casinoConfirm = {};

async function handler(m, { conn, args }) {
    if (m.sender in casinoConfirm) throw 'You are already playing casino, please wait for it to finish!';
    try {
        let user = global.db.data.users[m.sender];
        let betAmount = (args[0] && isNumber(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : 1) * 1;

        if (user.money < betAmount) return m.reply('💰 You don\'t have enough money to bet!'); // PERUBAHAN: eris diubah menjadi money

        // Slot machine: pick 3 random fruits
        let slot1 = fruits[Math.floor(Math.random() * fruits.length)];
        let slot2 = fruits[Math.floor(Math.random() * fruits.length)];
        let slot3 = fruits[Math.floor(Math.random() * fruits.length)];

        let isJackpot = (slot1 === slot2 && slot2 === slot3); // Check if all 3 slots match
        let winAmount = isJackpot ? betAmount * 5 : 0;

        // Update user's money
        if (isJackpot) {
            user.money += winAmount; // PERUBAHAN: eris diubah menjadi money
            m.reply(`🎉 JACKPOT!!! 🎉\nYou won *${winAmount}* 💹!\n\nResult: ${slot1} | ${slot2} | ${slot3}`);
        } else {
            user.money -= betAmount; // PERUBAHAN: eris diubah menjadi money
            m.reply(`You lost *${betAmount}* 💹.\n\nResult: ${slot1} | ${slot2} | ${slot3}\nBetter luck next time!`);
        }
    } catch (e) {
        handleError(e, m);
    }
}

function isNumber(x = 0) {
    x = parseInt(x);
    return !isNaN(x) && typeof x === 'number';
}

function handleError(e, m) {
    console.error(e);
    m.reply('An error occurred during the casino game.');
}

handler.help = ['casino'];
handler.tags = ['rpg'];
handler.command = /^(casino)$/i;
handler.limit = 1;
handler.register = true;
handler.group = true;

export default handler;