import fs from 'fs'

let handler = async (m, { conn }) => {
    // Pengumuman fitur dinonaktifkan sementara
    let announcement = `
📢 **Pengumuman!**

🛑 Fitur **.genshin** saat ini **DINONAKTIFKAN SEMENTARA** oleh owner. 
Hal ini disebabkan karena penggunaan CPU yang hampir mencapai batas maksimal, 
dan kami sedang melakukan perbaikan untuk menghindari kerusakan lebih lanjut.

⚙️ Kami akan memberikan pembaruan segera setelah perbaikan selesai.

🙏 Mohon maaf atas ketidaknyamanan ini dan terima kasih atas pengertiannya.

Stay tuned!`

    // Mengirimkan pengumuman ke pengguna
    m.reply(announcement)
}

handler.help = ['genshin']
handler.tags = ['info']
handler.command = /^(genshin)$/i

export default handler