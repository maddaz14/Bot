let handler = async (m, { conn }) => {
    let plugins = Object.values(global.plugins).map(plugin => plugin.command).filter(cmd => cmd).flat()

    let listCommands = plugins.map((cmd, index) => `${index + 1}. ${Array.isArray(cmd) ? cmd.join(', ') : cmd}`).join('\n')

    let message = `
*📌 DAFTAR COMMAND BOT*

${listCommands}

➤ *Info:* Jika dalam (kurung) berarti memiliki alias.
`.trim()

    conn.reply(m.chat, message, null)
}

handler.help = ['listcmd']
handler.tags = ['cmd']
handler.command = ['listcmd']

export default handler