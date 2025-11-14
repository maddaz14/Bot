// plugins/penyakit.js
import axios from "axios"
import * as cheerio from "cheerio"

async function scrapeCekPotensiPenyakit(tgl, bln, thn) {
  try {
    const { data } = await axios({
      url: "https://primbon.com/cek_potensi_penyakit.php",
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      data: new URLSearchParams({
        tanggal: tgl,
        bulan: bln,
        tahun: thn,
        hitung: " Submit! ",
      }),
      timeout: 30000,
    })

    let $ = cheerio.load(data)
    let fetchText = $("#body")
      .text()
      .replace(/\s{2,}/g, " ")
      .replace(/[\n\r\t]+/g, " ")
      .replace(
        /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\); /g,
        "",
      )
      .replace(/<<+\s*Kembali/g, "")
      .trim()

    if (!fetchText.includes("CEK POTENSI PENYAKIT (METODE PITAGORAS)")) {
      throw new Error("Data tidak ditemukan atau format tanggal tidak valid")
    }

    return {
      analisa: fetchText
        .split("CEK POTENSI PENYAKIT (METODE PITAGORAS)")[1]
        .split("Sektor yg dianalisa:")[0]
        .trim(),
      sektor: fetchText
        .split("Sektor yg dianalisa:")[1]
        .split("Anda tidak memiliki elemen")[0]
        .trim(),
      elemen:
        "Anda tidak memiliki elemen " +
        fetchText.split("Anda tidak memiliki elemen")[1].split("*")[0].trim(),
      catatan:
        "Potensi penyakit harus dipandang secara positif.\nSakit pada daftar tidak berarti anda akan mengalami semuanya.\nPencegahan adalah yang terbaik: makan sehat, olahraga teratur, istirahat cukup, hidup bahagia.",
    }
  } catch (error) {
    throw new Error("Gagal mengambil data dari primbon.com")
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Contoh penggunaan:\n${usedPrefix + command} 12 05 1998\n\nFormat: hari bulan tahun (dd mm yyyy)`,
    )
  }

  let [tgl, bln, thn] = text.split(" ")
  if (!tgl || !bln || !thn) {
    return m.reply(
      `Format salah!\nContoh:\n${usedPrefix + command} 12 05 1998`,
    )
  }

  try {
    let hasil = await scrapeCekPotensiPenyakit(tgl, bln, thn)
    let teks = `📅 Tanggal Lahir: ${tgl}-${bln}-${thn}\n\n`
    teks += `📖 Analisa:\n${hasil.analisa}\n\n`
    teks += `📍 Sektor Dianalisa:\n${hasil.sektor}\n\n`
    teks += `⚡ Elemen:\n${hasil.elemen}\n\n`
    teks += `📝 Catatan:\n${hasil.catatan}`

    await conn.sendMessage(m.chat, { text: teks }, { quoted: m })
  } catch (e) {
    m.reply("❌ " + e.message)
  }
}

handler.command = /^penyakit$/i
handler.help = ["penyakit <dd> <mm> <yyyy>"]
handler.tags = ["primbon"]

export default handler