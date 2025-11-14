import fs from 'fs'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
  let totalreg = Object.keys(global.db.data.users).length
  let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
  let unreg = totalreg - rtotalreg // Hitung user tidak terdaftar

  try {
    await conn.sendMessage(m.chat, {
      poll: {
        question: '📊 *Statistik User*',
        options: [
          { optionName: 'User Terdaftar', optionVoteCount: rtotalreg },
          { optionName: 'Tidak Terdaftar', optionVoteCount: unreg }
        ],
        isMultiSelect: false // Cuma bisa pilih satu opsi
      },
      contextInfo: {
        mentionedJid: [m.sender]
      }
    }, { quoted: m })
  } catch (e) {
    await conn.reply(m.chat, `Eits, Senpai, ada error nih! ${e.message}`, m)
  }
}

handler.help = ['user']
handler.tags = ['main', 'info']
handler.command = /^(user2)$/i

export default handler