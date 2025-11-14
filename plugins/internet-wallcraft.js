import axios from 'axios';
import chalk from 'chalk';

const wallcraft = {
  search: async (query) => {
    const config = {
      method: 'GET',
      url: `https://api-uc.wallpaperscraft.com/images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&limit=60&types%5B%5D=free&types%5B%5D=private&offset=0&query=${encodeURIComponent(query)}&cost_variant=android_cost_1&sort=rating&uploader_types%5B%5D=wlc&uploader_types%5B%5D=user&uploader_types%5B%5D=wlc_ai_art`,
      headers: {
        'User-Agent': 'wallpaperscraft-android/3.56.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'X-APP-VERSION': 'Android-35600',
        'X-AppCheck-Token': ''
      }
    };
    try {
      const response = await axios.request(config);
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching wallpapers:', error.message);
      return [];
    }
  },
  searchByRating: async (type) => {
    const typeAliases = {
      'new': 'new_users_x',
      'popular': 'popular_x',
      'top': 'total_x'
    };
    const mappedType = typeAliases[type];
    if (!mappedType) {
      console.error('Invalid rating type. Use: new, popular, top.');
      return [];
    }
    const config = {
      method: 'GET',
      url: `https://users-data-api.wallpaperscraft.com/rating?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&rating_type=${mappedType}`,
      headers: {
        'User-Agent': 'wallpaperscraft-android/3.56.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Authorization': 'Bearer null',
        'X-APP-VERSION': 'Android-35600',
        'X-AppCheck-Token': ''
      }
    };
    try {
      const response = await axios.request(config);
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching wallpapers by rating:', error.message);
      return [];
    }
  },
  searchByCategory: async (category) => {
    const categoryUrls = {
      'video': 'https://api-uc.wallpaperscraft.com/live-images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&sort=rating&offset=0&limit=10&age=21&content_type=android_video&cost_variant=android_cost_1',
      'parallax': 'https://api-uc.wallpaperscraft.com/parallax-images?resolution=hd&sort=rating&offset=0&limit=60&age=21&cost_variant=android_cost_1',
      'ai_art': 'https://api-uc.wallpaperscraft.com/images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&limit=60&types%5B%5D=private&offset=0&sort=rating&cost_variant=android_cost_1&age=21&uploader_types%5B%5D=wlc_ai_art',
      'exclusive': 'https://api-uc.wallpaperscraft.com/images?screen%5Bwidth%5D=720&screen%5Bheight%5D=1280&lang=en&limit=60&types%5B%5D=private&offset=0&sort=rating&cost_variant=android_cost_1&age=21&uploader_types%5B%5D=wlc'
    };
    const url = categoryUrls[category];
    if (!url) {
      console.error('Invalid category. Use: video, parallax, ai_art, or exclusive');
      return [];
    }
    const config = {
      method: 'GET',
      url: url,
      headers: {
        'User-Agent': 'wallpaperscraft-android/3.56.0',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'X-APP-VERSION': 'Android-35600',
        'X-AppCheck-Token': ''
      }
    };
    try {
      const response = await axios.request(config);
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching wallpapers by category:', error.message);
      return [];
    }
  }
};

let handler = async (m, { conn, text, command, args }) => {
  try {
    const usage = `*— WallpapersCraft —*

*Perintah:*
.wallcraft <query>
.wallcraft <tipe> (top/popular/new)
.wallcraft <kategori> (video/parallax/ai_art/exclusive)

*Contoh:*
.wallcraft anime girl
.wallcraft top
.wallcraft ai_art`;
    
    if (!args[0]) {
      return m.reply(usage);
    }

    let results = [];
    let query = args.join(' ').trim();
    
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key }});

    if (['new', 'popular', 'top'].includes(query.toLowerCase())) {
      results = await wallcraft.searchByRating(query.toLowerCase());
    } else if (['video', 'parallax', 'ai_art', 'exclusive'].includes(query.toLowerCase())) {
      results = await wallcraft.searchByCategory(query.toLowerCase());
    } else {
      results = await wallcraft.search(query);
    }
    
    if (results.length === 0) {
      return m.reply(`❌ Tidak ada hasil yang ditemukan untuk: *${query}*`);
    }

    const wallpaper = results[Math.floor(Math.random() * results.length)];
    const imageUrl = wallpaper.variations?.original?.url || wallpaper.variations?.adapted?.url;
    const isVideo = wallpaper.type === 'video';

    if (!imageUrl) {
        return m.reply(`❌ Gagal mendapatkan URL gambar untuk: *${query}*`);
    }

    const caption = `
*Judul:* ${wallpaper.description || 'Tidak ada judul'}
*Rating:* ${wallpaper.rating}
*Downloads:* ${wallpaper.downloads}
*Tipe:* ${wallpaper.uploader_type}
`;

    if (isVideo) {
        await conn.sendMessage(m.chat, { video: { url: imageUrl }, caption: caption }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: caption }, { quoted: m });
    }

  } catch (e) {
    console.error(chalk.red('Error in wallpaperscraft plugin:'), e);
    m.reply('❌ Terjadi kesalahan. Coba lagi nanti.');
  }
};

handler.help = ['wallcraft <query|tipe|kategori>'];
handler.tags = ['internet'];
handler.command = /^(wallcraft|wallpapercraft)$/i;

export default handler;