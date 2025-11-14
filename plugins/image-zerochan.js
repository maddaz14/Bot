import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Hai! Aku bisa mencarikan gambar dari Zerochan.\n\nContoh: *${usedPrefix}${command} Kurodate Haruna*\nAtau *${usedPrefix}${command} Anime Girl*`;
    }

    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

    try {
        const encodedQuery = encodeURIComponent(text);
        const apiUrl = `${maelynDomain}/api/zerochan?q=${encodedQuery}&apikey=${maelynApiKey}`;

        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result?.itemList && result.itemList.length > 0) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            let replyText = `*Gambar dari Zerochan untuk "${text}"*\n\n`;

            for (const item of result.itemList.slice(0, 3)) { // Limit to 3 images
                replyText += `*Nama:* ${item.name || 'Tidak Diketahui'}\n`;
                replyText += `*URL:* ${item.url}\n\n`;

                try {
                    await conn.sendMessage(m.chat, { image: { url: item.url }, caption: replyText }, { quoted: m });
                    replyText = ''; // Clear caption for subsequent images
                } catch (imgError) {
                    console.error(`Gagal mengirim gambar Zerochan (${item.url}):`, imgError);
                    conn.reply(m.chat, `⚠️ Gagal mengirim salah satu gambar dari Zerochan.`, m);
                }
            }

        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply(`❌ Tidak dapat menemukan gambar untuk "${text}" di Zerochan. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Terjadi kesalahan saat menghubungi Zerochan API: ${e.message}`);
    }
};

handler.help = ['zerochan'];
handler.tags = ['image', 'anime'];
handler.command = /^(zerochan)$/i;
handler.limit = true;
handler.premium = false;

export default handler;