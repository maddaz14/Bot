let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah balance yang akan ditambahkan'

    let who
    let phoneRegex = /^\+?\d+(-\d+)*$/

    // Mengecek apakah pesan berasal dari grup atau bukan
    if (m.isGroup) {
        if (phoneRegex.test(text.split(' ')[0])) {
            who = text.split(' ')[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.mentionedJid[0]
        }
    } else {
        if (phoneRegex.test(text.split(' ')[0])) {
            who = text.split(' ')[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.chat
        }
    }

    // Jika tidak ada user yang ditentukan
    if (!who) throw 'Tag salah satu atau masukkan nomor telepon yang valid'

    // Menghapus username dan teks untuk mendapatkan jumlah balance yang akan ditambahkan
    let txt = text.replace('@' + who.split`@`[0], '').replace(text.split(' ')[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'

    // Parsing jumlah balance yang akan ditambahkan
    let poin = parseInt(txt)
    let balance = poin
    if (balance < 1) throw 'Minimal 1'

    // Akses database global untuk mendapatkan user
    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan di database'

    // Menambahkan balance pada user yang ditentukan
    users[who].balance += poin

    // Kirim pesan pemberitahuan menggunakan WhiskeySocket
    await conn.reply(m.chat, `Selamat Kak @${who.split`@`[0]}. Kamu Mendapatkan balance Dari Owner Sebanyak +${poin} balance!`, m, { mentions: [who] })
}

handler.help = ['addbalance @user|+phone <amount>']
handler.tags = ['owner']
handler.command = /^addbalance$/
handler.owner = true

export default handler;