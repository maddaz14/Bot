let handler = async (m, { conn, participants }) => {
    let user = global.db.data.users[m.sender]
    let __timers = (new Date - user.lastmisi)
    let _timers = (3600000 - __timers)
    let order = isNaN(user.pembunuh) ? user.pembunuh = 0 : user.pembunuh
    let timers = clockString(_timers)
    let name = conn.getName(m.sender)
    let id = m.sender
    let kerja = 'pembunuh'
    conn.misi = conn.misi ? conn.misi : {}

    if (!m.mentionedJid[0]) return m.reply('Tag seseorang yang ingin kamu bunuh secara rahasia! Contoh: *pembunuh @tag*')

    let target = m.mentionedJid[0]
    let targetName = conn.getName(target)

    if (id in conn.misi) return conn.reply(m.chat, `🔪 *Misi kamu sebagai ${conn.misi[id][0]} masih berjalan... jangan terlalu mencolok ya!*`, m)
    if (new Date - user.lastmisi > 3600000) {
        let randomUang = Math.floor(Math.random() * 10) * 150000
        let randomExp = Math.floor(Math.random() * 10) * 1200

        const cerita = [
            `Di balik gelapnya lorong malam, ${name} mendekati ${targetName} dengan langkah senyap... satu tembakan senapan berperedam mengakhiri semuanya.`,
            `${name} menyamar sebagai pelayan hotel, menyelinap ke kamar ${targetName}... dan tak ada yang pernah melihatnya lagi.`,
            `Dalam pesta topeng yang ramai, ${name} menyusup dan membisikkan kata terakhir pada ${targetName} sebelum menusuknya tanpa suara.`,
            `Sebuah ledakan kecil di dalam mobil milik ${targetName}... semua mata tertuju pada api, tapi sang pembunuh sudah jauh — ${name}.`,
            `Ketika ${targetName} membuka pintu rumah, sebuah jarum beracun menyentuh lehernya. Eksekutor: ${name}.`
        ]
        let ceritaAcak = cerita[Math.floor(Math.random() * cerita.length)]

        let hsl = `
${ceritaAcak}

🔪 *𝗠𝗜𝗦𝗜 𝗘𝗞𝗘𝗦𝗘𝗞𝗨𝗧𝗢𝗥 𝗧𝗘𝗥𝗦𝗘𝗟𝗘𝗦𝗔𝗜!* 🔪
━━━━━━━━━━━━━━━━
🕵️ *Pembunuh: ${name}*
🎯 *Target: ${targetName}*
💰 *Bayaran Diterima: +Rp ${toRupiah(randomUang)}*
✨ *Exp: +${toRupiah(randomExp)} exp*
📄 *Target Dieksekusi: +1*
🧾 *Total Misi: ${toRupiah(order + 1)}*
━━━━━━━━━━━━━━━━
🌒 *Misi berjalan mulus tanpa diketahui siapa pun...*
`.trim()

        user.money += randomUang
        user.exp += randomExp
        user.bunuh += 1

        setTimeout(() => {
            m.reply('🔪 *Sedang menyusun strategi... mencari target berikutnya~*')
        }, 0)

        conn.misi[id] = [
            kerja,
            setTimeout(() => {
                delete conn.misi[id]
            }, 27000)
        ]

        setTimeout(() => {
            conn.reply(m.chat, hsl, m, { mentions: [target] })
        }, 27000)

        user.lastmisi = new Date * 1
    } else {
        m.reply(`⏳ *Tugas belum bisa diambil lagi~*\n🕒 *Tunggu: ${timers} sebelum eksekusi berikutnya yaa~*`)
    }
}

handler.help = ["pembunuh @tag"]
handler.tags = ['rpg']
handler.command = /^(pembunuh)$/i
handler.register = true
handler.group = true
handler.rpg = true
handler.level = 15
handler.energy = 30

export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const toRupiah = number => {
    let num = parseInt(number)
    return Math.min(num, Number.MAX_SAFE_INTEGER).toLocaleString('id-ID').replace(/\./g, ",")
}