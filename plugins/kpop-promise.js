import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // React emoji 🕊️ saat mulai proses
    await conn.sendMessage(m.chat, {
        react: {
            text: '🕊️',
            key: m.key
        }
    })

    let url = promise9[Math.floor(Math.random() * promise9.length)]
    let teks = `\`\`\`➩ Nih! \`\`\``
    await conn.sendFile(m.chat, url, null, teks.trim(), m)
}

handler.tags = ['kpop']
handler.help = ['promise9', 'promise_9']
handler.command = /^(promise_?9)$/i
handler.premium = true

export default handler

global.promise9 = [
    "https://static.wikia.nocookie.net/kpop/images/9/9b/Fromis_9_group_profile_photo_%281%29.png",
    "https://static.wikia.nocookie.net/kpop/images/8/88/Fromis_9_group_profile_photo_%282%29.png",
    "https://static.wikia.nocookie.net/kpop/images/f/f2/Fromis_9_Jang_Gyuri_Lee_Saerom_profile_photo_%281%29.png",
    "https://static.wikia.nocookie.net/kpop/images/3/32/Fromis_9_Jang_Gyuri_Lee_Saerom_profile_photo_%282%29.png",
    "https://static.wikia.nocookie.net/kpop/images/0/04/Fromis_9_Song_Hayoung_Lee_Chaeyoung_profile_photo_%281%29.png",
    "https://static.wikia.nocookie.net/kpop/images/2/29/Fromis_9_Song_Hayoung_Lee_Chaeyoung_profile_photo_%282%29.png",
    "https://static.wikia.nocookie.net/kpop/images/6/67/Fromis_9_Lee_Seoyeon_Roh_Jisun_Park_Jiwon_profile_photo_%281%29.png",
    "https://static.wikia.nocookie.net/kpop/images/3/3b/Fromis_9_Lee_Seoyeon_Roh_Jisun_Park_Jiwon_profile_photo_%282%29.png",
    "https://static.wikia.nocookie.net/kpop/images/1/19/Fromis_9_Baek_Jiheon_Lee_Nagyung_profile_photo_%281%29.png",
    "https://static.wikia.nocookie.net/kpop/images/8/8b/Fromis_9_Baek_Jiheon_Lee_Nagyung_profile_photo_%282%29.png",
]