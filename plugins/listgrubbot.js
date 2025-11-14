import fs from 'fs'

const handler = async (m, { conn }) => {
    const name = m.pushName || 'User'
    const caption = `📚 *Hai ${name}!*\n\nBerikut daftar semua grup yang telah dimasuki oleh *ubed Bot*:\n\nKlik tombol di bawah untuk melihat detailnya.`

    let groups = Object.entries(conn.chats)
        .filter(([id, chat]) => id.endsWith('@g.us') && chat.subject)
        .map(([id, chat]) => ({
            title: chat.subject,
            description: `ID: ${id}`,
            id: `.peraturan ${id}`  // Menggunakan peraturan untuk menangani ID grup
        }))

    if (groups.length === 0) return m.reply('⚠️ Bot belum bergabung di grup manapun.')

    let buttons = [
        {
            buttonId: 'grup_list',
            buttonText: { displayText: '📂 Daftar Grup' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: 'Grup ubed-MD',
                    sections: [
                        {
                            title: 'List Grup Aktif',
                            rows: groups
                        }
                    ]
                })
            }
        }
    ]

    const imgPath = './media/fuxxymd.jpg'
    if (!fs.existsSync(imgPath)) return m.reply("❌ File gambar tidak ditemukan!")

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(imgPath),
        caption,
        buttons,
        headerType: 1
    }, { quoted: m })
}

handler.command = ['listgrup', 'grupbot']
handler.help = ['listgrup']
handler.tags = ['info']

export default handler