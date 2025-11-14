let handler = async (m, { conn, usedPrefix, text, command }) => {
    async function resolveAndCleanJid(inputJid, conn, groupParticipants = []) {
        if (inputJid.endsWith('@s.whatsapp.net')) return inputJid

        if (inputJid.endsWith('@lid')) {
            let resolved = groupParticipants.find(p => p.id === inputJid)
            if (resolved?.id?.endsWith('@s.whatsapp.net')) {
                return resolved.id
            }

            try {
                const [res] = await conn.onWhatsApp(inputJid)
                if (res?.exists) return res.jid
            } catch (e) {
                console.error("Error resolving JID:", inputJid, e)
            }
        }
        return inputJid
    }

    if (!text) {
        return m.reply(
            `Usage:\n${usedPrefix + command} <pesan> | <id_grup>\n\nExample:\n${usedPrefix + command} Halo semua! | 120363023812345678@g.us`
        )
    }

    let messageText = ''
    let targetGroupId = ''
    const parts = text.split('|').map(s => s.trim())

    if (parts.length < 2) {
        messageText = parts[0]
        targetGroupId = m.chat
    } else {
        messageText = parts[0]
        targetGroupId = parts[1]
    }

    if (!targetGroupId.endsWith('@g.us')) {
        return m.reply('❌ Format ID grup tidak valid. Harus berakhir dengan *@g.us*')
    }

    let targetGroupMetadata
    try {
        targetGroupMetadata = await conn.groupMetadata(targetGroupId)
    } catch (e) {
        console.error("Error fetching group metadata:", e)
        return m.reply('❌ Gagal mengambil informasi grup. Pastikan ID grup benar dan bot ada di grup tersebut.')
    }

    let participants = targetGroupMetadata.participants
    let cleanedParticipants = []

    for (let participant of participants) {
        const cleanedJid = await resolveAndCleanJid(participant.id, conn, participants)
        if (
            cleanedJid.endsWith('@s.whatsapp.net') &&
            cleanedJid !== conn.user.id // cukup bandingkan langsung
        ) {
            cleanedParticipants.push(cleanedJid)
        }
    }

    if (cleanedParticipants.length === 0) {
        return m.reply('❌ Tidak ada anggota valid di grup target.')
    }

    let sentCount = 0
    m.reply(global.wait || '⏳ Sedang memproses...')

    for (let i = 0; i < cleanedParticipants.length; i++) {
        setTimeout(async () => {
            let targetJid = cleanedParticipants[i]
            try {
                if (messageText && m.quoted?.text) {
                    await conn.sendMessage(targetJid, { text: messageText + "\n" + m.quoted.text })
                } else if (messageText) {
                    await conn.sendMessage(targetJid, { text: messageText })
                } else if (m.quoted) {
                    await conn.sendMessage(targetJid, { forward: m.quoted })
                }
                sentCount++
            } catch (e) {
                console.error(`Gagal kirim ke ${targetJid}:`, e)
            } finally {
                if (i === cleanedParticipants.length - 1) {
                    m.reply(`✅ Push Kontak ke *${targetGroupMetadata.subject}* selesai.\nTerkirim: *${sentCount}* dari *${cleanedParticipants.length}* anggota.`)
                }
            }
        }, i * 1000) // delay 1 detik per orang
    }
}

handler.help = ['pushkontak <pesan> | <id_grup>']
handler.tags = ['owner']
handler.command = /^(pushkontak)$/i
handler.owner = true

export default handler