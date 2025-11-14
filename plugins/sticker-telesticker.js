import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

// Fungsi global loading dengan reaction 🍏
global.loading = async (m, conn, end = false) => {
  if (!end) {
    return conn.sendMessage(m.chat, {
      react: {
        text: '🍏',
        key: m.key
      }
    });
  }
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`❌ *Masukkan link sticker Telegram!* Contoh: ${usedPrefix + command} https://t.me/addstickers/kangcomotv3`);
  }

  const url = args[0].split('|')[0].trim();
  let count = args[0].split('|')[1]?.trim();

  // Validasi URL Telegram sticker
  const urlRegex = /(t\.me\/addstickers\/|t\.me\/sticker\S+)/i;
  if (!urlRegex.test(url)) {
    return m.reply("❌ *Link tidak valid!* Masukkan link sticker Telegram yang benar.");
  }

  await global.loading(m, conn);

  const apiEndpoint = `https://api.ryzumi.vip/api/image/sticker-tele?url=${encodeURIComponent(url)}`;

  try {
    const { data } = await axios.get(apiEndpoint);

    if (!data || !data.stickers || !data.stickers.stickers.length) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply("❌ *Gagal mengambil data sticker.* Mungkin link tidak valid atau server API bermasalah.");
    }

    const stickerPack = data.stickers.stickers;
    const totalStickers = stickerPack.length;
    
    // Jika user tidak memasukkan jumlah stiker
    if (!count) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply(`*Total sticker pack ini ada ${totalStickers} sticker.*\n\nMohon ulangi dengan format: *${usedPrefix + command} ${url} | <jumlah>*`);
    }

    count = parseInt(count);

    if (isNaN(count) || count <= 0) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply("❌ *Jumlah sticker harus berupa angka positif!*");
    }

    if (count > totalStickers) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply(`❌ *Jumlah yang diminta (${count}) melebihi total sticker yang tersedia (${totalStickers}).*`);
    }

    const stickersToDownload = stickerPack.slice(0, count);
    const isAnimated = stickersToDownload[0]?.is_animated;

    await conn.reply(m.chat, `✅ *Mengirim ${stickersToDownload.length} sticker dari pack ${data.stickers.name}...*`, m);

    for (const stickerData of stickersToDownload) {
      try {
        const { data: bufferData } = await axios.get(stickerData.image_url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(bufferData, 'binary');

        const waSticker = new Sticker(buffer, {
          pack: data.stickers.name || 'Telegram Stickers',
          author: conn.user.name,
          animated: isAnimated,
          type: isAnimated ? 'animated' : 'default'
        });

        const stickerBuffer = await waSticker.toBuffer();
        await conn.sendMessage(m.chat, { sticker: stickerBuffer });

      } catch (e) {
        console.error(`Gagal mengirim sticker dari URL: ${stickerData.image_url}`, e);
        // Lanjutkan ke sticker berikutnya jika gagal
      }
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply(`❌ *Terjadi kesalahan saat memproses permintaan!* Log: ${e.message}`);
  } finally {
    await global.loading(m, conn, true);
  }
};

handler.help = ['stickertele <link>|<jumlah>', 'telestick <link>|<jumlah>', 'tele <link>|<jumlah>'];
handler.tags = ['sticker'];
handler.command = /^(stickertele|stikertele|telestick|tele)$/i;
handler.limit = true;

export default handler;