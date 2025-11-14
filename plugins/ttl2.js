let handler = async (m, { conn, text, args }) => {
    let user = global.db.data.users[m.sender];
    if (!args[1]) return conn.reply(m.chat, "Masukkan tanggal yang valid!", m);

    let tgl = args[1];
    user.ttl_tanggal = tgl;
    user._ttl_step = "bulan"; // Menandakan siap ke tahap berikutnya

    await conn.reply(m.chat, `Tanggal *${tgl}* disimpan!\nLanjut pilih bulan dengan ketik *.pilihbulan*`, m);
};

handler.customPrefix = /^\.simpan tanggal/i;
handler.command = new RegExp;

export default handler;