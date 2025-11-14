import fs from 'fs/promises'

let handler = async (m, { conn, isROwner, text }) => {
    await conn.sendMessage(m.chat, { react: { text: '🕓', key: m.key } });
    if (!isROwner) return

    let ar = Object.keys(plugins)
    let ar1 = ar.map(v => v.replace('.js', ''))

    if (!text) throw `Nama Pluginnya??`
    if (!ar1.includes(text)) return m.reply(`*Tidak Di Temukan*\n\n${ar1.map(v => ' ' + v).join`\n`}`)

    try {
        let filePath = `plugins/${text}.js`
        let fileBuffer = await fs.readFile(filePath)
        
        // Send the file as a document
        await conn.sendMessage(m.chat, { document: fileBuffer, mimetype: 'application/javascript', fileName: `${text}.js` })

         await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (e) {
        m.reply(`Gagal membaca file: ${e.message}`)
    }
}

handler.help = ['gp2 <Versi File>']
handler.tags = ['owner']
handler.command = /^(gp2)$/i
handler.rowner = true

export default handler