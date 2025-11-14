import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) throw `Contoh penggunaan: *${usedPrefix + command} <username/ID channel>*\nContoh: *${usedPrefix + command} PewDiePie*`;

    await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

    const apiKey = 'AIzaSyCUZO8fjmLsVuS3RR1iuq9SNKRihdp1YvE'; // Ganti dengan API Key Anda
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(text)}&type=channel&key=${apiKey}`;

    try {
        // Cari channel berdasarkan username atau nama
        const searchResponse = await axios.get(searchUrl);
        const channel = searchResponse.data.items[0];

        if (!channel) throw `Channel tidak ditemukan.`;

        const channelId = channel.snippet.channelId;
        const channelUrl = `https://www.youtube.com/channel/${channelId}`;
        const channelName = channel.snippet.channelTitle;
        const channelDescription = channel.snippet.description || 'Tidak ada deskripsi.';
        const thumbnail = channel.snippet.thumbnails.high.url;

        // Ambil informasi detail channel (subscriber count, video count, dll.)
        const channelInfoUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
        const channelInfoResponse = await axios.get(channelInfoUrl);
        const channelInfo = channelInfoResponse.data.items[0];

        if (!channelInfo) throw `Tidak dapat mengambil informasi channel.`;

        const subscriberCount = parseInt(channelInfo.statistics.subscriberCount).toLocaleString();
        const videoCount = parseInt(channelInfo.statistics.videoCount).toLocaleString();
        const viewCount = parseInt(channelInfo.statistics.viewCount).toLocaleString();

        // Format pesan
        const message = `
📺 *YouTube Channel Stalker* 📺

🔍 *Nama Channel*: ${channelName}
📝 *Deskripsi*: ${channelDescription}
👥 *Subscriber*: ${subscriberCount}
🎥 *Total Video*: ${videoCount}
👀 *Total View*: ${viewCount}
🔗 *Link Channel*: ${channelUrl}
        `;

        // Kirim pesan dengan thumbnail
        await conn.sendMessage(
            m.chat,
            {
                image: { url: thumbnail },
                caption: message,
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    } catch (err) {
        throw `Terjadi kesalahan: ${err.message}`;
    }
};

handler.help = ['stalkyt <username/ID channel>'];
handler.tags = ['tools'];
handler.command = /^(stalkyt|stalkyoutube|ytstalk|youtubestalk)$/i;
handler.limit = true;
handler.register = true;

export default handler;