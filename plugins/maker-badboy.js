const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw 'Masukkan nama, contoh: *.badboy ubed*';

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const name = encodeURIComponent(args.join(' '));
    const imageUrl = `https://api.lolhuman.xyz/api/badboy?apikey=ubed2407&name=${name}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Badboy oleh ubed Bot'
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['badboy <nama>'];
handler.tags = ['maker'];
handler.command = ['badboy'];
handler.limit = true;

export default handler;