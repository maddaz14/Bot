let handler = async (m, { conn, text }) => {
    // Memisahkan nomor dan pesan dari input pengguna
    let [number, ...message] = text.split(' ');
    
    // Memastikan owner memasukkan nomor dan pesan
    if (!number) throw 'Masukkan nomor pengguna!\nContoh penggunaan: sendtext 6283857182374 Pesan yang ingin dikirim';
    if (!message.length) throw 'Masukkan pesan yang ingin dikirim!';
    
    // Memastikan nomor dalam format internasional dan menambahkan '@s.whatsapp.net' di akhir
    number = number.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    let messageText = message.join(' '); // Gabungkan pesan yang diinput

    try {
        // Mengirim pesan ke nomor yang ditentukan
        await conn.sendMessage(number, { text: messageText });
        m.reply(`Pesan berhasil dikirim ke ${number.replace('@s.whatsapp.net', '')}`);
    } catch (err) {
        console.error(err); // Log error pengiriman pesan
        return m.reply(`Gagal mengirim pesan: ${err.message || err}. Silakan coba lagi.`);
    }
}

handler.help = ['sendtext'];
handler.tags = ['owner'];
handler.command = /^(sendtext)$/i;
handler.rowner = true; // Hanya pemilik bot yang bisa menggunakan perintah ini

export default handler;