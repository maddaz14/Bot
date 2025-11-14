import axios from 'axios';

const userAgent = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36';

const freepik = {
  search: async (q) => {
    const { data } = await axios.get(`https://www.freepik.com/api/regular/search?filters[ai-generated][excluded]=1&filters[content_type]=photo&locale=en&page=${Math.floor(Math.random() * 100) + 1}&term=${q}`, {
      headers: { 'user-agent': userAgent }
    });
    return data.items.map(res => ({
      title: res.name,
      is_premium: res.premium,
      is_aigenerated: res.isAIGenerated,
      author: res.author?.name,
      preview: res.preview?.url,
      url: res.url
    }));
  },

  detail: async (url) => {
    const id = url.match(/_(\d+)\.htm$/)?.[1];
    if (!id) throw '❌ URL tidak valid!';
    const { data } = await axios.get(`https://www.freepik.com/api/resources/${id}?locale=en`, {
      headers: { 'user-agent': userAgent }
    });
    const d = new Date(data.created);
    return {
      title: data.name,
      mimetype: data.encodingFormat,
      is_premium: data.premium,
      is_aigenerated: data.isAIGenerated,
      tags: data.relatedTags.map(tag => tag.name).join(', '),
      author: data.author.name,
      preview: data.preview.url,
      created: `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
      license: data.license
    };
  },

  download: async (url) => {
    const id = url.match(/_(\d+)\.htm$/)?.[1];
    if (!id) throw '❌ URL tidak valid!';
    const { data } = await axios.get(`https://www.freepik.com/api/regular/download?resource=${id}&action=download&locale=en`, {
      headers: { 'user-agent': userAgent }
    });
    return data;
  }
};

const handler = async (m, { command, args }) => {
  const q = args.join(' ');
  if (!q) return m.reply(`Masukkan kata kunci atau URL!\n\nContoh:\n.freepik kucing\n.freepikdetail <url>\n.freepikdl <url>`);

  try {
    if (command === 'freepik') {
      const res = await freepik.search(q);
      if (!res.length) return m.reply('Tidak ditemukan hasil.');
      const teks = res.map((v, i) => `${i + 1}. ${v.title}\n🔗 ${v.url}\n📸 ${v.preview}`).join('\n\n');
      m.reply(teks);
    } else if (command === 'freepikdetail') {
      const res = await freepik.detail(q);
      const teks = `📄 *${res.title}*\n📅 ${res.created}\n🔖 Tags: ${res.tags}\n👤 Author: ${res.author}\n🔗 Preview: ${res.preview}\n📜 License: ${res.license}`;
      m.reply(teks);
    } else if (command === 'freepikdl') {
      const res = await freepik.download(q);
      if (!res.url) return m.reply('❌ Gagal mendapatkan link download.');
      m.reply(`✅ Link download:\n${res.url}`);
    }
  } catch (e) {
    console.error(e);
    m.reply(typeof e === 'string' ? e : 'Terjadi kesalahan saat memproses permintaan.');
  }
};

handler.help = ['freepik <query>', 'freepikdetail <url>', 'freepikdl <url>'];
handler.tags = ['internet'];
handler.command = /^freepik(detail|dl)?$/i;

export default handler;