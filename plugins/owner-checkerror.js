import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    let pluginFolder = './plugins'
    let errorList = []

    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ Folder plugins tidak ditemukan!')
    }

    let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'))

    for (let file of files) {
        try {
            // kasih query random biar selalu reload (bypass cache)
            await import(`file://${path.resolve(pluginFolder, file)}?update=${Date.now()}`)
        } catch (err) {
            errorList.push(`❌ ${file}: ${err.message}`)
        }
    }

    if (errorList.length === 0) {
        m.reply('✅ Semua fitur aman, tidak ada error!')
    } else {
        m.reply(`🚨 Ditemukan ${errorList.length} error pada fitur:\n\n` + errorList.join('\n'))
    }
}

handler.help = ['checkerror']
handler.tags = ['owner']
handler.command = /^checkerror$/i
handler.rowner = true

export default handler