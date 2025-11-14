function formatRupiah(amount) {
    if (typeof amount !== 'number') return '[ 0 (0) ]';
    let formatted = new Intl.NumberFormat('id-ID').format(amount);
    let suffix = '';

    if (amount >= 1e9) {
        suffix = `${(amount / 1e9).toFixed(amount % 1e9 === 0 ? 0 : 1)}M`;
    } else if (amount >= 1e6) {
        suffix = `${(amount / 1e6).toFixed(amount % 1e6 === 0 ? 0 : 1)}JT`;
    } else if (amount >= 1e3) {
        suffix = `${(amount / 1e3).toFixed(amount % 1e3 === 0 ? 0 : 1)}K`;
    } else {
        suffix = amount.toString();
    }

    return `[ ${formatted} (${suffix}) ]`;
}

let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    if (!user.isMarried) return m.reply('⚠️ Kamu belum menikah!');
    if (!user.pasangan) return m.reply('⚠️ Kamu tidak memiliki rekening keluarga.');

    let pasanganData = global.db.data.users[user.pasangan];
    if (!pasanganData) return m.reply('⚠️ Data pasangan tidak ditemukan!');

    let saldoBankKeluargaUser = user.bankKeluarga || 0;
    let saldoBankKeluargaPasangan = pasanganData.bankKeluarga || 0;
    let saldoBankKeluarga = saldoBankKeluargaUser + saldoBankKeluargaPasangan;

    let jumlah = parseInt(args[0]);
    let maxTarik = 50_000_000;

    if (isNaN(jumlah) || jumlah <= 0)
        return m.reply(`⚠️ Masukkan jumlah yang ingin ditarik. Maksimal penarikan: Rp ${maxTarik.toLocaleString()}\nSaldo Bank Keluarga: ${formatRupiah(saldoBankKeluarga)}`);

    if (jumlah > maxTarik)
        return m.reply(`⚠️ Maksimal penarikan adalah Rp ${maxTarik.toLocaleString()}.`);

    if (jumlah > saldoBankKeluarga)
        return m.reply(`⚠️ Saldo bank keluarga tidak mencukupi. Saldo: ${formatRupiah(saldoBankKeluarga)}`);

    if (saldoBankKeluargaUser >= jumlah) {
        user.bankKeluarga -= jumlah;
    } else {
        let sisa = jumlah - saldoBankKeluargaUser;
        user.bankKeluarga = 0;
        pasanganData.bankKeluarga -= sisa;
    }

    user.money += jumlah;

    return m.reply(`✅ Kamu telah menarik Rp ${jumlah.toLocaleString()} dari rekening keluarga.\nSaldo pribadimu sekarang: ${formatRupiah(user.money)}`);
};

handler.help = ['menarik [jumlah]'];
handler.tags = ['rpg'];
handler.command = /^(menarik)$/i;

export default handler;