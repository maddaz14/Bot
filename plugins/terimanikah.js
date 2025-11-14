let handler = async (m, { conn }) => {
    let sender = m.sender;
    let pasangan = global.db.data.users[sender];

    if (!pasangan.lamaranDari) return m.reply('⚠️ Tidak ada lamaran untuk diterima!');

    let calon = pasangan.lamaranDari;
    let user = global.db.data.users[calon];

    let nameUser = conn.getName(calon);
    let namePasangan = conn.getName(sender);

    let biayaMenikah = 100000000; // 100 juta

    if (!user || user.money < biayaMenikah) return m.reply('⚠️ Uang pasanganmu kurang untuk menikah!');

    if (pasangan.undanganDiterima < 3) return m.reply(`⚠️ Kamu harus mengirim undangan ke 3 orang sebelum menerima lamaran! Gunakan *.undangan @user1 @user2 @user3*`);

    // Potong uang setelah menikah
    user.money -= biayaMenikah;
    user.isMarried = true;
    user.pasangan = sender;

    pasangan.isMarried = true;
    pasangan.pasangan = calon;

    let caption = `
🎉 *SELAMAT MENIKAH!* 🎉

👰 *${namePasangan}* ❤️ 🤵 *${nameUser}*

💰 Biaya Nikah: Rp ${biayaMenikah.toLocaleString()}
🏡 Kalian bisa membangun rumah tangga bersama!

📝 *Gunakan perintah:* 
.keluarga → Cek status keluarga
.rumah → Beli rumah
.kontrakan → Sewa kontrakan
.adopsi @user → Adopsi anak
`;

    await conn.sendMessage(m.chat, { text: caption, mentions: [sender, calon] });
}

handler.help = ['terimanikah'];
handler.tags = ['rpg'];
handler.command = /^(terimanikah)$/i;

export default handler;