const handler = async (m, { conn, text, args }) => {
  try {
    if (args.length < 2) throw 'Masukkan 2 teks!\n\nContoh: .cutegravity LoL Human';

    const text1 = args[0];
    const text2 = args.slice(1).join(" ");

    await conn.sendMessage(m.chat, { react: { text: '🌌', key: m.key } });

    const res = await fetch(`https://api.lolhuman.xyz/api/ephoto2/cutegravity?apikey=ubed2407&text1=${encodeURIComponent(text1)}&text2=${encodeURIComponent(text2)}`);
    const buffer = await res.arrayBuffer();

    await conn.sendMessage(m.chat, {
      image: Buffer.from(buffer),
      caption: 'Dibuat oleh ubed Bot'
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['gravity2 <text1> <text2>'];
handler.tags = ['ephoto'];
handler.command = ['gravity2'];
handler.limit = true;

export default handler;