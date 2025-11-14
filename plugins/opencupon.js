let handler = async (m) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender

    // Cek apakah pengguna ada dalam database
    if (typeof global.db.data.users[who] == 'undefined') {
        return m.reply('Pengguna tidak ditemukan dalam database!')
    }

    // Cek apakah pengguna memiliki cupon
    let user = global.db.data.users[who]
    if (user.cupon <= 0) {
        return m.reply('Anda tidak memiliki cupon untuk dibuka!')
    }

    // Cek apakah sudah membuka cupon lebih dari 2 kali
    if (user.cuponOpened >= 2) {
        return m.reply('Anda sudah membuka cupon 2 kali hari ini.')
    }

    // Mengurangi 1 cupon dan mencatat jumlah pembukaan cupon
    user.cupon -= 1
    user.cuponOpened += 1

    // Menghasilkan hadiah secara random
    let limitReward = Math.floor(Math.random() * 11) + 5  // Limit antara 5 dan 15
    let moneyReward = Math.floor(Math.random() * 1000000) + 1000  // Money antara 1000 dan 1000000

    // Memberikan hadiah kepada pengguna
    user.limit += limitReward
    user.money += moneyReward

    // Mengirim pesan konfirmasi
    m.reply(`Anda berhasil membuka cupon!\n\nHadiah yang Anda terima:\n- Limit: +${limitReward}\n- Money: +${moneyReward}\n\nCupon yang Anda miliki sekarang: ${user.cupon} cupon.`)
}

handler.help = ['opencupon']
handler.tags = ['xp']
handler.command = /^(opencupon)$/i
handler.limit = true

export default handler