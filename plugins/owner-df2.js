import { tmpdir } from 'os'
import path, { join } from 'path'
import {
  readdirSync,
  unlinkSync
} from 'fs'

let handler = async (m, { conn, __dirname, args, text, command }) => {
    // Ambil semua file plugin
    let plugins = readdirSync(join(__dirname, '../plugins')).filter(v => v.endsWith('.js'))

    // Mapping plugins ke dalam format dengan nomor
    let listPlugins = plugins.map((v, i) => `${i + 1}. ${v.replace('.js', '')}`).join('\n')
    
    // Jika pengguna hanya mengetik 'df' tanpa argumen, tampilkan daftar plugin
    if (!text) return m.reply(`Daftar plugin:\n\n${listPlugins}\n\nUntuk menghapus, ketik:\n.df <nomor>\nContoh:\n.df 1`)

    // Cek apakah input berupa angka
    let nomor = parseInt(args[0])
    if (isNaN(nomor) || nomor < 1 || nomor > plugins.length) return m.reply(`Nomor tidak valid.\n\n${listPlugins}`)

    // Ambil nama plugin berdasarkan nomor
    let pluginName = plugins[nomor - 1]
    
    // Path file plugin yang akan dihapus
    const file = join(__dirname, '../plugins/' + pluginName)

    // Hapus file plugin
    try {
        unlinkSync(file)
        conn.reply(m.chat, `Berhasil menghapus "plugins/${pluginName}"`, m)
    } catch (e) {
        conn.reply(m.chat, `Gagal menghapus file: ${e.message}`, m)
    }
}

handler.help = ['df2']
handler.tags = ['owner']
handler.command = /^(df2)$/i

handler.mods = true

export default handler