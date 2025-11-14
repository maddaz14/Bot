process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './settings.js'
import {createRequire} from 'module'
import path, {join} from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch} from 'fs'
import { verifyScrapeKey } from './lib/scrape.js';
import yargs from 'yargs'
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import {Boom} from '@hapi/boom'
import {Low, JSONFile} from 'lowdb'
import store from './lib/store.js'
import readline from 'readline'
import NodeCache from 'node-cache'
import { verifyKey } from './src/baileys.js'; 

const {proto} = (await import('@fuxxy-star/baileys')).default
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } = await import('@fuxxy-star/baileys')
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// Variabel Global Awal
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

// Inisialisasi Database
global.db = new Low(new JSONFile(`storage/databases/database.json`))

global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(async function () {
    if (!global.db.READ) {
      clearInterval(this)
      resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
    }
  }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}
loadDatabase()

global.authFile = `sessions`

// Input terminal
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

async function initModules() {
    const simple = await import('./lib/simple.js');
    global.makeWASocket = simple.makeWASocket;
    global.protoType = simple.protoType;
    global.serialize = simple.serialize;

    global.protoType();
    global.serialize();

    let handler = await import('./handler.js');
    global.handler = handler;
}

async function initBaileysConnection() {
    if (!global.makeWASocket) {
        console.error(chalk.red('FATAL: Modul inti (simple.js) belum dimuat. Verifikasi gagal?'));
        process.exit(1);
    }

    const {state, saveState, saveCreds} = await useMultiFileAuthState(`${global.authFile}`)
    const msgRetryCounterCache = new NodeCache()
    const {version} = await fetchLatestBaileysVersion()
    const useMobile = false

    const connectionOptions = {
        version,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }),
        printQRInTerminal: false,
        mobile: useMobile, 
        browser: ['Mac OS', 'chrome', '121.0.6167.159'], 
        auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
	    generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, 
      defaultQueryTimeoutMs: undefined,
    }

    global.conn = makeWASocket(connectionOptions)
    if (!conn.authState.creds.registered) {
      
      let phoneNumber = global.nomorbot.replace(/\D/g, '')
      const deviceName = global.devicename || 'UBED2407'

      if (!phoneNumber) {
        console.error(chalk.red('❌ Gagal: Nomor bot tidak valid setelah verifikasi.'));
        process.exit(1);
      }

      console.log(chalk.blue('⏳ Mengambil kode pairing untuk perangkat:'), chalk.cyan(deviceName));
      rl.close() 
      
      let code = await conn.requestPairingCode(phoneNumber, deviceName) 
      code = code?.match(/.{1,4}/g)?.join("-") || code
      console.log(chalk.black(chalk.bgGreen('📱 Kode Pairing Anda:')), chalk.white(code))
    }

    conn.isInit = false
    conn.well = false

    if (!opts['test']) {
      if (global.db) {
        setInterval(async () => {
          if (global.db.data) await global.db.write();
          if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', 'serbot'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
        }, 30 * 1000);
      }
    }

    function clearTmp() {
      const tmp = [join(__dirname, './tmp')];
      const filename = [];
      tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))))
      return filename.map((file) => {
        const stats = statSync(file)
        if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file)
        return false
      })
    }

    setInterval(async () => {
      if (global.stopped === 'close' || !conn || !conn.user) return
      const a = await clearTmp()
    }, 180000)

    async function connectionUpdate(update) {
      const {connection, lastDisconnect, isNewLogin} = update;
      global.stopped = connection;
      if (isNewLogin) conn.isInit = true;
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
      if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        await global.reloadHandler(true).catch(console.error)
        global.timestamp.connect = new Date;
      }
      if (global.db.data == null) loadDatabase();
      if (connection == 'open') {
        console.log(chalk.yellow('Terhubung dengan sukses.'))
      }
    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    if (reason == 405) {
      await rmSync("./sessions/" + "creds.json", {recursive: true, force: true}) 
      console.log(chalk.bold.redBright(`Koneksi diganti, Mohon tunggu sebentar saya akan restart...\nJika muncul error, mulai lagi dengan : npm start`)) 
      process.send('reset')}
    if (connection === 'close') {
        if (reason === DisconnectReason.badSession) {
            conn.logger.error(`Sesi buruk, harap hapus folder ${global.authFile} dan pindai lagi.`)
        } else if (reason === DisconnectReason.connectionClosed) {
            conn.logger.warn(`Koneksi ditutup, menyambung kembali...`)
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.connectionLost) {
            conn.logger.warn(`Koneksi hilang dengan server, menyambung kembali...`)
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.connectionReplaced) {
            conn.logger.error(`Koneksi diganti, sesi baru telah dibuka. Harap tutup sesi saat ini terlebih dahulu.`)
        } else if (reason === DisconnectReason.loggedOut) {
            conn.logger.error(`Koneksi ditutup, harap hapus folder ${global.authFile} dan pindai lagi.`)
        } else if (reason === DisconnectReason.restartRequired) {
            conn.logger.info(`Reboot diperlukan, restart server jika mengalami masalah.`)
            await global.reloadHandler(true).catch(console.error)
        } else if (reason === DisconnectReason.timedOut) {
            conn.logger.warn(`Waktu koneksi habis, menyambung kembali...`)
            await global.reloadHandler(true).catch(console.error)
        } else {
            conn.logger.warn(`Alasan pemutusan tidak diketahui. ${reason || ''}: ${connection || ''}`)
            await global.reloadHandler(true).catch(console.error)
        }
    }
    }

    process.on('uncaughtException', console.error)

    let isInit = true;
    let handler = global.handler // Ambil handler yang sudah dimuat
    global.reloadHandler = async function(restatConn) {
      try {
        const Handler = global.handler // Gunakan handler yang sudah di-global-kan
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) {
        console.error(e);
      }
      if (restatConn) {
        const oldChats = global.conn.chats
        try {
          global.conn.ws.close()
        } catch { }
        conn.ev.removeAllListeners()
        global.conn = makeWASocket(connectionOptions, {chats: oldChats})
        isInit = true
      }
      if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler)
        conn.ev.off('connection.update', conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
        conn.ev.off('group-participants.update', conn.participantsUpdate) 
        conn.ev.off('groups.update', conn.groupsUpdate)
        conn.ev.off('message.delete', conn.onDelete) 
      }

      conn.handler = handler.handler.bind(global.conn)
      conn.connectionUpdate = connectionUpdate.bind(global.conn)
      conn.credsUpdate = saveCreds.bind(global.conn, true)
      conn.participantsUpdate = handler.participantsUpdate.bind(global.conn) 
      conn.groupsUpdate = handler.groupsUpdate.bind(global.conn) 
      conn.onDelete = handler.deleteUpdate.bind(global.conn) 

      const currentDateTime = new Date()
      const messageDateTime = new Date(conn.ev)
      if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
      } else {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
      }

      conn.ev.on('messages.upsert', conn.handler)
      conn.ev.on('connection.update', conn.connectionUpdate)
      conn.ev.on('creds.update', conn.credsUpdate)
      conn.ev.on('group-participants.update', conn.participantsUpdate) 
      conn.ev.on('groups.update', conn.groupsUpdate) 
      conn.ev.on('message.delete', conn.onDelete) 
      
      isInit = false
      return true
    };

    const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
    const pluginFilter = filename => /\.js$/.test(filename)
    global.plugins = {}
    async function filesInit() {
      for (let filename of readdirSync(pluginFolder).filter(f => pluginFilter(f) && f !== 'ai-gemini.js')) {
        try {
          let file = global.__filename(join(pluginFolder, filename))
          const module = await import(file)
          global.plugins[filename] = module.default || module
        } catch (e) {
          conn.logger.error(e)
          delete global.plugins[filename]
        }
      }
    }
    filesInit().catch(console.error)

    global.reload = async (_ev, filename) => {
      if (filename === 'ai-gemini.js') return 
      
      if (pluginFilter(filename)) {
        const dir = global.__filename(join(pluginFolder, filename), true);
        if (filename in global.plugins) {
          if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
          else {
            conn.logger.warn(`deleted plugin - '${filename}'`)
            return delete global.plugins[filename]
          }
        } else conn.logger.info(`new plugin - '${filename}'`);
        const err = syntaxerror(readFileSync(dir), filename, {
          sourceType: 'module',
          allowAwaitOutsideFunction: true,
        });
        if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
        else {
          try {
            const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
            global.plugins[filename] = module.default || module;
          } catch (e) {
            conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
          } finally {
            global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
          }
        }
      }
    }
    Object.freeze(global.reload)
    watch(pluginFolder, global.reload)
    await global.reloadHandler()
}

async function runTripleVerification() {
    
    if (!global.ubedkey || !global.pw || !global.nomorbot) {
        console.error(chalk.red('❌ ERROR: Variabel kunci/nomor bot tidak lengkap di settings.js.'));
        process.exit(1);
    }
    
    const phoneNumber = String(global.nomorbot).replace(/\D/g, '');
    const password = global.pw;
    
    let verifyModuleL3;
    try {
        const verifyPath = pathToFileURL(join(__dirname, './lib/scrape.js')).toString();
        verifyModuleL3 = await import(verifyPath);
    } catch (e) {
        console.error(chalk.red(`❌ GAGAL MEMUAT MODUL LAPISAN 3 (lib/scrape.js)!`));
        console.error(e);
        process.exit(1);
    }
    const isVerifiedL3 = await verifyModuleL3.verifyScrapeKey(global.ubedkey, phoneNumber, password.trim());
    if (!isVerifiedL3) {
        console.error(chalk.red('❌ LAPISAN 3 GAGAL. Eksekusi bot dihentikan.'));
        process.exit(1);
    }
    
    // --- LAPISAN 1: VERIFIKASI TERLIHAT (src/baileys.js) ---
    const isVerifiedL1 = await verifyKey(global.ubedkey, phoneNumber, password.trim());
    if (!isVerifiedL1) {
        console.error(chalk.red('❌ LAPISAN 1 GAGAL. Eksekusi bot dihentikan.'));
        process.exit(1);
    }

    let verifyModuleL2;
    try {
        const verifyPath = pathToFileURL(join(__dirname, './plugins/ai-gemini.js')).toString();
        verifyModuleL2 = await import(verifyPath);
    } catch (e) {
        console.error(chalk.red(`❌ GAGAL MEMUAT MODUL LAPISAN 2 (plugins/ai-gemini.js)!`));
        console.error(e);
        process.exit(1);
    }
    
    const isVerifiedL2 = await verifyModuleL2.verifySupabaseKey(global.ubedkey, phoneNumber, password.trim());
    if (!isVerifiedL2) {
        console.error(chalk.red('❌ LAPISAN 2 GAGAL. Eksekusi bot dihentikan.'));
        process.exit(1);
    }
    
    console.log(chalk.yellow('-----------------------------------------'));
    console.log(chalk.bold.greenBright('🎉 Verifikasi Berhasil...'));
    
    await initModules(); 
}

runTripleVerification().then(() => {
    initBaileysConnection();
}).catch(err => {
    console.error(chalk.red('Fatal Error during startup:'), err);
    process.exit(1);
});
