let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    // Cek apakah user sudah menikah
    if (!user.isMarried) return m.reply('⚠️ Kamu harus menikah dulu untuk memiliki rekening bank keluarga.');

    let pasangan = user.pasangan;
    if (!pasangan) return m.reply('⚠️ Rekening bank hanya bisa dibuat oleh pasangan yang sah.');

    // Cek jumlah yang ingin disetor
    let jumlah = parseInt(args[0]);
    if (isNaN(jumlah) || jumlah < 10000) return m.reply('⚠️ Masukkan jumlah setoran minimal Rp 10.000.');

    // Cek apakah saldo cukup
    if (user.money < jumlah) return m.reply('⚠️ Uangmu tidak cukup!');

    // Setor uang ke bank keluarga
    user.money -= jumlah;
    user.bankKeluarga = (user.bankKeluarga || 0) + jumlah;

    // Dapatkan data pasangan
    let pasanganData = global.db.data.users[pasangan];
    if (pasanganData) {
        // Setor saldo ke bank keluarga pasangan juga
        pasanganData.bankKeluarga = (pasanganData.bankKeluarga || 0) + jumlah;
    }

    return m.reply(`✅ Kamu telah menyetor Rp ${jumlah.toLocaleString()} ke rekening bank keluarga. Saldo bank keluarga: Rp ${user.bankKeluarga.toLocaleString()}`);
}

handler.help = ['setor [jumlah]'];
handler.tags = ['rpg'];
handler.command = /^(setor)$/i;

export default handler;