const handler = async (m, { conn }) => {
    try {
        const groups = await conn.groupFetchAllParticipating();
        let komunitas = Object.values(groups).filter(g => g.communityJid); // hanya ambil grup dalam komunitas
        if (komunitas.length === 0) throw 'Bot tidak tergabung dalam komunitas manapun.';

        let totalAnggota = 0;
        let teks = '*「 INFO KOMUNITAS 」*\n\n';

        for (let group of komunitas) {
            teks += `📛 *${group.subject}*\n👥 Anggota: ${group.size}\n\n`;
            totalAnggota += group.size;
        }

        teks += `*Total anggota semua grup komunitas:* ${totalAnggota} anggota`;

        await conn.sendMessage(m.chat, { text: teks }, { quoted: m });
    } catch (e) {
        console.error(e);
        throw 'Gagal mengambil info komunitas. Pastikan bot sudah join dalam subgrup komunitas.';
    }
};

handler.command = ['komunitas', 'community'];
handler.help = ['komunitas'];
handler.tags = ['group'];
handler.limit = true;

export default handler;