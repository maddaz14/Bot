let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

let handler = async (m, { conn, text, isOwner }) => {
    try {
        let [_, code] = text.match(linkRegex) || []
        if (!code) throw 'Link tidak valid'
        
        // Coba bergabung ke grup menggunakan kode link
        await conn.groupAcceptInvite(code)
        m.reply(`Berhasil bergabung ke grup.`)
    } catch (e) {
        // Menangani error jika terjadi kesalahan
        m.reply(`Terjadi kesalahan: ${e}`)
    }
}

handler.help = ['join']
handler.tags = ['owner']
handler.command = /^join$/i
handler.rowner = true

export default handler