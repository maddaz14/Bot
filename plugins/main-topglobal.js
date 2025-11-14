import baileys from '@fuxxy-star/baileys'
const { areJidsSameUser } = baileys

// Helper function for formatting money with suffixes (like 'k', 'm', etc.)
function formatMoney(money) {
  const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'Td', 'qd', 'Qd', 'sd', 'Sd', 'od', 'nd', 'V', 'Uv', 'Dv', 'Tv', 'qv', 'Qv', 'sv', 'Sv', 'ov', 'nv', 'T', 'UT', 'DT', 'TT', 'qt', 'QT', 'st', 'ST', 'ot', 'nt']
  if (typeof money !== 'number' || isNaN(money)) return '0'
  if (money === 0) return '0'
  const suffixIndex = Math.floor(Math.log10(money) / 3)
  const suffix = suffixes[suffixIndex] || ''
  const scaled = money / Math.pow(10, suffixIndex * 3)
  return scaled.toFixed(2) + suffix
}

// Helper function to validate permanent JIDs (ending with @s.whatsapp.net)
function isValidPermanentJid(jid) {
  return typeof jid === 'string' && jid.endsWith('@s.whatsapp.net')
}

// Initial message format
const fkontak = {
  key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
  message: { conversation: `topglobal ${global.namebot || 'Bot'} ✨` }
}

let handler = async (m, { conn }) => {
  // React with a clock emoji on command received
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  let moneyData = []
  try {
    const allUsersEntries = Object.entries(global.db.data.users || {})
    for (const [id, userData] of allUsersEntries) {
      if (isValidPermanentJid(id) && !areJidsSameUser(id, conn.user.id)) {
        moneyData.push({
          id,
          money: userData?.money || 0,
          level: userData?.level || 0
        })
      }
    }
    moneyData.sort((a, b) => b.money - a.money)
  } catch (e) {
    console.error('Error processing user data for topglobal:', e)
    return conn.reply(m.chat, '❌ Terjadi kesalahan saat memproses data pengguna.', m)
  }

  if (moneyData.length === 0) {
    return conn.reply(m.chat, '😔 Belum ada data pengguna yang valid untuk ditampilkan di Top Global.', m)
  }

  const rankMoney = moneyData.map(u => u.id)
  const showCount = Math.min(10, moneyData.length)

  let teks = `[ 🌐 ] *T O P - G L O B A L*\n`

  let senderRank = 'Tidak Terdaftar'
  if (isValidPermanentJid(m.sender)) {
    const findSenderRank = rankMoney.indexOf(m.sender)
    if (findSenderRank !== -1) {
      senderRank = findSenderRank + 1
    }
  }

  teks += `[ 🏆 ] *Kamu:* *${senderRank}* dari *${rankMoney.length}*\n\n`

  if (showCount > 0) {
    teks += moneyData.slice(0, showCount)
      .map((user, i) =>
        `${i + 1}. @${user.id.split`@`[0]}\n` +
        `   ◦ *Money* : *${formatMoney(user.money)}*\n` +
        `   ◦ *Level* : *${user.level}*`
      ).join('\n')
  } else {
    teks += 'Tidak ada data top user untuk ditampilkan.\n'
  }

  teks += `\n\n> © ${global.namebot || 'ubed Bot'}`

  conn.reply(m.chat, teks, fkontak)
}

handler.command = ['topglobal']
handler.tags = ['main']
handler.help = ['topglobal']
handler.register = true

export default handler