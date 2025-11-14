// plugins/cekpackage.js
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  try {
    const pkgPath = path.resolve('./package.json')
    if (!fs.existsSync(pkgPath)) {
      return m.reply('❌ Tidak menemukan file package.json di root project')
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    }

    let masalah = []

    for (let dep of Object.keys(dependencies)) {
      const depPath = path.resolve('./node_modules', dep)
      if (!fs.existsSync(depPath)) {
        masalah.push(`${dep} (tidak ada di node_modules)`)
      } else {
        try {
          const depPkg = JSON.parse(fs.readFileSync(path.join(depPath, 'package.json'), 'utf-8'))
          const expected = dependencies[dep].replace(/^[^\d]*/, '') // hapus ^ ~ dll
          if (depPkg.version !== expected && !depPkg.version.startsWith(expected)) {
            masalah.push(`${dep} versi beda (diinstall: ${depPkg.version}, seharusnya: ${dependencies[dep]})`)
          }
        } catch {
          masalah.push(`${dep} (error membaca package.json)`)
        }
      }
    }

    if (masalah.length === 0) {
      return m.reply('✅ Semua dependencies terinstall dengan benar!')
    }

    let teks = `❌ Ditemukan ${masalah.length} package bermasalah:\n\n`
    teks += masalah.join('\n')
    m.reply(teks)

  } catch (e) {
    m.reply('⚠️ Terjadi error saat cek package:\n' + e.message)
  }
}

handler.help = ['cekpackage']
handler.tags = ['owner']
handler.command = /^cekpackage$/i
handler.owner = true

export default handler