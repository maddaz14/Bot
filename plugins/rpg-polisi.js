const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `polisi ${global.namebot || 'Bot'} ✨`,
    }
};

const timeout = 900000; // 15 menit // PERBAIKAN: 'Const' diubah menjadi 'const'
let handler = async (m, { conn }) => {
    let name = conn.getName(m.sender);
    let user = global.db.data.users[m.sender];
    
    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    let time = global.db.data.users[m.sender].lastPolisi + 900000;
    if (new Date - global.db.data.users[m.sender].lastPolisi < 900000) return conn.reply(m.chat, `Kamu Sudah Lelah\nTunggu Selama ${msToTime(time - new Date())} Lagi`, fkontak); // Menggunakan fkontak

    user.notifiedPolisi = true;
    const stolenItems = ['Handphone', 'Laptop', 'Dompet', 'Perhiasan', 'Sepeda', 'Motor', 'TV', 'Kamera'];
    const item = stolenItems[Math.floor(Math.random() * stolenItems.length)];

    let baseRewardMoney = Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000;
    let baseRewardExp = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

    let luckyBonus = Math.random() < 0.1;
    let luckyMessage = '';
    let bonusMoney = 0;
    let bonusExp = 0;

    if (luckyBonus) {
        bonusMoney = Math.min(baseRewardMoney * 2, 5000000);
        bonusExp = baseRewardExp * 2;
        luckyMessage = `\n
🎉 *LUCKY BONUS!*
💰 Bonus Uang: ${formatNumber(bonusMoney)}
✨ Bonus Exp: ${formatNumber(bonusExp)}\n`.trim();
    }

    let totalRewardMoney = baseRewardMoney + bonusMoney;
    let totalRewardExp = baseRewardExp + bonusExp;

    user.money += totalRewardMoney; // eris sudah diubah menjadi money
    user.exp += totalRewardExp;
    global.db.data.users[m.sender].lastPolisi = new Date * 1;

    let message = `
👮🏻‍♂️ *${name}*, kamu berhasil menangkap maling yang mencuri *${item}*!

*Ini Gajimu*:
💵 Uang: ${formatNumber(baseRewardMoney)}
🧪 Exp: ${formatNumber(baseRewardExp)}
${luckyMessage ? luckyMessage : ''}
_Teruslah berbuat kebaikan..._

📈 Total Gaji: 💵 *${formatNumber(totalRewardMoney)}* | 🧪 *${formatNumber(totalRewardExp)}* Exp`.trim();

    conn.reply(m.chat, message, fkontak); // Menggunakan fkontak
    setTimeout(() => {
        conn.reply(m.chat, `Yuk Waktunya Menangkap Pencuri…`, fkontak); // Menggunakan fkontak
    }, timeout);
};

handler.help = ['polisi'];
handler.tags = ['rpg'];
handler.command = /^(polisi|tangkappencuri|tangkapmaling)$/i;
handler.register = true;
handler.group = true;

export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + " Jam " + minutes + " Menit " + seconds + " Detik";
}