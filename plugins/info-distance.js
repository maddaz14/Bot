import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (args.length < 2) {
        throw `Contoh penggunaan:\n${usedPrefix}${command} Jakarta Bandung`;
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '✈️', key: m.key } });

        const from = args[0];
        const to = args.slice(1).join(' ');

        const apiUrl = `https://obet-rest-api.vercel.app/info/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&apikey=ubed2407`;

        const { data } = await axios.get(apiUrl);

        if (!data.status) throw '❌ Gagal mendapatkan jarak.';

        const result = data.result;
        const caption = `✈️ *Jarak antara* _${from}_ *dan* _${to}_:\n\n` +
                        `• *Distance:* ${result.distance}\n\n` +
                        `• *Deskripsi:*\n${result.description}`;

        await conn.sendMessage(m.chat, {
            text: caption,
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '❌ Terjadi kesalahan saat mengambil jarak.', m);
    }
};

handler.help = ['distance <kota_asal> <kota_tujuan>'];
handler.tags = ['info', 'tools'];
handler.command = /^distance$/i;
handler.limit = 3;
handler.register = true;
handler.premium = false;

export default handler;