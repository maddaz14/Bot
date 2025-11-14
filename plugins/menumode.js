import fs from 'fs'

const handler = async (m, { conn, args, usedPrefix }) => { // Tambahkan 'args' dan 'usedPrefix'
    // Pastikan hanya owner yang bisa menggunakan perintah ini
    // Logika owner sudah ada di handler.owner = true
    if (!global.db.data.settings) global.db.data.settings = {}
    if (!global.db.data.settings['default']) global.db.data.settings['default'] = {}

    const setting = global.db.data.settings['default']
    const name = m.pushName || 'User'

    const validModes = ['button', 'text', 'gambar', 'gif'] // Tambahkan 'gambar'

    // --- Logika untuk mengubah mode ---
    if (args[0]) {
        let newMode = args[0].toLowerCase()

        // Hapus prefix dari mode jika ada (misal: '.menumode button' -> 'button')
        if (newMode.startsWith('.menumode ')) {
            newMode = newMode.replace('.menumode ', '')
        }

        if (validModes.includes(newMode)) {
            // Perbarui mode menu di database
            setting.menuMode = newMode

            // TODO: Pastikan database kamu disimpan ke penyimpanan persisten setelah perubahan
            // Contoh untuk database.json:
            // fs.writeFileSync('./database.json', JSON.stringify(global.db.data, null, 2))
            // Sesuaikan dengan metode penyimpanan database bot kamu

            return m.reply(`✅ Mode menu berhasil diatur ke *${newMode.toUpperCase()}*.`)
        } else {
            return m.reply(`❌ Mode tidak valid: *${newMode}*. Pilihan yang tersedia: ${validModes.join(', ')}`)
        }
    }
    // --- Akhir Logika untuk mengubah mode ---


    const caption = `⚙️ *Hai ${name}!*\n\nBerikut pilihan mode tampilan menu di *ubed-MD*:\n\nKlik salah satu opsi di bawah untuk mengganti mode tampilan menu.`

    const listMode = ['button', 'text', 'gambar', 'gif'] // Sesuaikan jika ada mode baru, misal 'image' menjadi 'gambar'

    const rows = listMode.map(mode => ({
        title: mode.toUpperCase(),
        description: `Ubah menu menjadi mode ${mode}`,
        id: `.menumode ${mode}` // Pastikan id ini sesuai dengan command dan argumen
    }))

    // Periksa apakah ada tombol atau hanya ingin menampilkan list
    const buttons = [
        {
            buttonId: 'menumode_list',
            buttonText: { displayText: '⚙️ Pilih Mode Menu' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: 'Mode Menu Bot',
                    sections: [
                        {
                            title: 'Pilih Tampilan Menu',
                            rows
                        }
                    ]
                })
            }
        }
    ]

    const imgPath = './media/fuxxymd.jpg' // Ganti sesuai path gambar kamu
    if (!fs.existsSync(imgPath)) return m.reply('❌ File gambar tidak ditemukan!')

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(imgPath),
        caption,
        buttons,
        headerType: 1
    }, { quoted: m })
}

handler.command = ['menumode']
handler.tags = ['owner']
handler.help = ['menumode']
handler.owner = true

export default handler