let handler = async (m, { jid, conn }) => {
    let users = Object.entries(global.db.data.users).filter(user => user[1].banned);

    let userList = users.length ? users.map(([jid, data]) => {
        let banExpires = data.banExpires;
        let status = banExpires
            ? `Sementara (Berakhir: \`\`\`${new Date(banExpires).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false })} WIB\`\`\`)`
            : 'Permanen';
        return `
User: @${jid.split('@')[0]}
Status: ${status}
`.trim();
    }).join('\n\n') : 'Tidak ada user yang di banned.';

    m.reply(`
📑 *Daftar User Terbanned*
📊 Total: ${users.length} User

${userList}
`.trim(), null, {
        mentions: users.map(([jid]) => jid),
    });
}

handler.help = ['bannedlist'];
handler.tags = ['info'];
handler.command = /^listban(ned)?|ban(ned)?list|daftarban(ned)?$/i;
export default handler;