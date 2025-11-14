import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Daftar Pemilik Bot
global.owner = [
  ['6285220022889', '🅜🅐🅓🅓🅐🅩-🅡🅨🅤', true]
]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Nomor Bot/Owner
global.nomorbot = '6285220022889'
global.nomorown = '6285220022889'

// Daftar Moderator dan Pengguna Premium
global.mods = ['6285220022889']
global.prems = ['6285220022889']
   
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = `𝚇𝚒𝚝𝚎𝚛 𝚃𝚛𝚊𝚗𝚜 𝙼𝙳`
global.author = '🅜🅐🅓🅓🅐🅩-🅡🅨🅤'
// Pesan Tunggu (Wait Message)
global.wait = '🐢 *Tunggu sebentar, aku lambat... ฅ^•ﻌ•^ฅ*' 
// Nama Bot
global.botname = '𝚇𝚒𝚝𝚎𝚛 𝚃𝚛𝚊𝚗𝚜 𝙼𝙳'
global.textbot = `Powered By 🅜🅐🅓🅓🅐🅩-🅡🅨🅤`
global.wm = 'Sticker by'
global.wm2 = '𝚇𝚒𝚝𝚎𝚛 𝚃𝚛𝚊𝚗𝚜 𝙼𝙳'
// Jangan di ubah
global.version = JSON.parse(fs.readFileSync("./package.json")).version
// Pesan Selesai (Done Message)
global.listo = '*Ini dia ฅ^•ﻌ•^ฅ*'
// Nama Channel
global.namechannel = '-'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Lokasi Gambar (katalog dan miniurl)
global.catalogo = fs.readFileSync('./storage/img/catalogo.png')
global.miniurl = fs.readFileSync('./storage/img/miniurl.jpg')
global.foto = 'https://files.catbox.moe/pcdlrg.jpeg'
global.fotorpg = 'https://files.catbox.moe/2f2zt2.jpeg'
global.web = 'https://store-fuxxy.vercel.app'


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Tautan Grup dan Channel
global.group = '-'
global.group2 = '-'
global.group3 = '-'
global.canal = '-'
global.btc = 'liana2407'
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.maelyn = {
    domain: 'https://api.maelyn.sbs',
    key: ''
 }

global.ubedAPI = { 
    domain: 'https://api.ubed.my.id',
    key: ''
 }

global.GoogleApi = 'AIzaSyCM_jlBX7v_vuowWLBEypf5bn_BwWVLdmc'; // API Key Google Anda Link: https://developers.google.com/custom-search/v1/overview

global.GoogleCx = 'd31a4791c1c264bfc'; // CX (Custom Search Engine ID) Anda Link Sama kayak global.GoogleApi

// Objek Styling Pesan (Untuk OrderMessage/Thumbnail)
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: botname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Modul yang di-globalisasi
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.multiplier = 69 
// Peringatan Maksimum
global.maxwarn = '3' // Peringatan maksimum

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Mekanisme Watch/Unwatch File untuk Reload (Kode Verifikasi Tersembunyi)
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Pembaruan 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
