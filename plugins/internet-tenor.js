/*
U
B
E
D
 */

import axios from "axios"

class Request {
  constructor({ base, apiKey }) {
    this.base = base
    this.headers = {
      'accept': '*/*',
      'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'origin': 'https://tenor.com',
      'referer': 'https://tenor.com/',
      'user-agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36',
      'x-client-data': 'CJDjygE='
    }
    this.params_default = {
      appversion: 'browser-r20250407-1',
      prettyPrint: false,
      key: apiKey,
      client_key: 'tenor_web',
      locale: 'id',
      component: 'web_mobile'
    }
  }
  
  async request(path, params = {}) {
    try {
      const res = await axios.get(this.base + path, {
        headers: this.headers,
        params: {
          ...this.params_default,
          ...params
        }
      })
      return { status: true, data: res.data }
    } catch(e) {
      return { status: false, msg: e.message }
    }
  }
}

class Tenor extends Request {
  constructor() {
    super({
      base: "https://tenor.googleapis.com/v2",
      apiKey: "AIzaSyC-P6_qz3FzCoXGLk6tgitZo4jEJ5mLzD8"
    })
    this.fields = [
      'id', 'media_formats', 'title', 'h1_title',
      'long_title', 'itemurl', 'url', 'created',
      'user', 'shares', 'embed', 'hasaudio',
      'policy_status', 'source_id', 'flags', 'tags',
      'content_rating', 'bg_color', 'legacy_info',
      'geographic_restriction', 'content_description',
    ].map((str) => `results.${str}`)
    this.mediaFilter = [
      'gif', 'gif_transparent', 'mediumgif',
      'tinygif', 'tinygif_transparent', 'webp',
      'webp_transparent', 'tinywebp',
      'tinywebp_transparent', 'tinymp4', 'mp4',
      'webm', 'originalgif', 'gifpreview',
    ].join(',')
    this.postResultFields = ['next', ...this.fields].join(',')
    this.anon_id = ""
  }
  
  async search(query, limit = 10, next_code) {
    try {
      if (!this.anon_id) {
        const anon = await this.getAnonId()
        if (!anon.status) return { status: false, msg: "Anon Id not found" }
      }
      if (!query) return { status: false, msg: "Please type query to search!" }
      const res = await this.request("/search", {
        anon_id: this.anon_id,
        q: query,
        limit,
        contentfilter: 'low',
        media_filter: this.mediaFilter,
        fields: this.postResultFields,
        searchfilter: 'none',
        ...(next_code ? { pos: next_code } : {}),
      })
      if (0 >= res.data?.results?.length) return { status: false, msg: "Media not found" }
      return { status: true, data: res.data.results, next: res.data.next }
    } catch(e) {
      return { status: false, msg: e.message }
    }
  }
  
  async getAnonId() {
    try {
      const res = await this.request("/anonid")
      if (!res?.data?.anon_id) return { status: false }
      this.anon_id = res.data.anon_id
      return res
    } catch(e) {
      return { status: false, msg: e.message }
    }
  }
}

// =========================
// WhatsApp Plugin
// =========================
let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(m.chat, { text: '❌ Masukkan query!\nContoh: .tenor anime girl' }, { quoted: m })

  const tenor = new Tenor()
  const res = await tenor.search(text, 20) // ambil 20 hasil
  
  if (!res.status) {
    return conn.sendMessage(m.chat, { text: `❌ ${res.msg}` }, { quoted: m })
  }

  // ambil random GIF dari hasil
  const data = res.data
  const pick = data[Math.floor(Math.random() * data.length)]
  const gifUrl = pick.media_formats?.gif?.url || pick.media_formats?.tinygif?.url

  if (!gifUrl) {
    return conn.sendMessage(m.chat, { text: '❌ GIF tidak ditemukan' }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    video: { url: gifUrl },
    gifPlayback: true,
    caption: `🎬 *Tenor GIF*\n🔍 Query: ${text}\n🌐 Source: tenor.com`
  }, { quoted: m })
}

handler.help = ['tenor <query>']
handler.tags = ['internet']
handler.command = /^tenor$/i

export default handler