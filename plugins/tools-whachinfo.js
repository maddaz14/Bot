import axios from 'axios';
import * as cheerio from "cheerio";

const handler = async (m, { text, args, usedPrefix, command }) => {
    const input = text || args[0];
    if (!input || !input.includes('whatsapp.com/channel/')) {
        throw `❌ Masukkan link channel WhatsApp!\n\nContoh:\n${usedPrefix + command} https://whatsapp.com/channel/0029VbAeDDDL7UVUJ10izu3i`;
    }

    try {
        const { nama, desc } = await getChannelInfo(input);

        await m.reply(
            `*「 WHATSAPP CHANNEL INFO 」*\n\n` +
            `📌 *Nama Channel:* ${nama || '-'}\n` +
            `📝 *Deskripsi:* ${desc || '-'}\n` +
            `🔗 *Link:* ${input}`
        );
    } catch (err) {
        console.error(err);
        throw '❌ Gagal mengambil informasi channel WhatsApp!';
    }
};

const getChannelInfo = async (url) => {
    try {
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        const nama = $('._9vd5._9t2_').text().trim();
        const desc = $('._9vd5._9scb').text().trim();

        return { nama, desc };
    } catch (err) {
        console.error(err);
        throw err;
    }
};

handler.help = ['whachinfo <link_channel>'];
handler.tags = ['tools'];
handler.command = /^whachinfo$/i;

export default handler;