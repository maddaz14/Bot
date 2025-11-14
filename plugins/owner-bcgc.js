let handler = async (m, { conn, isROwner, text }) => {
    const delay = time => new Promise(res => setTimeout(res, time))
    let getGroups = await conn.groupFetchAllParticipating()
    let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
    let anu = groups.map(v => v.id)
    
    if (!text) {
        return m.reply('Mau broadcast apa, Senpai? Nih cara pakainya:\n- `bcgc <teks>` (kirim ke semua grup)\n- `bcgc --<jumlah> <teks>` (kirim ke jumlah grup random)')
    }
    
    let jumlahGrup = anu.length
    let pesan = text
    let targetJumlah = null

    if (text.startsWith('--')) {
        const args = text.split(' ')
        targetJumlah = parseInt(args[0].replace('--', ''))
        pesan = args.slice(1).join(' ')
        if (isNaN(targetJumlah) || targetJumlah <= 0) throw 'Jumlah grup harus angka positif, Senpai!'
        if (targetJumlah > anu.length) throw `Grup cuma ada ${anu.length}, Senpai minta ${targetJumlah}, kebanyakan!`
        anu = anu.sort(() => Math.random() - 0.5).slice(0, targetJumlah)
        jumlahGrup = targetJumlah
    }

    if (!pesan) throw 'Teks broadcast-nya kosong, Senpai!'
    m.reply(`Lagi kirim broadcast ke ${jumlahGrup} grup, selesai dalam ${jumlahGrup * 5} detik nih!`)
    
    for (let i of anu) {
        await delay(5000)
        if (i.endsWith('@g.us')) {
            await conn.relayMessage(i, {
                extendedTextMessage: {
                    text: pesan,
                    contextInfo: {
                        externalAdReply: {
                            title: wm,
                            body: 'ʙʀᴏᴀᴅᴄᴀsᴛɢʀᴏᴜᴘs',
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: global.thumb,
                            sourceUrl: 'https://whatsapp.com/channel/0029VaF8RYn9WtC16ecZws0H',
                            showAdAttribution: true
                        }
                    },
                    mentions: [m.sender]
                }
            }, {}).catch(err => console.log(`Gagal kirim ke ${i}: ${err}`))
        }
    }
    m.reply(`Sukses kirim broadcast ke ${jumlahGrup} grup, Senpai! Keren, kan?`)
}

handler.help = ['bcgc <text>']
handler.tags = ['owner']
handler.command = /^(broadcastgroup|brosdcastgroupbot|bcgc|bcgcbot)$/i
handler.owner = true

export default handler