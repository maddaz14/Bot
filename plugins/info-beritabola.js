import axios from 'axios'
import * as cheerio from "cheerio"
import https from 'https'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

let handler = async (m, { conn }) => {
  // Kirim emoji reaksi saat memulai proses pencarian
  await conn.sendMessage(m.chat, {
    react: { text: '🔍', key: m.key }
  })

  // Ambil berita bola
  let articles = await fetchBeritaBola()
  if (!articles.length) {
    // Jika gagal, kirim emoji "❌" dan beri pesan
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    })
    return m.reply("Gagal mengambil berita bola.")
  }

  // Membuat timestamp saat berita diperbarui
  let timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })

  let caption = `📢 Berita Bola Terbaru (Diperbarui: ${timestamp})\n\n`

  // Menampilkan 5 berita teratas
  articles.slice(0, 5).forEach((article, i) => {
    caption += `${i + 1}. ${article.title}\n`
    caption += `📅 Tanggal: ${article.date}\n`
    caption += `🏷️ Kategori: ${article.categories.join(", ") || "Tidak diketahui"}\n`
    caption += `🔗 Baca Selengkapnya: ${article.url}\n\n`
  })

  // Kirim emoji "✅" setelah proses selesai
  await conn.sendMessage(m.chat, {
    react: { text: '✅', key: m.key }
  })

  // Kirim gambar dan berita
  await conn.sendMessage(m.chat, {
    image: { url: articles[0].image },
    caption
  }, { quoted: m })
}

handler.command = /^beritabola$/i
handler.tags = ["news"]
handler.help = ["beritabola"]

export default handler

async function fetchBeritaBola() {
  try {
    const { data: html } = await axios.get("https://vivagoal.com/category/berita-bola/", {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    const $ = cheerio.load(html)
    const articles = []

    $(".swiper-wrapper .swiper-slide, .col-lg-6.mb-4, .col-lg-4.mb-4").each((i, el) => {
      const url = $(el).find("a").attr("href") || null
      const image = $(el).find("figure img").attr("src") || null
      const title = $(el).find("h3 a").text().trim() || null
      const categories = $(el)
        .find("a.vg_pill_cat")
        .map((i, cat) => $(cat).text().trim())
        .get()
      let date = $(el).find("time").attr("datetime") || $(el).find(".posted-on").text().trim()
      if (!date) date = new Date().toISOString().split("T")[0]

      if (url && title && image) {
        articles.push({ url, image, title, categories, date })
      }
    })

    return articles
  } catch (error) {
    return []
  }
}