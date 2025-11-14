let handler = async (m, { command, text }) => {
  const isOwner = global.owner.some(([id]) => id === m.sender.split('@')[0]);
  if (!isOwner) return m.reply('❌ Fitur ini hanya bisa digunakan oleh *Owner*.');

  if (command === 'caplist' || command === 'listcap') {
    let list = Object.entries(db.data.users)
      .filter(([_, data]) => data.cap)
      .map(([jid, data], i) => `${i + 1}. @${jid.replace(/[^0-9]/g, '')} - *${data.cap}*`)
      .join('\n');

    if (!list) return m.reply('❌ Tidak ada pengguna yang memiliki cap.');

    return conn.sendMessage(m.chat, {
      text: `📛 *Daftar Cap Pengguna:*\n\n${list}`,
      mentions: list.match(/@(\d+)/g).map(j => j.replace('@', '') + '@s.whatsapp.net')
    }, { quoted: m });
  }

  let target = m.mentionedJid?.[0] || m.quoted?.sender;
  if (!target) return m.reply(`❗ Tag atau reply pengguna yang mau di-${command === 'cap' ? 'kasih' : 'hapus'} cap.\nContoh:\n.cap orang aneh @user\n.uncap @user`);

  let user = db.data.users[target];

  if (command === 'cap') {
    if (!text) return m.reply(`❗ Masukkan cap yang ingin diberikan. Contoh:\n.cap orang aneh @user`);
    user.cap = text.trim();
    return conn.sendMessage(m.chat, {
      text: `✅ Berhasil memberikan cap *"${text.trim()}"* kepada @${target.replace(/[^0-9]/g, '')}`,
      mentions: [target]
    }, { quoted: m });

  } else if (command === 'uncap') {
    if (!user.cap) return m.reply('❌ Orang ini tidak memiliki cap.');
    delete user.cap;
    return conn.sendMessage(m.chat, {
      text: `❌ Cap berhasil dihapus dari @${target.replace(/[^0-9]/g, '')}`,
      mentions: [target]
    }, { quoted: m });
  }
};

handler.help = ['cap <teks> @tag', 'uncap @tag', 'caplist'];
handler.tags = ['owner'];
handler.command = /^(cap|uncap|caplist|listcap)$/i;

export default handler;