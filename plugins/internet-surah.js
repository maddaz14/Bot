// plugins/quran-kemenag.js
import axios from "axios"

const headers = {
  "Accept": "application/json, text/plain, */*",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
  "Referer": "https://quran.kemenag.go.id/",
  "Origin": "https://quran.kemenag.go.id"
}

async function getListSurah() {
  const { data } = await axios.get("https://web-api.qurankemenag.net/quran-surah", { headers })
  return data.data.map(surah => ({
    nomor: surah.id,
    latin: surah.latin.trim(),
    arti: surah.translation,
    jumlah_ayat: surah.num_ayah
  }))
}

async function getAllAyat(surahInput) {
  const list = await getListSurah()
  const found = list.find(s =>
    s.latin.toLowerCase() === surahInput.toLowerCase() ||
    s.nomor === Number(surahInput)
  )
  if (!found) return { error: "❌ Surah tidak ditemukan." }

  const { data } = await axios.get(
    `https://web-api.qurankemenag.net/quran-ayah?start=0&limit=${found.jumlah_ayat}&surah=${found.nomor}`,
    { headers }
  )

  return {
    surah: found.latin,
    arti_surah: found.arti,
    ayat: data.data.map(a => ({
      ayat: a.ayah,
      arab: a.arabic,
      latin: a.latin.trim(),
      terjemahan: a.translation
    }))
  }
}

let handler = async (m, { command, args }) => {
  try {
    if (command === "listsurah") {
      let list = await getListSurah()
      let teks = `📖 *Daftar Surah Al-Qur'an* 📖\n\n`
      teks += list.map(s => `📌 ${s.nomor}. *${s.latin}* (${s.arti})\n   Jumlah Ayat: ${s.jumlah_ayat}`).join("\n\n")
      await m.reply(teks)
    }

    if (command === "surah") {
      if (!args[0]) return m.reply("⚠️ Contoh: *.surah 1* atau *.surah al-fatihah*")
      let hasil = await getAllAyat(args.join(" "))
      if (hasil.error) return m.reply(hasil.error)

      let teks = `📖 Surah *${hasil.surah}* (${hasil.arti_surah})\n\n`
      teks += hasil.ayat.map(a =>
        `🔹 Ayat ${a.ayat}\n${a.arab}\n_${a.latin}_\n${a.terjemahan}`
      ).join("\n\n")

      // antisipasi terlalu panjang → kirim sebagai file txt
      if (teks.length > 4000) {
        await conn.sendMessage(m.chat, {
          document: Buffer.from(teks),
          mimetype: "text/plain",
          fileName: `${hasil.surah}.txt`
        }, { quoted: m })
      } else {
        await m.reply(teks)
      }
    }
  } catch (e) {
    console.error(e)
    await m.reply("❌ Terjadi kesalahan, coba lagi nanti.")
  }
}

handler.help = ["listsurah", "surah <nomor|nama>"]
handler.tags = ["internet"]
handler.command = /^(listsurah|surah)$/i

export default handler