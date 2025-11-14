let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan nomor atau tag dan jumlah EXP yang akan diberi'

    let users = global.db.data.users
    let who
    let poin

    // Pisahkan input jadi argumen, misal: "6281234567890 100" atau "@user 100"
    let [userInput, amount] = text.split(/\s+/).filter(v => v)

    if (!userInput || !amount) throw 'Format salah, contoh: .addexp @user 100 atau .addexp 6281234567890 100'
    if (isNaN(amount)) throw 'Jumlah EXP harus angka'
    poin = parseInt(amount)
    if (poin < 1) throw 'Minimal 1 EXP'

    // Cek apakah input user berupa mention (pakai @)
    if (userInput.startsWith('@')) {
        who = m.isGroup
            ? m.mentionedJid && m.mentionedJid[0]
            : null
        if (!who) throw 'Tag user yang valid'
    } else {
        // Input dianggap nomor telepon, buat JID whatsapp
        let phone = userInput.replace(/\D/g, '')
        if (!phone) throw 'Nomor tidak valid'
        who = phone + '@s.whatsapp.net'
    }

    // Pastikan user ada di database
    if (!users[who]) {
        users[who] = { exp: 0 }
    }

    users[who].exp += poin

    await conn.sendMessage(m.chat, {
        text: `Selamat @${who.split('@')[0]}, kamu mendapatkan +${poin} EXP!`,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['addexp <@user|nomor> <jumlah>']
handler.tags = ['owner']
handler.command = /^addexp$/i
handler.owner = true

export default handler