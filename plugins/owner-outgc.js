let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Penggunaan:\n${usedPrefix + command} <id group>\n\nContoh:\n${usedPrefix + command} 628xxxxxxxx-xxxxxxxx@g.us`;
  let gc = text;
  if (!gc.endsWith('@g.us')) throw 'ID grup harus diakhiri dengan @g.us';

  try {
    await conn.groupLeave(gc);
    m.reply(`Berhasil keluar dari grup ${gc}`);
  } catch (e) {
    console.log(e);
    m.reply(`Gagal keluar dari grup ${gc}, bot bukan admin atau terjadi kesalahan.`);
  }
};

handler.help = ['outgc <id group>'];
handler.tags = ['owner'];
handler.command = /^(outgc)$/i;
handler.owner = true;

export default handler