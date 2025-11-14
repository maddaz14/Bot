let handler = async (m, { conn, args }) => {
    if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di dalam grup!';
    if (!m.quoted) throw `Balas gambar yang ingin dijadikan foto profil grup dengan perintah ini!`;

    let mime = (m.quoted.msg || m.quoted).mimetype || '';
    if (!/image\/(jpe?g|png)/.test(mime)) throw 'File bukan gambar!';

    let img = await m.quoted.download();
    if (!img) throw 'Gagal mengunduh gambar!';

    await conn.updateProfilePicture(m.chat, img);
    m.reply('Berhasil mengganti foto profil grup!');
};

handler.help = ['setppgrup'];
handler.tags = ['group'];
handler.command = /^(setppgrup|setppgroup|setgruppp)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;