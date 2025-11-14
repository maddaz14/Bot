import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // Ambil foto profil pengguna
        let userPP = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg');

        const url = `https://api.ubed.my.id/sticker/among?apikey=alhamdulilah&url=${encodeURIComponent(userPP)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By',
            author: 'ubed Bot',
            type: 'image/png',
        });

        const stickerBuffer = await sticker.toBuffer();
        let sentMsg = await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '🎮', key: sentMsg.key } });
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, 'Gagal membuat stiker Among Us. Coba lagi nanti.', m);
    }
};

handler.help = ['among'];
handler.tags = ['sticker'];
handler.command = /^among$/i;
handler.limit = 5;
handler.register = true;

export default handler;