import axios from "axios";
import FormData from "form-data";
import fs from "fs/promises";

const handler = async (m, { conn }) => {
    if (!m.quoted || !m.quoted.mimetype || !/audio\/(mp3|wav|ogg|x-m4a)/.test(m.quoted.mimetype)) {
        throw 'Balas pesan audio dengan perintah ini untuk memisahkan vokal dari instrumen.';
    }

    let audio = await m.quoted.download(); // Mengunduh audio dari pesan yang dibalas
    let audioPath = './temp-audio.m4a'; // Menyimpan sementara file audio yang diunduh
    await fs.writeFile(audioPath, audio); // Menyimpan file sementara

    try {
        const form = new FormData();
        form.append('file', audio, { filename: 'audio.m4a', contentType: m.quoted.mimetype });
        form.append('task', 'spleeter:5stems'); // Memisahkan ke dalam 5 stems (vokal, bass, drum, piano, dll.)
        form.append('sample', '1'); // Mengaktifkan sampling rate

        const response = await axios.post('https://vocalremover.com/api/file-conversion/create', form, {
            headers: {
                ...form.getHeaders(),
                'accept': 'application/json'
            }
        });

        const { output } = response.data;

        if (output) {
            // Mengirimkan link hasil konversi ke user
            await conn.sendFile(m.chat, output, 'vocal_removed.zip', 'Hasil pemisahan vokal dan instrumen.', m);
        } else {
            m.reply('Maaf, terjadi kesalahan saat memproses audio.');
        }
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan saat memproses audio.');
    } finally {
        await fs.unlink(audioPath); // Menghapus file sementara
    }
};

handler.help = ['vocalremove'];
handler.tags = ['tools'];
handler.command = /^(vocalremove)$/i;
handler.limit = true;

export default handler;