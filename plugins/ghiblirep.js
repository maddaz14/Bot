import { writeFile } from "fs/promises";
import Replicate from "replicate";
import axios from 'axios';
import 'dotenv/config'; // <-- Tambahkan baris ini untuk memuat dotenv

// Pastikan Anda telah mengatur REPLICATE_API_TOKEN di lingkungan Anda atau di file .env
// Contoh: export REPLICATE_API_TOKEN=r8_92MQqqGI9SAsZh5qzAQQhHGFx9Z7fkH38VJwC
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN, // <-- Pastikan Replicate menggunakan token dari process.env
});

let handler = async (m, { conn, usedPrefix, command }) => {
    // Memeriksa keberadaan token REPLICATE_API_TOKEN
    if (!process.env.REPLICATE_API_TOKEN) {
        throw `⚠️ Token Replicate API tidak ditemukan!\nMohon atur REPLICATE_API_TOKEN di file .env atau variabel lingkungan server Anda.`;
    }

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim gambar dengan caption *${usedPrefix}${command}* atau reply gambar dengan *${usedPrefix}${command}*`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `File yang kamu kirim bukan gambar!`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });

        const imgBuffer = await q.download();

        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', imgBuffer, 'image.jpg');

        const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
        });

        const imageUrl = catboxRes.data;
        if (!imageUrl.includes('catbox.moe')) throw 'Gagal mengunggah gambar ke Catbox.';

        const input = {
            image: imageUrl,
            prompt: "GHBLI anime style photo",
            go_fast: true,
            guidance_scale: 10,
            prompt_strength: 0.77,
            num_inference_steps: 38
        };

        const output = await replicate.run(
            "aaronaftab/mirage-ghibli:166efd159b4138da932522bc5af40d39194033f587d9bdbab1e594119eae3e7f",
            { input }
        );

        const ghibliImageUrl = Array.isArray(output) ? output[0] : output;

        if (!ghibliImageUrl) throw 'Gagal mendapatkan URL gambar Ghibli dari Replicate.';

        const { data: ghibliImageBuffer } = await axios.get(ghibliImageUrl, { responseType: 'arraybuffer' });

        await conn.sendMessage(m.chat, {
            image: ghibliImageBuffer,
            caption: `🖌️ Gambar kamu sudah diubah ke style Ghibli oleh Replicate AI.`,
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error("Error dalam handler Ghibli Replicate:", err);
        let errorMessage = '❌ Terjadi kesalahan saat memproses gambar.';
        if (err.message && err.message.includes('API token') || (err.response && err.response.status === 401)) {
            errorMessage += '\nPastikan REPLICATE_API_TOKEN sudah diatur dengan benar di file .env atau variabel lingkungan server Anda.';
        } else if (err.response && err.response.status) {
            errorMessage += `\nKode status HTTP: ${err.response.status}`;
        }
        await conn.reply(m.chat, errorMessage, m);
    }
};

handler.help = ['ghiblirep'];
handler.tags = ['ai', 'image'];
handler.command = /^(ghiblirep)$/i;
handler.limit = 3;
handler.register = true;
handler.premium = false;

export default handler;