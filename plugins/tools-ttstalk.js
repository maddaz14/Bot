import axios from 'axios'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `• *Example:* ${usedPrefix + command} obet2407`
    let username = args[0]

    // React emoji
    await conn.sendMessage(m.chat, {
        react: {
            text: "🎵",
            key: m.key
        }
    })

    try {
        let hasil = await ttstalk(username)
        if (!hasil.status) throw 'Gagal mengambil data TikTok'

        let profile = hasil.profile
        let videos = hasil.videos

        let caption = `┌─⭓「 *TikTok Stalker* 」\n` +
                      `│ *• Username:* ${username}\n` +
                      `│ *• Followers:* ${profile.followers}\n` +
                      `│ *• Following:* ${profile.following}\n` +
                      `│ *• Likes:* ${profile.likes}\n` +
                      `└───────────────⭓\n\n`

        caption += `🎬 *10 Video Terbaru:*\n`
        videos.forEach((v, i) => {
            caption += `\n${i+1}. ${v.desc || '-'}\n` +
                       `    🎼 ${v.music} - ${v.musicAuthor}\n` +
                       `    ❤️ ${v.likeCount}   ▶️ ${v.playCount}\n` +
                       `    🔗 https://www.tiktok.com/@${username}/video/${v.id}\n`
        })

        await conn.sendFile(m.chat, profile.avatar, 'avatar.jpg', caption, m)
    } catch (err) {
        m.reply(`❌ Error: ${err.message || err}`)
    }
}

handler.help = ['ttstalk'].map(v => v + ' <username>')
handler.tags = ['tools']
handler.command = /^ttstalk$/i
export default handler

async function ttstalk(username) {
    try {
        const headers = {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'id-ID,id;q=0.9',
            'content-type': 'application/json',
            'origin': 'https://tokviewer.net',
            'referer': 'https://tokviewer.net/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 13; Mobile) Chrome/116.0.0.0 Safari/537.36'
        };

        const profileRes = await axios.post('https://tokviewer.net/api/check-profile', { username }, { headers });
        const videoRes = await axios.post('https://tokviewer.net/api/video', { username, offset: Date.now(), limit: 10 }, { headers });

        const rawProfile = profileRes.data?.data || {};
        const profile = {
            avatar: rawProfile.avatar,
            followers: rawProfile.followers,
            following: rawProfile.following,
            likes: rawProfile.likes
        };

        const rawVideos = videoRes.data?.data || [];
        const videos = rawVideos.map(v => ({
            id: v.aweme_id,
            desc: v.desc,
            cover: v.video?.cover?.url_list?.[0] || null,
            playCount: v.statistics?.play_count || 0,
            likeCount: v.statistics?.digg_count || 0,
            music: v.music?.title || '-',
            musicAuthor: v.music?.author || '-'
        }));

        return { status: true, profile, videos };
    } catch (err) {
        return { status: false, error: err.message || err }
    }
}