// plugins/primbon-usaha.js
import axios from "axios"
import * as cheerio from "cheerio"

async function scrapeSifatUsahaBisnis(tgl, bln, thn) {
  try {
    const response = await axios({
      url: "https://primbon.com/sifat_usaha_bisnis.php",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      data: new URLSearchParams(Object.entries({ tgl, bln, thn, submit: " Submit! " })),
      timeout: 30000,
    })

    const $ = cheerio.load(response.data)
    const fetchText = $("#body").text()

    let hasil
    try {
      hasil = {
        hari_lahir: fetchText.split("Hari Lahir Anda: ")[1].split(thn)[0].trim(),
        usaha: fetchText.split(thn)[1].split("< Hitung Kembali")[0].trim(),
        catatan:
          "Setiap manusia memiliki sifat atau karakter yang berbeda-beda dalam menjalankan bisnis atau usaha. Dengan memahami sifat bisnis kita, rekan kita, atau bahkan kompetitor kita, akan membantu kita memperbaiki diri atau untuk menjalin hubungan kerjasama yang lebih baik.",
      }
    } catch {
      hasil = {
        status: false,
        message: "Error, mungkin input yang Anda masukkan salah",
      }
    }
    return hasil
  } catch (error) {
    throw new Error("Gagal mengambil data dari primbon.com")
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let [tgl, bln, thn] = text.split(" ")
  if (!tgl || !bln || !thn)
    throw `Contoh penggunaan:\n${usedPrefix + command} 1 1 2000`

  if (isNaN(tgl) || isNaN(bln) || isNaN(thn))
    throw `Harus berupa angka!\n\nContoh: ${usedPrefix + command} 12 8 2003`

  try {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    let result = await scrapeSifatUsahaBisnis(tgl, bln, thn)

    if (!result || result.status === false) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      return m.reply(result.message || "Tidak ada hasil")
    }

    let caption = `📅 *Hari Lahir:* ${result.hari_lahir}\n\n💼 *Sifat Usaha Bisnis:*\n${result.usaha}\n\n📝 *Catatan:*\n${result.catatan}`
    await conn.reply(m.chat, caption, m)

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
  } catch (e) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply("Terjadi kesalahan: " + e.message)
  }
}

handler.help = ["usaha <tgl> <bln> <thn>"]
handler.tags = ["primbon"]
handler.command = /^usaha$/i

export default handler