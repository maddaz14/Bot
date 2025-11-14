import { resolveWid } from '../lib/jid.js'

const fkontak = {
  key: {
    participant: '0@s.whatsapp.net',
    remoteJid: '0@s.whatsapp.net',
    fromMe: false,
    id: 'Halo',
  },
  message: {
    conversation: `shopmagic ${global.namebot || 'Bot'} ✨`,
  },
}

let handler = async (m, { conn, command, args, usedPrefix, participants }) => {
  try {
    // pastikan sender selalu WID valid
    const senderJid = await resolveWid(m, conn, m.sender, participants)
    const user = global.db.data.users[senderJid] || (global.db.data.users[senderJid] = {
      money: 0,
      bank: 0,
      balance: 0,
      exp: 0,
      limit: 0,
      level: 0,
      magicalitem: 0,
      magicalitemdurability: 0,
      health: 100,
      stamina: 100,
      premium: false,
      registered: true,
      name: null,
    })

    // harga magicalitem sesuai level
    const magicalitemPrice =
      user.magicalitem === 0 ? 1500000 :
      user.magicalitem === 1 ? 2500000 :
      user.magicalitem === 2 ? 3000000 :
      user.magicalitem === 3 ? 3500000 : 0

    const Kchat = `
Penggunaan ${usedPrefix}shopmagic <buy|sell> <item> <jumlah>
Contoh penggunaan: *${usedPrefix}shopmagic buy magicalitem 1*
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

🎩 Magicalitem:   Rp.${magicalitemPrice.toLocaleString()}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
    `.trim()

    // command utama
    const action = args[0]?.toLowerCase()
    const type = args[1]?.toLowerCase()
    const count = args[2] ? Math.min(999999999, Math.max(parseInt(args[2]), 1)) : 1

    if (!['buy', 'beli'].includes(action)) {
      return conn.reply(m.chat, Kchat, fkontak)
    }

    if (type === 'magicalitem') {
      if (user.magicalitem >= 3)
        return conn.reply(m.chat, '❌ Kamu sudah memiliki semua item sihir.', fkontak)

      if (user.money >= magicalitemPrice * count) {
        user.magicalitem += count
        user.health += 66 * count
        user.stamina += 66 * count
        user.magicalitemdurability += 50 * count
        user.money -= magicalitemPrice * count

        return conn.reply(
          m.chat,
          `✅ Berhasil membeli *Magical Item* seharga Rp.${(magicalitemPrice * count).toLocaleString()}\n\n🎁 Bonus:\n❤️ Health +${66 * count}\n⚡ Stamina +${66 * count}`,
          fkontak
        )
      } else {
        return conn.reply(
          m.chat,
          `❌ Uangmu tidak cukup.\nHarga: Rp.${(magicalitemPrice * count).toLocaleString()}\nSaldo: Rp.${user.money.toLocaleString()}`,
          fkontak
        )
      }
    } else {
      return conn.reply(m.chat, Kchat, fkontak)
    }
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Terjadi kesalahan saat memproses shopmagic.', m)
  }
}

handler.help = ['shopmagic <buy|sell> <item> <jumlah>']
handler.tags = ['rpg']
handler.command = /^(shopmagic)$/i
handler.limit = true
handler.group = true

export default handler