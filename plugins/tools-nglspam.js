import fetch from 'node-fetch'
import crypto from 'crypto'

let handler = async (m, { text }) => {
    if (!text) return m.reply("Masukkan dengan format: username|pesan|jumlah\nContoh: .nglspam rexxzynxd|halo|5")

    let [username, message, count] = text.split("|")
    if (!username || !message || !count) {
        return m.reply("Format salah!\nContoh: .nglspam fuxxy-star/baileys|halo|5")
    }

    let spamCount = parseInt(count)
    if (isNaN(spamCount) || spamCount <= 0) {
        return m.reply("Jumlah spam harus berupa angka positif!")
    }

    let sukses = 0
    let gagal = 0

    for (let i = 0; i < spamCount; i++) {
        try {
            let deviceId = crypto.randomBytes(21).toString('hex')
            let res = await fetch('https://ngl.link/api/submit', {
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': `https://ngl.link/${username}`,
                    'Origin': 'https://ngl.link'
                },
                body: `username=${username}&question=${message}&deviceId=${deviceId}&gameSlug=&referrer=`
            })

            if (res.status === 200) {
                sukses++
            } else {
                gagal++
                await delay(25000)
            }
        } catch (e) {
            console.error(e)
            gagal++
            await delay(5000)
        }
    }

    // Kirim pesan sekali setelah selesai
    let hasil = `✅ Selesai mengirim pesan NGL ke *${username}*\n\n📨 *Pesan:* ${message}\n` +
                `🟢 *Berhasil:* ${sukses}\n🔴 *Gagal:* ${gagal}\n🕒 Total: ${sukses + gagal} percobaan`

    m.reply(hasil)
}

handler.command = ["nglspam"]
handler.tags = ["tools"]
handler.help = ["nglspam <username>|<pesan>|<jumlah>"]

export default handler

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}