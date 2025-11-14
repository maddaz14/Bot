let handler = async (m, { conn, usedPrefix, command, text }) => {
    let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    if (!target) return m.reply(`Reply atau tag orangnya! \n\nContoh : \n${usedPrefix + command} @${m.sender.split("@")[0]}`, false, { mentions: [m.sender] })
    if (target == m.sender) return m.reply("Tidak bisa kick diri sendiri")
    
    await m.reply("✨🎩 Selamat datang di pertunjukan sulap malam ini! 🎩✨")
    await delay(2000)
    await m.reply("🔮 Hari ini, kita akan melakukan sesuatu yang luar biasa... 🔮")
    await delay(2000)
    await m.reply("🧙‍♂️ Siapkan diri kalian... Perhatikan dengan seksama... 🧙‍♂️")
    await delay(2000)
    await m.reply("✨ Sim Salabim... Menghilangkan yang tak terduga... ✨")
    await delay(2000)
    await m.reply("🎩 Abracadabra... Lihatlah... Sesuatu yang menakjubkan akan terjadi... 🎩")
    await delay(2000)
    await m.reply("🪄 Hocus Pocus... Siap untuk menghilangkan seseorang... 🪄")
    await delay(2000)
    await m.reply("✨ Siap-siap... Semua akan hilang dalam sekejap... ✨")
    await delay(2000)
    await m.reply("🌟 *Dan...!* 🌟")
    await delay(1000)
    await m.reply("💥 *Poof!* Anggota ini menghilang dari grup... 💥")
    await delay(2000)
    
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove')
    await m.reply(`Sukses mengeluarkan @${target.split("@")[0]} dari group! 🧙‍♂️✨`, false, { mentions: [target] })
}

handler.help = ['sulap']
handler.tags = ['group']
handler.command = /^(sulap)$/i
handler.admin = false
handler.group = true
handler.botAdmin = false
handler.owner = true
export default handler

let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))