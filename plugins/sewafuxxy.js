let handler = async (m, { conn }) => {
  const slides = [
    {
      desc: '1 MINGGU : 10.000 IDR',
      amount: 10000000
    },
    {
      desc: '1 BULAN : 15.000 IDR',
      amount: 15000000
    },
    {
      desc: '2 BULAN : 20.000 IDR',
      amount: 20000000
    },
    {
      desc: '4 BULAN : 30.000 IDR',
      amount: 30000000
    },
    {
      desc: '1 TAHUN : 35.000 IDR',
      amount: 35000000
    }
  ];

  const closingMessage = `
Terimakasih sudah setia bersama ubed bot🍏
Promo Berlaku dari tanggal 15 Sampai 25 April 2025`;

  for (let slide of slides) {
    const textSlide = `
*▧──── 「 S E W A  U B E D 」*
*│*
*│ ∘ ${slide.desc}*
*│*
*╰────────────━*`;

    await conn.relayMessage(m.chat, {
      requestPaymentMessage: {
        currencyCodeIso4217: 'IDR',
        amount1000: slide.amount,
        requestFrom: m.sender,
        noteMessage: {
          extendedTextMessage: {
            text: textSlide,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
              },
            },
          },
        },
      },
    }, {});
  }

  await conn.sendMessage(m.chat, {
    text: closingMessage,
  });
};

handler.help = ['sewafuxxy'];
handler.tags = ['info'];
handler.command = /^(sewafuxxy)$/i;

export default handler;