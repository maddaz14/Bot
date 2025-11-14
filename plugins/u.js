const handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, {
        video: { url: 'https://files.catbox.moe/pxyhx6.mp4' },
        gifPlayback: true,
        caption: 'Nih video spesial 😎',
        ptv: true
    }, { quoted: m })
}

handler.customPrefix = /^(😎)$/i
handler.command = new RegExp()

export default handler