let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Objek fkontak untuk tampilan pesan yang dikutip
  const fkontak = {
      "key": {
          "participant": '0@s.whatsapp.net',
          "remoteJid": "0@s.whatsapp.net",
          "fromMe": false,
          "id": "Halo",
      },
      "message": {
          "conversation": `💖 Cek ID Grup/Channel ${global.namebot || 'Bot'} ✨`,
      }
  };

  try {
    // Validasi input link
    if (!text) {
      return conn.reply(m.chat, `🌸 Halo Kak! Mau cek info grup atau channel apa nih? ✨\n\nContoh:\n*${usedPrefix + command} https://chat.whatsapp.com/namagrup*\n*${usedPrefix + command} https://whatsapp.com/channel/idchannelmu*\n\nYuk, biar aku bantu cek ID-nya! 🌷`, m, { quoted: fkontak });
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } }); // Reaksi mencari

    const hiasan = "✨═━═━═━═━═━═━═━═━═━═✨\n";
    const garis = "➖️➖️➖️➖️➖️➖️➖️➖️➖️➖️\n";

    let interactiveMessage;

    if (text.includes("https://chat.whatsapp.com/")) {
      // Cek info grup
      let inviteCode = text.split("https://chat.whatsapp.com/")[1];
      let res = await conn.groupGetInviteInfo(inviteCode);
      let teks = `${hiasan}💖 *INFO GRUP CANTIK!* 💖\n${garis}` +
                 `🆔 *ID:* ${res.id}\n` +
                 `📝 *Nama:* ${res.subject}\n` +
                 `🍏 *Admin:* ${res.participants.filter(p => p.admin).length}\n` +
                 `🌷 *Total Member:* ${res.participants.length}\n` +
                 `🔒 *Privasi:* ${res.announce ? "Tertutup" : "Terbuka"}\n${garis}` +
                 `© ${global.namebot || 'Bot'} 2025 ✨`;

      // Menggunakan proto.Message.InteractiveMessage.create secara implisit
      interactiveMessage = {
        interactiveMessage: {
          body: { text: teks },
          footer: { text: `By ${global.namebot || 'Bot'} ✨` },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin ID Grup",
                  copy_code: res.id
                })
              }
            ]
          }
        }
      };

    } else if (text.includes("https://whatsapp.com/channel/")) {
      // Cek info channel
      let channelId = text.split("https://whatsapp.com/channel/")[1];
      let res = await conn.newsletterMetadata("invite", channelId);
      let teks = `${hiasan}💖 *INFO CHANNEL CANTIK!* 💖\n${garis}` +
                 `🆔 *ID:* ${res.id}\n` +
                 `📝 *Nama:* ${res.name}\n` +
                 `👥 *Pengikut:* ${res.subscribers}\n` +
                 `📌 *Status:* ${res.state}\n` +
                 `✔️ *Verifikasi:* ${res.verification === "VERIFIED" ? "Terverifikasi" : "Tidak"}\n${garis}` +
                 `© ${global.namebot || 'Bot'} 2025 ✨`;

      // Menggunakan proto.Message.InteractiveMessage.create secara implisit
      interactiveMessage = {
        interactiveMessage: {
          body: { text: teks },
          footer: { text: `By ${global.namebot || 'Bot'} ✨` },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "📋 Salin ID Channel",
                  copy_code: res.id
                })
              }
            ]
          }
        }
      };

    } else {
      return conn.reply(m.chat, `❌ Aduh, Kak! Format link tidak valid. 😥 Mohon masukkan link *grup* atau *saluran WhatsApp* yang benar ya! 🌷`, m, { quoted: fkontak });
    }

    // Mengirim pesan Interactive Message sebagai viewOnceMessage
    await conn.relayMessage(
      m.chat,
      { viewOnceMessage: { message: interactiveMessage } },
      { quoted: fkontak } // fkontak sebagai quoted message
    );

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Reaksi sukses

  } catch (err) {
    console.error('Error in cekid handler:', err);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Reaksi error
    await conn.reply(m.chat, `❌ Aduh, Kak! Terjadi kesalahan saat mengambil data. 😥\n\n*Detail Error:* ${err.message || err}\n\nCoba lagi nanti ya! 🌷\n\n> © ${global.namebot || 'Bot'} 2025 ✨`, m, { quoted: fkontak });
  }
};

handler.help = ["cekid <link>"];
handler.tags = ["tools"];
handler.command = /^(cekid|id)$/i;
handler.register = true;

module.exports = handler;