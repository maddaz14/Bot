let bpink = []
fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/blekping.txt')
  .then(res => res.text())
  .then(txt => bpink = txt.split('\n'))

let handler = async (m, { conn }) => {
  let img = bpink[Math.floor(Math.random() * bpink.length)]
  if (!img) throw '❌ Gagal ambil gambar'

  const thumb = Buffer.from(await (await fetch(img)).arrayBuffer())

  await conn.sendFile(
    m.chat,
    img,
    '',
    '🎀 *Nih Kak Bˡᵃᶜᵏᵖⁱⁿᵏ Nya~* 🌸',
    m,
    false,
    { thumbnail: thumb }
  )
}

handler.help = ['blackpink']
handler.tags = ['random']
handler.command = /^(blackpink)$/i
handler.limit = true
handler.register = true

export default handler