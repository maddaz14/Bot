import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Pastikan ada kata yang ingin dicari
    if (!text) {
        throw `📚 Hai! Aku bisa mencarikan arti kata dari KBBI.\n\nContoh: *${usedPrefix}${command} hujan*\nAtau *${usedPrefix}${command} cinta*`;
    }

    // Ambil domain dan API Key Maelyn dari global.maelyn di config.js
    const maelynDomain = global.maelyn.domain;
    const maelynApiKey = global.maelyn.key;

    // Lakukan validasi dasar untuk memastikan konfigurasi ada
    if (!maelynDomain || !maelynApiKey) {
        throw 'API Key atau Domain Maelyn belum diatur di config.js! Mohon hubungi pemilik bot.';
    }

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } }); // Reaksi loading

    try {
        // Encode query untuk keamanan URL
        const encodedQuery = encodeURIComponent(text);

        // Bangun URL API
        const apiUrl = `${maelynDomain}/api/kbbi?q=${encodedQuery}&apikey=${maelynApiKey}`;

        // Kirim permintaan GET ke Maelyn API
        const response = await axios.get(apiUrl);
        const { status, result, code } = response.data;

        if (status === 'Success' && code === 200 && result?.description) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

            let replyText = `📚 *KBBI - Kata: ${result.baseWord || text}*\n\n`;
            replyText += result.description;

            // Tambahkan kata terkait jika ada
            if (result.relatedWords && result.relatedWords.length > 0) {
                replyText += `\n\n*Kata Terkait:*\n${result.relatedWords.join(', ')}`;
            }

            m.reply(replyText);
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi gagal
            m.reply(`❌ Tidak dapat menemukan definisi untuk kata "${text}" di KBBI. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
        m.reply(`Terjadi kesalahan saat menghubungi KBBI API: ${e.message}`);
    }
};

handler.help = ['kbbi', 'artikata'];
handler.tags = ['info'];
handler.command = /^(kbbi|artikata)$/i;
handler.limit = true; // Batasi penggunaan jika perlu
handler.premium = false; // Hanya untuk pengguna non-premium jika perlu

export default handler;