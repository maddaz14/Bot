import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  conn.luminai = conn.luminai || {};

  if (!text) throw `*• Contoh:* .luminai *[on/off]*`;

  if (text === "on") {
    if (conn.luminai[m.chat]) {
      clearTimeout(conn.luminai[m.chat].timeout);
    }
    conn.luminai[m.chat] = { user: m.sender, pesan: [], timeout: setTimeout(() => delete conn.luminai[m.chat], 3600000) }; // 1 hour timeout
    m.reply("[ ✓ ] Sesi AI dimulai.");
  } else if (text === "off") {
    if (conn.luminai[m.chat]) {
      clearTimeout(conn.luminai[m.chat].timeout);
      delete conn.luminai[m.chat];
      m.reply("[ ✓ ] Sesi AI diakhiri.");
    } else {
      m.reply("[ ✓ ] Tidak ada sesi AI aktif.");
    }
  }
};

handler.before = async (m, { conn }) => {
  conn.luminai = conn.luminai || {};
  if (m.isBaileys || !m.text || !conn.luminai[m.chat]) return;
  if (/^[.\#!\/\\]/.test(m.text)) return;
  if (m.sender !== conn.luminai[m.chat].user) return; // Hanya izinkan pengguna yang mengaktifkan sesi

  const messages = [...conn.luminai[m.chat].pesan, { role: "system", content: "Kamu adalah AI bernama LuminAI." }, { role: "user", content: m.text }];
  
  await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  try {
    const response = await fetch("https://luminai.my.id/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: m.text, user: m.sender })
    });

    const res = await response.json();
    let result = res.result;

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    result = result.replace(/\*\*/g, '*');
    m.reply(result);
    conn.luminai[m.chat].pesan = messages;
  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
  }
};

handler.command = ['luminai'];
handler.tags = ['ai'];
handler.help = ['luminai *[on/off]*'];

export default handler;