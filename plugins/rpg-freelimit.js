const limitReward = 50;

let handler = async (m) => {
    let user = global.db.data.users[m.sender];

    if (user.limit > 10) {
        throw `Kamu masih memiliki limit`;
    }

    let time = user.lastFreeLimit + 86400000;
    
    if (new Date - user.lastFreeLimit < 86400000) {
        let remainingTime = msToTime(time - new Date());
        throw `Kamu sudah mengambil limit ini.\nTunggu selama ${remainingTime} lagi.`;
    }
    
    user.limit += limitReward;
    
    conn.reply(m.chat, `✅ Kamu telah menerima *${limitReward}* Limit Gratis!`, floc);
    
    user.lastFreeLimit = new Date * 1;
}

handler.help = ['freelimit'];
handler.tags = ['rpg'];
handler.command = /^(freelimit)$/i;
handler.register = true;

export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 30);

    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
}