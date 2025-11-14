import { fileTypeFromBuffer } from "file-type"

const upload = async function (buffer) {
    const f = await fileTypeFromBuffer(buffer)
    const file = new File([buffer], `${Date.now()}.${f.ext}`, { type: f.mime })

    const form = new FormData()
    form.append('upfile', file)

    const origin = 'https://uploadf.com'
    
    const r = await fetch(origin + '/upload.php', {
        'body': form,
        'method': 'post'
    })
    if(!r.ok) throw Error (`${r.status} ${r.statusText}`)

    const fileId = '/' + r.url.split("/").pop()
    const web = origin + '/s' + fileId
    const downloadUrl = origin + '/file' + fileId
    const qr = downloadUrl + '.qr'

    return { downloadUrl, qr, web }
}

let handler = async (m, { conn }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || ''

        if (!mime) return m.reply('Kirim/reply file yang ingin diupload')

        m.reply('Wait...')

        const buffer = await q.download()
        const Yatta = await upload(buffer)
        
        let text = `*⌜ File uploaded successfully  ⌟*

Size : ${buffer.length} bytes
Type : ${mime}
Web Link : ${Yatta.web}
Download Link : ${Yatta.downloadUrl}`

        await conn.sendMessage(m.chat, { image: { url: Yatta.qr }, caption: text }, { quoted: m })
    } catch (e) {
        m.reply(e.message)
    }
}

handler.help = ['updf']
handler.command = ['updf', 'upfile']
handler.tags = ['tools']

export default handler