import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // React 🕊️ saat mulai proses
    await conn.sendMessage(m.chat, {
        react: {
            text: '🕊️',
            key: m.key
        }
    })

    let url = saerom[Math.floor(Math.random() * saerom.length)]
    let teks = `\`\`\`➩ Nih foto Saerom!\`\`\``
    await conn.sendFile(m.chat, url, null, teks.trim(), m)
}

handler.tags = ['kpop']
handler.help = ['saerom']
handler.command = /^(saerom)$/i
handler.premium = true

export default handler

global.saerom = [
    "https://static.wikia.nocookie.net/fromis9/images/c/c4/SaeromGlassShoes.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/7/7f/SaeromGlassShoes2.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/8/8a/SaeromToHeart.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/a/a4/SaeromToHeart2.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/8/87/SaeromToDay.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/3/3c/SaeromLoveBomb.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/6/69/SaeromFunFactoryFACTORYVer.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/3/37/Saerom_Japanese_Debut_Album_Teaser.jpg",
    "https://static.wikia.nocookie.net/fromis9/images/6/65/Fromis_9_My_Little_Society_Saerom_1.jpg"
]