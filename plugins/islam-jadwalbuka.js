import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('📌 *Gunakan:* .jadwal <nama kota>\n📍 *Contoh:* .jadwal Jakarta');

    try {
        // 🔍 CARI ID KOTA BERDASARKAN NAMA KOTA
        let resKota = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(text)}`);
        let dataKota = await resKota.json();

        if (!dataKota.status || !dataKota.data || dataKota.data.length === 0) {
            return m.reply('🚫 Kota tidak ditemukan! Gunakan nama kota yang valid.');
        }

        let idKota = dataKota.data[0].id;
        let namaKota = dataKota.data[0].lokasi;

        // 🔍 AMBIL JADWAL SHOLAT BERDASARKAN ID KOTA
        let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
        let days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        let dayName = days[now.getDay()];
        let formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

        let resJadwal = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${formattedDate}`);
        let jadwalData = await resJadwal.json();

        if (!jadwalData.status || !jadwalData.data || !jadwalData.data.jadwal) {
            throw '❌ Gagal mengambil jadwal! Coba lagi nanti.';
        }

        let { imsak, subuh, dzuhur, ashar, maghrib, isya, tanggal } = jadwalData.data.jadwal;

        // ✨ FORMAT PESAN JADWAL SHOLAT
        let pesan = `📅 *Jadwal Sholat Hari Ini*\n🏙 *${namaKota}*\n📆 ${dayName}, ${tanggal}\n\n🌅 *Imsak:* ${imsak}\n🕌 *Subuh:* ${subuh}\n🕛 *Dzuhur:* ${dzuhur}\n🕒 *Ashar:* ${ashar}\n🌇 *Maghrib:* ${maghrib} (Buka Puasa)\n🌙 *Isya:* ${isya}`;

        await conn.sendMessage(m.chat, { text: pesan }, { quoted: m });
    } catch (err) {
        console.error('❌ Error:', err);
        m.reply(`❌ Gagal mengambil jadwal: ${err.message || err}`);
    }
};

handler.command = /^(jadwalimsak|jadwalbuka)$/i;
handler.tags = ['ramadhan', 'islami'];
handler.help = ['jadwalimsak <kota>', 'jadwalbuka'];

export default handler;