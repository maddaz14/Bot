import fetch from 'node-fetch'

const link = 'https://data.bmkg.go.id/DataMKG/TEWS/'

// Menangani perintah dan status update gempa
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let setting = db.data.settings[conn.user.jid]
    let type = (args[0] || '').toLowerCase()

    switch (type) {
        case 'update':
            if (args[1] == 'on') {
                setting.update_gempa = true
                m.reply('🛑 *Auto Update Gempa* *ON* 🔔\nGempa terbaru akan dikirim otomatis setiap ada update!')
            } else if (args[1] == 'off') {
                setting.update_gempa = false
                m.reply('❌ *Auto Update Gempa* *OFF* 📴\nGempa terbaru tidak akan dikirim otomatis.')
            } else m.reply('⚠️ *Perintah yang valid:* on/off untuk mengaktifkan atau menonaktifkan auto update.')
            break

        default:
            try {
                // Mengambil data gempa terbaru
                let res = await fetch(link + 'autogempa.json')
                let anu = await res.json()
                anu = anu.Infogempa.gempa

                // Membuat teks informasi gempa
                let txt = `🌍 *INFORMASI GEMPA TERBARU:*\n\n`
                txt += `📍 *Wilayah:* ${anu.Wilayah}\n`
                txt += `📅 *Tanggal:* ${anu.Tanggal}\n`
                txt += `⏰ *Waktu:* ${anu.Jam}\n`
                txt += `💥 *Potensi:* *${anu.Potensi}*\n\n`
                txt += `📊 *Magnitude:* ${anu.Magnitude}\n`
                txt += `🌊 *Kedalaman:* ${anu.Kedalaman} km\n`
                txt += `🗺️ *Koordinat:* ${anu.Coordinates}\n`
                txt += anu.Dirasakan.length > 3 ? `😣 *Dirasakan:* ${anu.Dirasakan}\n` : ''

                // Mengirim pesan dengan informasi gempa
                await conn.sendMessage(m.chat, {
                    text: txt,
                    contextInfo: {
                        "externalAdReply": {
                            "title": namebot,
                            "body": command,
                            "showAdAttribution": true,
                            "mediaType": 1,
                            "sourceUrl": '',
                            "thumbnailUrl": gempaUrl,
                            "renderLargerThumbnail": true
                        }
                    }
                }, { quoted: m })
            } catch (e) {
                console.log(e)
                m.reply(`⚠️ Terjadi kesalahan dalam mengambil data gempa. Coba lagi nanti.`)
            }
    }
}

handler.help = ['gempa']
handler.tags = ['internet']
handler.command = /^(gempa)$/i

handler.premium = false
handler.limit = true

export default handler