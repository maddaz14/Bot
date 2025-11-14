import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const page = 1; // Page dikunci ke 1 (tidak pakai args)

  const maelynDomain = global.maelyn?.domain;
  const maelynApiKey = global.maelyn?.key;

  if (!maelynDomain || !maelynApiKey) {
    return m.reply("❌ *API Key atau Domain Maelyn belum diatur!*");
  }

  // Kirim emoji reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '🍏',
      key: m.key
    }
  });

  const endpoint = `${maelynDomain}/api/nekopoi/3dhentai?page=${page}`;

  await global.loading(m, conn);

  try {
    const res = await fetch(endpoint, {
      headers: {
        "mg-apikey": maelynApiKey
      }
    });

    if (!res.ok) throw new Error("Gagal menghubungi API Maelyn!");

    const data = await res.json();
    const resultData = data.result;

    if (!resultData?.result?.length) return m.reply("❌ *Tidak ada data pada halaman ini!*");

    const list = resultData.result.map((item, i) => `*${i + 1}.* ${item.title}`).join("\n");

    const sections = [
      {
        title: `📺 Pilih Konten (Page 1)`,
        rows: resultData.result.map((item, index) => ({
          title: item.title,
          description: `🗓️ ${item.date}`,
          id: `.3dh ${item.slug}` // Handler detail terpisah
        }))
      }
    ];

    await conn.sendMessage(m.chat, {
      text: `📂 *Daftar Video 3D Hentai*\n\n${list}`,
      footer: `Page 1/${resultData.totalPages} • Powered by Maelyn API`,
      title: "Nekopoi 3D Hentai",
      buttonText: "📌 Pilih Judul",
      sections
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(`❌ *Terjadi kesalahan saat mengambil data!*\n\n🪵 *Log:* ${err.message || err}`);
  } finally {
    await global.loading(m, conn, true);
  }
};

handler.help = ["3dhentai"];
handler.tags = ["nsfw"];
handler.command = /^(3dhentai)$/i;
handler.limit = true;
handler.premium = true;
handler.register = true;

export default handler;