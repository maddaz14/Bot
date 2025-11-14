let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Format: .confes 628xxxx Pesan kamu
    let [nomor, ...pesanArray] = text.split(' ');
    let pesan = pesanArray.join(' ');

    if (!nomor || !pesan) {
        throw `❌ Format salah!\nGunakan: ${usedPrefix + command} <nomor tanpa +> <pesan>\n\nContoh:\n${usedPrefix + command} 628123456789 Halo, aku kagum sama kamu 😳`;
    }

    if (pesan.length < 5) throw `Pesan terlalu pendek! Minimal 5 karakter.`;
    if (pesan.length > 1000) throw `Pesan terlalu panjang! Maksimal 1000 karakter.`;

    // Pastikan nomor tujuan berakhiran @s.whatsapp.net
    let jidTujuan = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    // Kirim pesan ke target
    let teks = `📩 *PESAN ANONIM* 📩\n\n${pesan}`;
    await conn.reply(jidTujuan, teks, null);

    // Balasan ke pengirim
    m.reply(`✅ Pesan confess berhasil dikirim ke nomor *${nomor}* tanpa identitas kamu.`);
};

handler.help = ['confes <nomor> <pesan>'];
handler.tags = ['tools'];
handler.command = /^confes$/i;

export default handler;