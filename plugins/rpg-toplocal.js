import { areJidsSameUser } from '@fuxxy-star/baileys' // ganti ke whiskey

const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: "0@s.whatsapp.net",
        fromMe: false,
        id: "Halo",
    },
    message: {
        conversation: `toplokal ${global.namebot || 'Bot'} ✨`,
    }
}

// Fungsi helper untuk meresolve JID
async function resolveAndCleanJid(inputJid, conn, groupParticipants = []) {
    if (inputJid.endsWith('@s.whatsapp.net')) return inputJid

    if (inputJid.endsWith('@lid')) {
        let resolved = groupParticipants.find(p => areJidsSameUser(p.id, inputJid) || areJidsSameUser(p.jid, inputJid))
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) return resolved.jid

        try {
            const res = await conn.onWhatsApp(inputJid)
            if (Array.isArray(res) && res[0]?.exists) return res[0].jid
        } catch {}
    }
    return inputJid
}

let handler = async (m, { conn, participants }) => {
    // Kirim reaksi proses 🎶
    await conn.sendMessage(m.chat, { react: { text: '🎶', key: m.key } })

    let groupParticipants = participants
    if (!groupParticipants?.length) {
        const metadata = await conn.groupMetadata(m.chat).catch(() => null)
        if (metadata) groupParticipants = metadata.participants
        else throw '❌ Gagal mendapatkan daftar peserta grup.'
    }

    let userDataMap = {}

    for (let p of groupParticipants) {
        const cleanedJid = await resolveAndCleanJid(p.id, conn, groupParticipants)

        if (areJidsSameUser(cleanedJid, conn.user.id) || !cleanedJid.endsWith('@s.whatsapp.net')) continue

        let user = global.db.data.users[cleanedJid]
        if (user) {
            userDataMap[cleanedJid] = {
                money: user.money || 0,
                level: user.level || 0,
                limit: user.limit || 0
            }
        }
    }

    let moneyData = Object.entries(userDataMap).sort((a, b) => b[1].money - a[1].money)
    let rankMoney = moneyData.map(v => v[0])

    let showCount = Math.min(10, moneyData.length)
    let teks = `*[🚩] T O P - L O K A L*\n`

    const senderJidCleaned = await resolveAndCleanJid(m.sender, conn, groupParticipants)
    const senderRank = rankMoney.indexOf(senderJidCleaned) + 1

    teks += `*[🏆] Kamu : ${senderRank || '-'}* dari *${rankMoney.length}*\n`
    teks += `*[🔥] Grup :* ${await conn.getName(m.chat)}\n\n`

    teks += moneyData.slice(0, showCount).map(([jid, data], i) =>
        `${i + 1}. @${jid.split`@`[0]}\n   ◦  *Money:* ${formatNumber(data.money)}\n   ◦  *Level:* ${data.level}`
    ).join('\n')

    teks += `\n\n> © ubed Bot`

    await conn.sendMessage(m.chat, { text: teks, mentions: rankMoney.slice(0, showCount) }, { quoted: fkontak })
}

handler.command = /^toplokal|toplocal$/i
handler.tags = ["main"]
handler.help = ["toplocal"]
handler.register = true
handler.group = true

export default handler

function formatNumber(num) {
    if (typeof num !== 'number') return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}