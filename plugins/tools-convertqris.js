import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let imageUrl;

    // Validasi parameter jumlah & pajak
    if (args.length < 1) {
        throw `Penggunaan:\n${usedPrefix + command} <URL_Gambar_QRIS | kirim/reply gambar> <jumlah> [pajak]\n\nContoh:\n${usedPrefix + command} https://example.com/qris.jpg 1500 500\n(rekomendasi) Balas gambar QRIS dengan:\n${usedPrefix + command} 1500 500`;
    }

    const hasImageInput = mime && /image\/(jpe?g|png)/.test(mime);
    const hasUrlInput = args[0]?.startsWith('http');

    let amount, tax;

    // Mode: Gambar Dikirim
    if (hasImageInput) {
        amount = parseInt(args[0]);
        tax = args[1] ? parseInt(args[1]) : 0;

        if (isNaN(amount) || amount <= 0) throw 'Jumlah harus berupa angka positif.';
        if (isNaN(tax) || tax < 0) throw 'Pajak harus berupa angka non-negatif.';

        try {
            await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

            const imgBuffer = await q.download();
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', imgBuffer, 'qris.jpg');

            const uploadRes = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: formData.getHeaders(),
            });

            imageUrl = uploadRes.data;
            if (!imageUrl.includes('catbox.moe')) throw 'Gagal mengunggah gambar ke Catbox.';

        } catch (e) {
            console.error(e);
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('Gagal mengunggah gambar QRIS. Coba lagi.');
        }

    // Mode: URL Gambar
    } else if (hasUrlInput) {
        imageUrl = args[0];
        amount = parseInt(args[1]);
        tax = args[2] ? parseInt(args[2]) : 0;

        if (isNaN(amount) || amount <= 0) throw 'Jumlah harus berupa angka positif.';
        if (isNaN(tax) || tax < 0) throw 'Pajak harus berupa angka non-negatif.';
    } else {
        throw `Kirim gambar QRIS atau gunakan URL gambar valid.\n\nContoh:\n${usedPrefix + command} https://example.com/qris.jpg 1500\natau reply gambar QRIS dengan:\n${usedPrefix + command} 1500`;
    }

    try {
        const apiUrl = `https://flowfalcon.dpdns.org/imagecreator/convertqris?qris=${encodeURIComponent(imageUrl)}&amount=${amount}&tax=${tax}`;
        const result = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 20000 });

        const sent = await conn.sendMessage(
            m.chat,
            {
                image: Buffer.from(result.data),
                caption: `✅ *QRIS berhasil dikonversi:*\n• Jumlah: ${amount}\n• Pajak: ${tax}\n\nSumber gambar: ${imageUrl}`,
            },
            { quoted: m }
        );

        await conn.sendMessage(m.chat, { react: { text: '✅', key: sent.key } });

    } catch (err) {
        console.error('Gagal konversi QRIS:', err);
        let msg = 'Gagal mengkonversi QRIS.';
        if (err.response?.status === 400) msg = 'Parameter atau gambar tidak valid.';
        else if (err.code === 'ECONNABORTED') msg = 'Permintaan ke server habis waktu.';
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        await conn.reply(m.chat, msg, m);
    }
};

handler.help = ['qrisconvert <URL_GAMBAR | reply gambar> <jumlah> [pajak]'];
handler.tags = ['tools', 'image'];
handler.command = /^(qrisconvert|convertqris|qris|konvertqris)$/i;
handler.limit = true;
handler.register = true;
handler.owner = true;

export default handler;