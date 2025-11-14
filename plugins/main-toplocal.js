import baileys from '@fuxxy-star/baileys'
const { areJidsSameUser } = baileys

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

// Fungsi helper untuk meresolve JID @lid ke JID standar
async function resolveAndCleanJid(inputJid, conn, groupParticipants = []) {
  if (inputJid.endsWith('@s.whatsapp.net')) {
    return inputJid // Sudah bersih
  }

  if (inputJid.endsWith('@lid')) {
    let resolved = groupParticipants.find(
      p => areJidsSameUser(p.id, inputJid) || areJidsSameUser(p.jid, inputJid)
    )
    if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
      return resolved.jid
    }

    try {
      const [res] = await conn.onWhatsApp(inputJid)
      if (res?.exists) {
        return res.jid
      }
    } catch (e) {
      // console.error("Error resolving JID with onWhatsApp:", inputJid, e)
    }
  }
  return inputJid // fallback
}

let handler = async (m, { conn, participants }) => {
  // Reaksi loading
  await conn.sendMessage(m.chat, {
    react: { text: '🕒', key: m.key }
  })

  let groupParticipants = participants
  if (!groupParticipants || groupParticipants.length === 0) {
    const metadata = await conn.groupMetadata(m.chat).catch(() => null)
    if (metadata) {
      groupParticipants = metadata.participants
    } else {
      throw '❌ Gagal mendapatkan daftar peserta grup. Coba lagi.'
    }
  }

  let userDataMap = {}

  for (let i = 0; i < groupParticipants.length; i++) {
    const rawJid = groupParticipants[i].id
    const cleanedUserJid = await resolveAndCleanJid(rawJid, conn, groupParticipants)

    // skip bot sendiri atau bukan user wa valid
    if (areJidsSameUser(cleanedUserJid, conn.user.id) || !cleanedUserJid.endsWith('@s.whatsapp.net')) {
      continue
    }

    let user = global.db.data.users[cleanedUserJid]
    if (typeof user !== 'undefined') {
      userDataMap[cleanedUserJid] = {
        money: user.money || 0,
        level: user.level || 0,
        limit: user.limit || 0
      }
    }
  }

  let moneyData = Object.entries(userDataMap).sort((a, b) => b[1].money - a[1].money)
  let limitData = Object.entries(userDataMap).sort((a, b) => b[1].limit - a[1].limit)

  let rankMoney = moneyData.map(v => v[0])
  let rankLimit = limitData.map(v => v[0])

  let showCount = Math.min(10, moneyData.length)

  let teks = `*[ 🚩 ] T O P - L O K A L*\n`

  const senderJidCleaned = await resolveAndCleanJid(m.sender, conn, groupParticipants)
  const senderRank = rankMoney.indexOf(senderJidCleaned) + 1

  teks += `*[ 🏆 ] Kamu : ${senderRank || 'Tidak Terdaftar'}* dari *${rankMoney.length}*\n`
  teks += `*[ 🔥 ] Grup :* ${await conn.getName(m.chat)}\n\n`

  teks += moneyData.slice(0, showCount).map(([user, data], i) =>
    `${i + 1}. @${user.split`@`[0]}\n   ◦  *Money:* ${formatNumber(data.money)}\n   ◦  *Level:* ${data.level}`
  ).join('\n')

  teks += `\n\n> © ${global.namebot || 'ubed Bot'}`

  await conn.sendMessage(m.chat, teks, { quoted: fkontak })
}

handler.command = /^toplokal|toplocal$/i
handler.tags = ["main"]
handler.help = ["toplocal"]
handler.register = true
handler.group = true

export default handler

// Fungsi format angka biar ada titik ribuan
function formatNumber(num) {
  if (typeof num !== 'number') return '0'
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}