const handler = async (m, { conn }) => {
    let groups = await conn.groupFetchAllParticipating();
    let total = 0;
    let teks = '*「 Komunitas Terhubung 」*\n\n';
    for (let id in groups) {
        let g = groups[id];
        if (g.communityJid) {
            teks += `📛 *${g.subject}*\n👥 Anggota: ${g.size}\n\n`;
            total += g.size;
        }
    }
    teks += `Total anggota seluruh subgrup komunitas: ${total}`;
    await conn.sendMessage(m.chat, { text: teks }, { quoted: m });
};

handler.command = ['memberkomunitas', 'cekkomunitas'];
handler.tags = ['group'];
handler.help = ['memberkomunitas'];
export default handler;