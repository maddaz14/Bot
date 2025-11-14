import * as jimp from "jimp"
import uploadImage from "../lib/uploadImage.js"
import uploadFile from "../lib/uploadFile.js"

let handler = async (m, { conn, usedPrefix, args}) => {
	let towidth = args[0]
	let toheight = args[1]
	if (!towidth) throw `Gunakan format: ${usedPrefix}resize <lebar> <tinggi> (reply/caption)`;
	if (!toheight) throw `Gunakan format: ${usedPrefix}resize <lebar> <tinggi> (reply/caption)`;

    try {
        conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) throw "Mana medianya?";

        let media = await q.download()
        let isMedia = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
        if (!isMedia) throw `Mime ${mime} tidak didukung`
        let link = await (isMedia ? uploadImage : uploadImage)(media)

        let source = await jimp.read(await link)
        let size = {
                    before:{
                           height: await source.getHeight(),
                           width: await source.getWidth()
                     },
                    after:{
                           height: parseInt(toheight),
                           width: parseInt(towidth),
                           },
                    }
        let compres = await conn.resize(link, parseInt(towidth) - 0, parseInt(toheight) - 0)
        let linkcompres = await (isMedia ? uploadImage : uploadImage)(compres)

        await conn.sendFile(m.chat, compres, null, `*COMPRESS RESIZE*

*• BEFORE*
> ᴡɪᴅᴛʜ : ${size.before.width}
> ʜᴇɪɢʜᴛ : ${size.before.height}

*• AFTER*
> ᴡɪᴅᴛʜ : ${size.after.width}
> ʜᴇɪɢʜᴛ : ${size.after.height}

*• LINK*
> ᴏʀɪɢɪɴᴀʟ : ${link}
> ᴄᴏᴍᴘʀᴇss : ${linkcompres}`, m);

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }); // Tambahkan emoji sukses
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Tambahkan emoji gagal
        await conn.reply(m.chat, `Terjadi kesalahan: ${error}`, m);
    }
};
handler.help = ['resize <lebar> <tinggi> (reply|caption)']
handler.tags = ['tools']
handler.command = /^(resize)$/i

export default handler