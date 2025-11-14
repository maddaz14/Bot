let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) return m.reply(`🌸 *Contoh: ${usedPrefix + command} username*`)
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        let res = await fetch(`https://api.zenzxz.my.id/api/stalker/roblox?user=${encodeURIComponent(text)}`)
        if (!res.ok) throw new Error('Gagal mengambil data dari API!')
        let json = await res.json()
        let data = json?.data
        if (!data) return m.reply('🍂 *Tidak ditemukan data Roblox untuk user tersebut!*')

        let user = data.basic
        let presence = data.presence?.userPresences?.[0]?.lastLocation || 'Tidak diketahui'
        let social = data.social
        let groups = data.groups?.list?.data?.slice(0, 5) || []

        let caption = `
👾 *[ ROBLOX STALKER RESULT ]*

🪪 *Nama:* ${user.displayName} (@${user.name})
🧩 *User ID:* ${user.id}
📜 *Deskripsi:* ${user.description || 'Tidak ada deskripsi.'}
📆 *Dibuat pada:* ${new Date(user.created).toLocaleString('id-ID')}
🚫 *Diblokir:* ${user.isBanned ? 'Ya' : 'Tidak'}
🌐 *Status:* ${data.status || 'Tidak ada status.'}
📍 *Aktivitas terakhir:* ${presence}

👥 *Sosial Roblox*
   🧑‍🤝‍🧑 *Teman:* ${social.friends.count}
   👣 *Pengikut:* ${social.followers.count}
   🔁 *Mengikuti:* ${social.following.count}

🏷️ *Top Grup yang Diikuti:*
${groups.length ? groups.map((g, i) => `   ${i + 1}. *${g.group.name}* — ${g.role.name}`).join('\n') : '   Tidak ada grup ditemukan.'}
`

        await conn.reply(m.chat, caption.trim(), m)
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
    }
}

handler.help = ['stalkroblox'];
handler.tags = ['tools'];
handler.command = /^(robloxstalk|stalkroblox)$/i;
handler.register = true;

export default handler