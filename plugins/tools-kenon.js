import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        // Mengecek apakah ada mention dan mengambil nomor
        const mentionedUser = m.mentionedJid[0];
        if (!mentionedUser) {
            throw 'Harap sebutkan nomor yang ingin dicek dengan @user';
        }

        // Ambil nomor dari mention (menangani nomor dengan format @user@domain)
        const phoneNumber = mentionedUser.split('@')[0]; // Mengambil nomor tanpa domain
        if (!phoneNumber) {
            throw 'Nomor yang di-mention tidak valid';
        }

        // Mengambil data dari API Kenon
        const apiUrl = `https://api.autoresbot.com/api/tools/kenon?apikey=ubed2407&number=${phoneNumber}`;
        const response = await axios.get(apiUrl);

        // Menyusun hasil dari API ke dalam pesan
        const result = response.data;

        // Cek jika response valid dan statusnya true
        if (result && result.status === true) {
            let message = `*Hasil Cek Nomor*\n\n`;
            message += `*Nomor:* ${result.target}\n`;
            message += `*Pesan:* ${result.message}\n`;

            // Mengirimkan hasil pengecekan nomor ke chat WhatsApp
            await conn.sendMessage(m.chat, message, { quoted: null });
            await m.react("✅"); // Emoji sukses
        } else {
            throw '❌ Gagal mendapatkan data nomor!';
        }
        
    } catch (e) {
        console.error('[ERROR]', e);
        await m.react("❌"); // Emoji error
        // Mengirim pesan error ke pengguna
        await conn.sendMessage(m.chat, `❌ Terjadi kesalahan: ${e}`, { quoted: null });
    }
};

handler.help = ["kenon @user"];
handler.tags = ["tools"];
handler.command = /^(kenon)$/i;
handler.limit = true;
handler.premium = false;

export default handler;