// plugins/upscale-hd.js
import { fileTypeFromBuffer } from "file-type"
import path from "path"
import { Buffer } from "buffer"
import FormData from "form-data"
import axios from "axios"

// --- Class API ---
class UpscaleImageAPI {
  constructor() {
    this.api = null
    this.server = null
    this.taskId = null
    this.token = null
  }

  async getTaskId() {
    const { data: html } = await axios.get("https://www.iloveimg.com/upscale-image", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
      }
    })

    const tokenMatches = html.match(/(ey[a-zA-Z0-9?%-_/]+)/g)
    this.token = tokenMatches?.[1]
    const configMatch = html.match(/var ilovepdfConfig = ({.*?});/s)
    const configJson = JSON.parse(configMatch[1])
    const servers = configJson.servers
    this.server = servers[Math.floor(Math.random() * servers.length)]
    this.taskId = html.match(/ilovepdfConfig\.taskId\s*=\s*['"](\w+)['"]/)?.[1]

    this.api = axios.create({
      baseURL: `https://${this.server}.iloveimg.com`,
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Origin": "https://www.iloveimg.com",
        "Referer": "https://www.iloveimg.com/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
      }
    })
  }

  async uploadFromFile(fileBuffer, fileName) {
    const fileType = await fileTypeFromBuffer(fileBuffer)
    if (!fileType || !fileType.mime.startsWith("image/")) {
      throw new Error("❌ File bukan gambar valid.")
    }

    const form = new FormData()
    form.append("name", fileName)
    form.append("chunk", "0")
    form.append("chunks", "1")
    form.append("task", this.taskId)
    form.append("preview", "1")
    form.append("v", "web.0")
    form.append("file", fileBuffer, { filename: fileName, contentType: fileType.mime })

    const response = await this.api.post("/v1/upload", form, { headers: form.getHeaders() })
    return response.data
  }

  async upscaleImage(serverFilename, scale = 2) {
    const form = new FormData()
    form.append("task", this.taskId)
    form.append("server_filename", serverFilename)
    form.append("scale", scale.toString())

    const response = await this.api.post("/v1/upscale", form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer"
    })

    return response.data
  }
}

async function upscaleFromFile(fileBuffer, fileName, scale = 2) {
  const upscaler = new UpscaleImageAPI()
  await upscaler.getTaskId()
  const uploadResult = await upscaler.uploadFromFile(fileBuffer, fileName)
  if (!uploadResult || !uploadResult.server_filename) throw new Error("Gagal upload file.")

  const imageBuffer = await upscaler.upscaleImage(uploadResult.server_filename, scale)
  return imageBuffer
}

// --- Plugin WhatsApp ---
let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ""
  if (!/image/.test(mime)) return m.reply(`⚠️ Kirim gambar atau reply gambar dengan caption *${usedPrefix + command}*`)

  m.reply("⏳ Sedang memproses gambar, tunggu sebentar...")

  try {
    let media = await q.download()
    let fileName = `input.${mime.split("/")[1] || "jpg"}`
    let resultBuffer = await upscaleFromFile(media, fileName, 2)

    await conn.sendMessage(m.chat, { image: resultBuffer, caption: "✅ Gambar berhasil di-HD" }, { quoted: m })
  } catch (err) {
    console.error(err)
    m.reply("❌ Gagal memproses gambar.")
  }
}

handler.help = ["hd", "remini", "hdr", "upscale"]
handler.tags = ["tools"]
handler.command = /^(hd|remini|hdr|upscale)$/i

export default handler