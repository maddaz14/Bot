import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    const imageUrl = 'https://files.catbox.moe/xxzzyv.jpg';
    const imageBuffer = await fetch(imageUrl).then(res => res.buffer());

    const productMessage = {
      product: {
        productImage: { url: imageUrl },
        title: 'ubed Bot',
        description: `
          WhatsApp Bot dengan fitur terlengkap
          **Harga Sewa ubed Bot:**
          - 1 Bulan: IDR 20.000
          - 2 Bulan: IDR 35.000
          - 1 Tahun: IDR 45.000
          - Permanen: IDR 60.000
        `,
        currencyCode: 'IDR',
        priceAmount1000: 20000000, // 20.000 K = 20 juta (karena 1000x lipat)
        retailerId: 'UbedBotOfficial',
        productImageCount: 1
      },
      businessOwnerJid: conn.user.jid
    };

    await conn.sendMessage(m.chat, productMessage, { quoted: m });
  } catch (e) {
    console.error(e);
    m.reply('❌ Gagal mengirim katalog: ' + e.message);
  }
};

handler.help = ['katalog'];
handler.tags = ['store'];
handler.command = /^katalog$/i;

export default handler;