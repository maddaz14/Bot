let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let cooldown = 2 * 60 * 1000; // 2 menit dalam ms
    let last = user.lastmendaki || 0;

    if (new Date - last < cooldown) {
        let sisa = ((cooldown - (new Date - last)) / 1000).toFixed(1);
        return m.reply(`⏳ Kamu lelah! Tunggu ${sisa} detik lagi sebelum mendaki lagi.`);
    }

    // Animasi gunung
    const frames = [
`🏔️
👤
`,
`🏔️
 👤
`,
`🏔️
  👤
`,
`🏔️
   👤
`,
`🏔️
    👤
`,
`🏔️
     👤
`,
`🏔️
      👤
`,
`🏔️
       👤
`,
`🏔️
        🏅
`
    ];

    const ceritaRandom = [
        "Menapaki jalan setapak yang licin...",
        "Angin kencang menerpa wajahmu...",
        "Kaki mulai pegal, tapi semangat masih membara...",
        "Bertemu pendaki lain yang memberi semangat...",
        "Melihat pemandangan indah di kejauhan...",
        "Mendengar suara burung yang merdu...",
        "Merasakan udara yang semakin dingin...",
        "Langkah semakin berat, tapi puncak semakin dekat..."
    ];

    let { key } = await m.reply(`${frames[0]}\n\n${ceritaRandom[Math.floor(Math.random() * ceritaRandom.length)]}`);

    let i = 1;
    let interval = setInterval(async () => {
        if (i >= frames.length) {
            clearInterval(interval);

            // Hadiah
            let moneyReward = 50000;
            let limitReward = 1;
            user.money += moneyReward;
            user.limit += limitReward;
            user.lastmendaki = new Date * 1;

            // Pesan akhir
            let ending = `🏔️🏅 Kamu berhasil mencapai puncak!\n\n💰 +${moneyReward} Money\n📦 +${limitReward} Limit`;
            await conn.relayMessage(m.chat, {
                protocolMessage: {
                    key: key,
                    type: 14,
                    editedMessage: {
                        conversation: ending
                    }
                }
            }, {});
            return;
        }

        let frame = frames[i];
        let cerita = ceritaRandom[Math.floor(Math.random() * ceritaRandom.length)];
        let text = `${frame}\n\n${cerita}`;

        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: key,
                type: 14,
                editedMessage: {
                    conversation: text
                }
            }
        }, {});

        i++;
    }, 1500);
};

handler.help = ['mendaki']
handler.tags = ['rpg']
handler.command = ['mendaki']

export default handler;