import axios from 'axios';
import fs from 'fs';
import path from 'path';

const Username = 'bayuasli';
const Token = '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';
const Repo = 'cantikku';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `❌ Masukkan perintah dengan deskripsi website.\n\nContoh:\n${usedPrefix + command} Buatkan website portofolio dengan tema modern`;
    }

    await m.reply('⏳ Proses Bang Tunggu Bentar!! \nGausah Spam');

    try {
        const apiUrl = `https://apii.baguss.web.id/tools/createhtml?apikey=bagus&query=${encodeURIComponent(text)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success) throw '❌ Terjadi kesalahan saat membuat HTML.';

        const htmlCode = data.code.match(/<!DOCTYPE html[\s\S]*/)?.[0];
        if (!htmlCode) throw '❌ Kode HTML tidak valid atau tidak ditemukan!';

        const randomId = Math.floor(Math.random() * 99999) + 1;
        const fileName = `${randomId}.html`;
        const filePath = path.join('./', fileName);
        fs.writeFileSync(filePath, htmlCode);
        const base64 = fs.readFileSync(filePath).toString('base64');

        const upload = await axios.put(
            `https://api.github.com/repos/${Username}/${Repo}/contents/${fileName}`,
            {
                message: `upload HTML ${fileName}`,
                content: base64
            },
            {
                headers: {
                    Authorization: `token ${Token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Bot WhatsApp'
                }
            }
        );

        const downloadUrl = upload?.data?.content?.download_url;
        if (!downloadUrl) throw '❌ Gagal mengunggah ke GitHub.';

        await conn.sendMessage(m.chat, {
            document: { url: downloadUrl },
            mimetype: 'text/html',
            fileName: fileName,
            caption: `✅ *Sukses!* File HTML sudah diunggah.\n\n🔗 *Link Website:* https://codegood21.github.io/code/${fileName}`
        }, { quoted: m });

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
        console.error(err);
        throw '❌ Terjadi kesalahan saat membuat atau mengunggah HTML!';
    }
};

handler.help = ['createhtml <query>'];
handler.tags = ['tools'];
handler.command = /^createhtml$/i;

export default handler;