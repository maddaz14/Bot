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

let handler = async (m, { conn }) => {
    let leaderboard = [];
    let pasanganSet = new Set();

    for (let userId in global.db.data.users) {
        let user = global.db.data.users[userId];
        if (!user.isMarried || !user.pasangan) continue;

        let pasanganId = user.pasangan;
        if (pasanganSet.has(userId) || pasanganSet.has(pasanganId)) continue;

        let pasanganData = global.db.data.users[pasanganId];
        if (!pasanganData) continue;

        let totalBank = (user.bankKeluarga || 0) + (pasanganData.bankKeluarga || 0);

        // Batasi maksimal total bank keluarga ke 50 miliar
        if (totalBank > 50000000000) totalBank = 50000000000;

        let namaUser = user.name || 'Tidak Diketahui';
        let namaPasangan = pasanganData.name || 'Tidak Diketahui';

        leaderboard.push({
            saldo: totalBank,
            name: `${namaUser} ❤️ ${namaPasangan}`
        });

        pasanganSet.add(userId);
        pasanganSet.add(pasanganId);
    }

    leaderboard.sort((a, b) => b.saldo - a.saldo);

    let teks = '*──「 Leaderboard Pasangan 」──*\n\n';
    if (leaderboard.length === 0) {
        teks += '_Tidak ada pasangan yang terdaftar di bank keluarga._';
    } else {
        for (let i = 0; i < leaderboard.length; i++) {
            teks += `*${i + 1}. ${leaderboard[i].name}* - ${formatRupiah(leaderboard[i].saldo)}\n`;
        }
    }

    return conn.sendMessage(m.chat, { text: teks }, { quoted: m });
};

handler.help = ['familylb'];
handler.tags = ['rpg'];
handler.command = /^(listpasangan|pasanganlb|keluargalb|familylb)$/i;

export default handler;