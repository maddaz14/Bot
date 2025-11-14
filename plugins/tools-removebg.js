import axios from "axios"
import FormData from "form-data"

/**
 * Fungsi untuk menghapus latar belakang gambar menggunakan removebg.one API.
 * * @param {Buffer} buffer - Buffer gambar yang akan diproses.
 * @returns {Promise<string | undefined>} URL gambar hasil hapus latar belakang, atau undefined jika gagal.
 */
async function removeBg(buffer) {
  const form = new FormData()
  // Menggunakan 'file' sebagai nama field dan 'image.png' sebagai nama file
  form.append("file", buffer, "image.png") 

  try {
    let { data } = await axios.post("https://removebg.one/api/predict/v2", form, {
      headers: {
        // Menggabungkan header bawaan FormData dengan header kustom
        ...form.getHeaders(), 
        "accept": "application/json, text/plain, */*",
        "locale": "en-US",
        "platform": "PC",
        "product": "REMOVEBG",
        "sec-ch-ua": "\"Chromium\";v=\"127\", \"Not)A;Brand\";v=\"99\", \"Microsoft Edge Simulate\";v=\"127\", \"Lemur\";v=\"127\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "\"Android\"",
        "Referer": "https://removebg.one/upload"
      },
      // Penting: pastikan respons adalah JSON
      responseType: 'json' 
    })
    
    // Mengecek struktur respons dan mengembalikan cutoutUrl
    if (data?.data?.cutoutUrl) {
        return data.data.cutoutUrl
    } else if (data?.message) {
        // Melemparkan error jika API mengembalikan pesan error
        throw new Error(`API Error: ${data.message}`)
    }
    
    // Melemparkan error umum jika respons tidak sesuai
    throw new Error("Gagal mendapatkan URL hasil, respons API tidak valid.")

  } catch (error) {
    // Menangkap error axios (misalnya koneksi atau status kode non-200)
    if (error.response) {
        throw new Error(`Permintaan API Gagal. Status: ${error.response.status}. Data: ${JSON.stringify(error.response.data)}`)
    }
    throw error // Melemparkan kembali error lainnya
  }
}

/**
 * Handler utama bot.
 */
let handler = async (m, { conn }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    
    // 1. Validasi Gambar
    if (!mime.startsWith('image/')) {
        return m.reply('❌ Balas atau kirim gambar yang ingin dihapus latar belakangnya.')
    }
    
    m.reply('⏳ Sedang memproses gambar Anda, tunggu sebentar...')
    
    // 2. Download Gambar
    const buffer = await q.download()
    
    // 3. Panggil API Remove Background
    let resultUrl = await removeBg(buffer)
    
    // 4. Kirim Hasil
    if (resultUrl) {
        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl },
            caption: '✅ Latar belakang berhasil dihapus!'
        }, { quoted: m })
    } else {
        throw new Error('Gagal mendapatkan URL gambar hasil. Coba lagi.')
    }

  } catch (e) {
    console.error(e) // Mencetak error ke konsol untuk debugging
    m.reply(`⚠️ Terjadi kesalahan:\n${e.message || e}`)
  }
}

handler.help = ['removebg', 'rmbg']
handler.command = ['removebg', 'rmbg']
handler.tags = ['tools']

export default handler