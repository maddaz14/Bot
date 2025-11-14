const Websocket = require("ws")
const crypto = require("node:crypto")
const FormData = require("form-data")
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args))

const WS_URL = "wss://pixnova.ai/demo-photo2anime/queue/join"
const IMAGE_URL = "https://oss-global.pixnova.ai/"
const SESSION = crypto.randomBytes(5).toString("hex").slice(0, 9)

let wss
let promise

// upload ke Catbox
async function uploadToCatbox(buffer) {
  const form = new FormData()
  form.append("reqtype", "fileupload")
  form.append("fileToUpload", buffer, { filename: "image.jpg" })

  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: form,
  })
  if (!res.ok) throw new Error("Gagal upload ke Catbox.")
  return (await res.text()).trim()
}

function _connect(log) {
  return new Promise((resolve, reject) => {
    wss = new Websocket(WS_URL)
    wss.on("open", () => {
      if (log) console.log("[ INFO ] Websocket connected.")
      resolve()
    })
    wss.on("error", (error) => {
      console.error("[ ERROR ]", error)
      reject(error)
    })
    wss.on("message", (chunk) => {
      const data = JSON.parse(chunk.toString())
      if (promise && promise.once) {
        promise.call(data)
        promise = null
      } else if (promise && !promise.once) {
        if (log) console.log(data)
        if (data?.code == 200 && data?.success) {
          let out = data
          out.output.result = out.output.result.map(x => IMAGE_URL + x)
          promise.call(out)
          promise = null
        }
      }
    })
  })
}

function _send(payload, pr) {
  return new Promise(resolve => {
    wss.send(JSON.stringify(payload))
    promise = { once: !!pr, call: resolve }
  })
}

async function PixNova(data, imageUrl, log) {
  await _connect(log)
  let payload = { session_hash: SESSION }
  await _send(payload, true)

  payload = {
    data: {
      source_image: imageUrl,   // langsung URL catbox
      strength: data?.strength || 0.6,
      prompt: data.prompt,
      negative_prompt: data.negative,
      request_from: 2
    }
  }
  return await _send(payload, false)
}

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ""
  if (!/image/.test(mime)) throw "[⚠️] Balas atau kirim gambar untuk diubah jadi anime."

  try {
    // react mulai proses
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const buffer = await q.download()
    const catboxUrl = await uploadToCatbox(buffer)

    const DATA = {
      prompt: "(masterpiece), best quality",
      negative: "(worst quality, low quality:1.4), (greyscale, monochrome:1.1), cropped, lowres, watermark, text, multiple view, extra arm, extra leg, ugly face, blurry",
      strength: 0.6
    }

    const result = await PixNova(DATA, catboxUrl, false)
    const image = result.output.result[0]

    await conn.sendMessage(m.chat, {
      image: { url: image },
      caption: `*乂 Jadianime*\n\n*Size:* ${buffer.length} bytes\n*Type:* image/png`
    }, { quoted: m })

    // react selesai
    await conn.sendMessage(m.chat, { react: { text: "✨", key: m.key } })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    throw "Gagal memproses gambar jadi anime. Coba lagi nanti."
  }
}

handler.help = ["jadianime"]
handler.tags = ["tools"]
handler.command = ["jadianime","toanime"]

module.exports = handler