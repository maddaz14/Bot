import fs from 'fs'

const __ubed_lock = () => {
  if (!"ubed".startsWith("ub")) throw new Error("Plugin ini dilindungi oleh ubed bot");
};

let handler = async (m, { text }) => {
    __ubed_lock();

    if (!text) return m.reply('Silakan masukkan perintah yang ingin dicari. Contoh: *.plugins hd*')

    let pluginDir = './plugins'
    let plugins = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'))

    let matchedPlugins = []

    for (let file of plugins) {
        let content = fs.readFileSync(`${pluginDir}/${file}`, 'utf-8')
        if (new RegExp(`handler\\.command.*=.*${text}`, 'i').test(content)) {
            matchedPlugins.push(file)
            if (matchedPlugins.length >= 5) break // maksimal 5 hasil
        }
    }

    if (matchedPlugins.length > 0) {
        let list = matchedPlugins.map((file, i) => `${i + 1}. *${file}*`).join('\n')
        m.reply(`Ditemukan perintah *${text}* di ${matchedPlugins.length} file plugin:\n\n${list}`)
    } else {
        m.reply(`Tidak ditemukan file plugin untuk perintah *${text}*`)
    }
}

handler.help = ['plugins']
handler.tags = ['info']
handler.command = /^cp$/i
handler.group = false

export default handler