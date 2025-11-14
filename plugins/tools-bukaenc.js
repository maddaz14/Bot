import beautify from 'js-beautify'
import fs from 'fs'
import path from 'path'
import deobfuscator from 'deobfuscator'
import slang from 'js-slang'

const { deobfuscate } = deobfuscator

let handler = async (m, { conn }) => {
  if (
    !m.quoted ||
    !m.quoted.mimetype ||
    !m.quoted.mimetype.includes('javascript')
  ) {
    return m.reply('❗ Reply file `.js` yang terenkripsi atau obfuscated dulu kak.')
  }

  await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } })

  try {
    let jsFile = await m.quoted.download()
    let raw = jsFile.toString()
    let hasil = ''

    try {
      hasil = deobfuscate(raw)
      console.log('✅ File berhasil dideobfuscate dengan deobfuscator.')
    } catch (e) {
      console.log('⚠️ Gagal deobfuscate, mencoba beautify...')
      hasil = beautify(raw, {
        indent_size: 2,
        space_in_empty_paren: true,
      })
    }

    try {
      if (hasil.includes('eval(') || hasil.includes('Function(')) {
        console.log('🔍 Terdeteksi obfuscation dengan eval/Function, mencoba slang decode...')
        hasil = slang.decode(hasil)
      }
    } catch (e) {
      console.log('⚠️ Gagal slang decode.')
    }

    const fileName = `hasil-deobfuscate-${Date.now()}.js`
    const filePath = path.join('/tmp', fileName) // simpan di /tmp
    fs.writeFileSync(filePath, hasil)

    await conn.sendMessage(
      m.chat,
      {
        document: { url: filePath },
        mimetype: 'application/javascript',
        fileName,
      },
      { quoted: m },
    )

    setTimeout(() => {
      try {
        fs.unlinkSync(filePath)
      } catch {}
    }, 10_000)
  } catch (err) {
    console.error(err)
    m.reply(`❌ Terjadi kesalahan saat memproses file:\n${err.message}`)
  }
}

handler.help = ['bukaenc']
handler.tags = ['tools']
handler.command = /^bukaenc$/i

export default handler