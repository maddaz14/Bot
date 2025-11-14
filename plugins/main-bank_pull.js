const xpperlimit = 1; // Konversi nilai Bank ke Eris

let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender];

  let count;
  if (/^all$/i.test(args[0])) {
    count = Math.min(Math.floor(user.bank / xpperlimit), user.bank);
  } else {
    count = parseInt(args[0]) || 1;
  }

  count = Math.max(1, count);

  if (user.bank >= xpperlimit * count) {
    user.bank -= xpperlimit * count;
    user.eris += count;
    conn.reply(m.chat, `✅ @${m.sender.split('@')[0]} Menarik Uang Dari Bank\n🏧 Sebesar : _Rp.${count.toLocaleString()}_\n💸 Uangmu Di Dompet : _Rp.${user.eris.toLocaleString()}_`, m);
  } else {
    conn.reply(m.chat, `[❗] Uang kamu di bank tidak mencukupi untuk menarik Rp.${count.toLocaleString()}`, m);
  }
};

handler.help = ['tarik2 <jumlah|all>', 'pull2 <jumlah|all>'];
handler.tags = ['main'];
handler.command = /^(tarik2|pull2)$/i;
handler.register = false;

export default handler;