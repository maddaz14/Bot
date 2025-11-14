import fetch from 'node-fetch';

// Mapping URL API Nekolabs dan nama perintah lokal
const NEKOLABS_RANDOM_MAP = {
    'nsfwass': '/random/nsfwhub/ass',
    'nsfwbds': '/random/nsfwhub/bdsm',
    'nsfwblack': '/random/nsfwhub/black',
    'nsfwblowjob': '/random/nsfwhub/blowjob',
    'nsfwboobs': '/random/nsfwhub/boobs',
    'nsfwbottomless': '/random/nsfwhub/bottomless',
    'nsfwcollared': '/random/nsfwhub/collared',
    'nsfwcum': '/random/nsfwhub/cum',
    'nsfwcumsluts': '/random/nsfwhub/cumsluts',
    'nsfwdick': '/random/nsfwhub/dick',
    'nsfwdom': '/random/nsfwhub/dom',
    'nsfwdp': '/random/nsfwhub/dp',
    'nsfweaster': '/random/nsfwhub/easter',
    'nsfwextreme': '/random/nsfwhub/extreme',
    'nsfwfeet': '/random/nsfwhub/feet',
    'nsfwfinger': '/random/nsfwhub/finger',
    'nsfwfuck': '/random/nsfwhub/fuck',
    'nsfwfuta': '/random/nsfwhub/futa',
    'nsfwgay': '/random/nsfwhub/gay',
    'nsfwgroup': '/random/nsfwhub/group',
    'nsfwhentai': '/random/nsfwhub/hentai',
    'nsfwkiss': '/random/nsfwhub/kiss',
    'nsfwlesbian': '/random/nsfwhub/lesbian',
    'nsfwlick': '/random/nsfwhub/lick',
    'nsfwpegged': '/random/nsfwhub/pegged',
    'nsfwpuffies': '/random/nsfwhub/puffies',
    'nsfwpussy': '/random/nsfwhub/pussy',
    'nsfwreal': '/random/nsfwhub/real',
    'nsfwsuck': '/random/nsfwhub/suck',
    'nsfwtattoo': '/random/nsfwhub/tattoo',
    'nsfwtiny': '/random/nsfwhub/tiny',
    'nsfwxmas': '/random/nsfwhub/xmas',
    'picre': '/random/pic-re',
    'rule34': '/random/rule34',
    'waifuass': '/random/waifuim/ass',
    'waifuecchi': '/random/waifuim/ecchi',
    'waifuero': '/random/waifuim/ero',
    'waifuhentai': '/random/waifuim/hentai',
    'waifumaid': '/random/waifuim/maid',
    'waifumilf': '/random/waifuim/milf',
    'waifuoppai': '/random/waifuim/oppai',
    'waifuoral': '/random/waifuim/oral',
    'waifupaizuri': '/random/waifuim/paizuri',
    'waifuselfies': '/random/waifuim/selfies',
    'waifuniform': '/random/waifuim/uniform',
    'waifuwaifu': '/random/waifuim/waifu',
};

const BASE_URL = 'https://api.nekolabs.my.id';

const handler = async (m, { conn, command }) => {
    // Ambil path API dari command yang dipanggil
    const apiPath = NEKOLABS_RANDOM_MAP[command];
    if (!apiPath) {
        return m.reply("Model tidak ditemukan.");
    }

    try {
        // Bentuk URL lengkap
        const fullUrl = `${BASE_URL}${apiPath}`;
        console.log("Fetching from URL:", fullUrl); // Log URL

        // Ambil data (Buffer) dari API
        const response = await fetch(fullUrl);
        if (!response.ok) {
            let errorText = await response.text().catch(() => response.statusText);
            throw new Error(`Gagal mengambil gambar. Status: ${response.status} (${errorText})`);
        }

        // Dapatkan Buffer gambar dari respon
        const imageBuffer = await response.buffer();

        // Kirim Buffer gambar langsung ke WhatsApp
        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `✅ Gambar berhasil diambil dari efek: *${command}*`
        }, {
            quoted: m
        });
    } catch (error) {
        console.error("Error in random image handler:", error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`💥 Terjadi kesalahan saat mengambil gambar: ${error.message}`);
    }
};

// Buat array help dan command secara dinamis dari map
const commands = Object.keys(NEKOLABS_RANDOM_MAP);
const helpMessages = commands.map(cmd => cmd);

handler.help = helpMessages;
handler.tags = ["random", "image"];
handler.command = commands;
handler.premium = true

export default handler;