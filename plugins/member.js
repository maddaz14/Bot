const handler = async (m, { conn, args }) => {
    if (!args[0] || !args[0].includes('whatsapp.com')) {
        throw `Contoh penggunaan:\n.member https://chat.whatsapp.com/Cgnb1vmVbGj3jECd2rZr0e`;
    }

    // Ambil kode invite dari link
    let regex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
    let match = args[0].match(regex);
    if (!match) throw 'Link grup tidak valid.';
    
    let code = match[1];

    try {
        let metadata = await conn.groupGetInviteInfo(code);
        let groupName = metadata.subject || "Grup";
        let groupSize = metadata.size || 0;
        let owner = metadata.owner ? `@${metadata.owner.split("@")[0]}` : "Tidak diketahui";

        let caption = `*「 INFO GRUP 」*\n\n`;
        caption += `📛 *Nama:* ${groupName}\n`;
        caption += `👥 *Jumlah Anggota:* ${groupSize} anggota\n`;
        caption += `👑 *Owner:* ${owner}`;

        await conn.sendMessage(m.chat, {
            text: caption,
            mentions: metadata.owner ? [metadata.owner] : []
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw 'Gagal mengambil data grup. Pastikan bot sudah join ke grup tersebut.';
    }
};

handler.command = ['member'];
handler.help = ['member <link_grup>'];
handler.tags = ['group'];
handler.limit = true;

export default handler;