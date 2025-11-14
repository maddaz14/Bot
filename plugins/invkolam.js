let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let totalKecil = user.kepiting + user.lobster + user.udang + user.cumi + user.gurita + user.buntal + user.lele
  let totalBesar = user.dory + user.orca + user.lumba + user.paus + user.hiu

  let smallFish = `
╭━━━━「 *BIO* 」   
┊ *💌 Nama  :* ${user.registered ? user.name : conn.getName(m.sender)}
┊ *📊 Level :* ${user.level}
┊ *✨ Exp   :* ${user.exp.toLocaleString()}
╰═┅═━––––––─ׄ✧

╭━━━━「 *IKAN KECIL* 」
┊ 🦀 Kepiting : ${user.kepiting.toLocaleString()}
┊ 🦞 Lobster  : ${user.lobster.toLocaleString()}
┊ 🦐 Udang    : ${user.udang.toLocaleString()}
┊ 🦑 Cumi     : ${user.cumi.toLocaleString()}
┊ 🐙 Gurita   : ${user.gurita.toLocaleString()}
┊ 🐡 Buntal   : ${user.buntal.toLocaleString()}
┊ 🐟 Lele     : ${user.lele.toLocaleString()}
╰═┅═━––––––─ׄ✧
🎏 *Total Jenis:* 7
🎏 *Total Ikan :* ${totalKecil.toLocaleString()}

╭━━━━「 *IKAN BESAR* 」
┊ 🐠 Dory     : ${user.dory.toLocaleString()}
┊ 🐳 Orca     : ${user.orca.toLocaleString()}
┊ 🐬 Lumba    : ${user.lumba.toLocaleString()}
┊ 🐋 Paus     : ${user.paus.toLocaleString()}
┊ 🦈 Hiu      : ${user.hiu.toLocaleString()}
╰═┅═━––––––─ׄ✧
🎏 *Total Jenis:* 5
🎏 *Total Ikan :* ${totalBesar.toLocaleString()}

📦 *Total Keseluruhan:* ${(totalKecil + totalBesar).toLocaleString()} Ikan
`

  m.reply(smallFish)
}

handler.help = ['kolam']
handler.tags = ['rpg']
handler.command = /^(kotak(ikan)?|kolam(ikan)?)$/i
handler.register = true
handler.group = true
handler.rpg = true

export default handler