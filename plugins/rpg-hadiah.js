const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `hadiah ${global.namebot || 'Bot'} ✨`,
    }
};

const eris = 499999
const exp = 20000
const diamond = 7
const limit = 23
const legendary = 3

let handler = async (m, { isPrems }) => {
    let time = global.db.data.users[m.sender].lasthadiah + 86400000
    if (new Date - global.db.data.users[m.sender].lasthadiah < 86400000) {
        let remainingTime = msToTime(time - new Date())
        throw `Kamu Sudah Mengambil Hadiah Ini\nTunggu Selama ${remainingTime} Lagi`
    }
    global.db.data.users[m.sender].money += isPrems ? eris : eris // PERUBAHAN: eris diubah menjadi money
    global.db.data.users[m.sender].exp += isPrems ? exp : exp
    global.db.data.users[m.sender].diamond += isPrems ? diamond : diamond
    global.db.data.users[m.sender].limit += isPrems ? limit : limit
    global.db.data.users[m.sender].legendary += isPrems ? legendary : legendary
    conn.reply(m.chat, `✨ Ini Hadiah Kamu:\n\n*💰 = [ ${isPrems ? eris : eris} ] Money*\n*⭐ = [ ${isPrems ? exp : exp} ] EXP*\n*💎 = [ ${isPrems ? diamond : diamond} ] Diamond*\n*📜 = [ ${isPrems ? limit : limit} ] Limit*\n*🏆 = [ ${isPrems ? legendary : legendary} ] Legendary*`, fkontak) // Menggunakan fkontak
    global.db.data.users[m.sender].lasthadiah = new Date * 1
    
    // Notifikasi ketika cooldown habis
    setTimeout(() => {
        conn.reply(m.chat, `Kamu sudah bisa mengambil hadiah kembali!`, fkontak) // Menggunakan fkontak
    }, 86400000)
}

handler.help = ['hadiah']
handler.tags = ['rpg']
handler.command = /^(hadiah)$/i
handler.register = true

handler.fail = null

export default handler

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 30)

    days = (days < 10) ? "0" + days : days
    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds

    return days + " Hari " + hours + " Jam " + minutes + " Menit"
}