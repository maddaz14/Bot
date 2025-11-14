import { proto, getContentType } from '@fuxxy-star/baileys'
import { jidNormalizedUser } from '@fuxxy-star/baileys'
import { smsg } from './lib/simple.js';
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile, readFileSync } from 'fs'
import chalk from 'chalk'
import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import { resolveWid } from './lib/jid.js'
// >> PERBAIKAN 1: Pastikan settings.js di-import agar global.owner terbaca
import './settings.js' 

const isNumber = x => typeof x === 'number' && !isNaN(x)

let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
})
let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')

let botdate = `${week}, ${date} || ${wibh}:${wibm}:${wibs} WIB`

async function emoji() {
  let emo = [
    "😀", "😂", "😍", "🥺", "😎", "😢", "😡", "😱", "👍", "👎",
    "👏", "💪", "🙏", "🎉", "🎂", "🌟", "🌈", "🔥", "🍎", "🍕",
    "🍔", "🍟", "🍣", "🍜", "🎸", "🎧", "🎤", "🎬", "🏆", "⚽",
    "🏀", "🏈", "🏊", "🚴", "🚗", "✈️", "🚀", "🚂", "🏠", "🌍"
  ];
  let randomIndex = Math.floor(Math.random() * emo.length);
  return emo[randomIndex];
}

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []
  if (!chatUpdate) return
  this.pushMessage(chatUpdate.messages).catch(console.error)
  let m = chatUpdate.messages[chatUpdate.messages.length - 1]

  global.img = 'https://files.catbox.moe/pcdlrg.jpeg'
 

  if (!m) return
  
  // =========================================================================
  // >>> MODIFIKASI UTAMA (CEK BOT SENDIRI) <<<
  // Jika pesan berasal dari bot ini sendiri (m.fromMe), kita harus mencegah loop.
  // Kecuali jika ada opsi 'self' aktif, atau itu adalah pesan yang tidak dikenali Baileys,
  // kita abaikan pesan dari bot.
  if (m.fromMe && !opts['self']) {
    // Pesan dari bot akan diabaikan
    return
  }
  // =========================================================================

  if (global.db.data == null) await global.loadDatabase()

  try {
    m = smsg(this, m) || m
    if (!m) return
    if (!m.text && m.buttonId) m.text = m.buttonId;
    m.exp = 0
    m.limit = false

    try {
      let user = global.db.data.users[m.sender]
      if (typeof user !== "object") global.db.data.users[m.sender] = {}
      if (user) {
        if (!("BannedReason" in user)) user.BannedReason = ""
        if (!("Banneduser" in user)) user.Banneduser = false
        if (!("afkReason" in user)) user.afkReason = ""
        if (!("autolevelup" in user)) user.autolevelup = true
        if (!("banned" in user)) user.banned = false
        if (!("catatan" in user)) user.catatan = ""
        if (!("job" in user)) user.job = ""
        if (!("kingdom" in user)) user.kingdom = true
        if (!("misi" in user)) user.misi = ""
        if (!("pasangan" in user)) user.pasangan = ""
        if (!("premium" in user)) user.premium = false
        if (!("registered" in user)) user.registered = false
        if (!("role" in user)) user.role = "Beginner"
        if (!("sewa" in user)) user.sewa = false
        if (!("skill" in user)) user.skill = ""
        if (!("title" in user)) user.title = ""
        if (!("title2" in user)) user.title2 = ""
        if (!("box" in user)) user.box = []
        if (!("warning" in user)) user.warning = ""

        if (!user.registered) {
          if (!("name" in user)) user.name = m.name
          if (!("gojekName" in user)) user.gojekName = m.gojekName
          if (!isNumber(user.age)) user.age = -1
          if (!isNumber(user.anggur)) user.anggur = 0
          if (!isNumber(user.apel)) user.apel = 0
          if (!isNumber(user.bibitanggur)) user.anggur = 0
          if (!isNumber(user.bibitapel)) user.apel = 0
          if (!isNumber(user.bibitjeruk)) user.jeruk = 0
          if (!isNumber(user.bibitmangga)) user.mangga = 0
          if (!isNumber(user.bibitpisang)) user.pisang = 0
          if (!isNumber(user.emas)) user.emas = 0
          if (!isNumber(user.subscribers)) user.subscribers = 0
          if (!isNumber(user.jeruk)) user.jeruk = 0
          if (!isNumber(user.wood)) user.wood = 0
          if (!isNumber(user.makanan)) user.makanan = 0
          if (!isNumber(user.mangga)) user.mangga = 0
          if (!isNumber(user.pisang)) user.pisang = 0
          if (!isNumber(user.premiumDate)) user.premiumDate = -1
          if (!isNumber(user.regTime)) user.regTime = -1
          if (!isNumber(user.semangka)) user.semangka = 0
          if (!isNumber(user.stroberi)) user.stroberi = 0
        }

        if (!isNumber(user.afk)) user.afk = -1
        if (!isNumber(user.gojekRegistered)) user.gojekRegistered = false
        if (!isNumber(user.gojekLevel)) user.gojekLevel = 1
        if (!isNumber(user.gojekExp)) user.gojekExp = 0
        if (!isNumber(user.gojekBalance)) user.gojekBalance = 0
        if (!isNumber(user.gojekCooldown)) user.gojekCooldown = 0
        if (!isNumber(user.herbal)) user.herbal = 0
        if (!isNumber(user.attack)) user.attack = 0
        if (!isNumber(user.aerozine)) user.aerozine = 0
        if (isNumber(user.fuel)) user.fuel = 0
        if (!isNumber(user.saldo)) user.saldo = 0
        if (!isNumber(user.tiketcn)) user.tiketcn = 1
        if (!isNumber(user.email)) user.email = 0
        if (!isNumber(user.playButton)) user.playButton = 0
        if (!isNumber(user.like)) user.like = 0
        if (!isNumber(user.viewers)) user.viewers = 0
        if (!isNumber(user.code)) user.code = 0
        if (!isNumber(user.subscribers)) user.subscribers = 0
        if (!isNumber(user.warning)) user.warning = 0
        if (!isNumber(user.likeinstagram)) user.likeinstagram = 0
        if (!isNumber(user.followers)) user.followers = 0
        if (!isNumber(user.agility)) user.agility = 0
        if (!isNumber(user.lastopenbo)) user.lastopenbo = 0
        if (!isNumber(user.anakanjing)) user.anakanjing = 0
        if (!isNumber(user.anakcentaur)) user.anakcentaur = 0
        if (!isNumber(user.anakgriffin)) user.anakgriffin = 0
        if (!isNumber(user.petfood)) user.petfood = 0
        if (!isNumber(user.balance)) user.balance = 0
        if (!isNumber(user.levelGojek)) user.levelGojek = 1
        if (!isNumber(user.progressGojek)) user.progressGojek = 0
        if (!isNumber(user.lastGojek)) user.lastGojek = 0
        if (!isNumber(user.pemburuLevel)) user.pemburuLevel = 1
        if (!isNumber(user.pemburuProgres)) user.pemburuProgres = 0
        if (!isNumber(user.pemburuTargetKilled)) user.pemburuTargetKilled = 0
        if (!isNumber(user.pemburuTargetLoss)) user.pemburuTargetLoss = 0
        if (!isNumber(user.lastpemburu)) user.lastpemburu = 0
        if (!isNumber(user.anakkucing)) user.anakkucing = 0
        if (!isNumber(user.anakkuda)) user.anakkuda = 0
        if (!isNumber(user.anakkyubi)) user.anakkyubi = 0
        if (!isNumber(user.anaknaga)) user.anaknaga = 0
        if (!isNumber(user.anakpancingan)) user.anakpancingan = 0
        if (!isNumber(user.anakphonix)) user.anakphonix = 0
        if (!isNumber(user.anakrubah)) user.anakrubah = 0
        if (!isNumber(user.anakserigala)) user.anakserigala = 0
        if (!isNumber(user.anggur)) user.anggur = 0
        if (!isNumber(user.anjing)) user.anjing = 0
        if (!isNumber(user.anjinglastclaim)) user.anjinglastclaim = 0
        if (!isNumber(user.antispam)) user.antispam = 0
        if (!isNumber(user.antispamlastclaim)) user.antispamlastclaim = 0
        if (!isNumber(user.apel)) user.apel = 0
        if (!isNumber(user.aqua)) user.aqua = 0
        if (!isNumber(user.arc)) user.arc = 0
        if (!isNumber(user.arcdurability)) user.arcdurability = 0
        if (!isNumber(user.arlok)) user.arlok = 0
        if (!isNumber(user.armor)) user.armor = 0
        if (!isNumber(user.armordurability)) user.armordurability = 0
        if (!isNumber(user.armormonster)) user.armormonster = 0
        if (!isNumber(user.as)) user.as = 0
        if (!isNumber(user.atm)) user.atm = 1
        if (!isNumber(user.axe)) user.axe = 0
        if (!isNumber(user.axedurability)) user.axedurability = 0
        if (!isNumber(user.ayam)) user.ayam = 0
        if (!isNumber(user.ayamb)) user.ayamb = 0
        if (!isNumber(user.ayambakar)) user.ayambakar = 0
        if (!isNumber(user.ayamg)) user.ayamg = 0
        if (!isNumber(user.ayamgoreng)) user.ayamgoreng = 0
        if (!isNumber(user.babi)) user.babi = 0
        if (!isNumber(user.banExpires)) user.banExpires = 0
        if (!isNumber(user.babihutan)) user.babihutan = 0
        if (!isNumber(user.babipanggang)) user.babipanggang = 0
        if (!isNumber(user.bandage)) user.bandage = 0
        if (!isNumber(user.bank)) user.bank = 0
        if (!isNumber(user.banteng)) user.banteng = 0
        if (!isNumber(user.batu)) user.batu = 0
        if (!isNumber(user.bawal)) user.bawal = 0
        if (!isNumber(user.bawalbakar)) user.bawalbakar = 0
        if (!isNumber(user.bayam)) user.bayam = 0
        if (!isNumber(user.berlian)) user.berlian = 10
        if (!isNumber(user.bibitanggur)) user.bibitanggur = 0
        if (!isNumber(user.bibitapel)) user.bibitapel = 0
        if (!isNumber(user.bibitjeruk)) user.bibitjeruk = 0
        if (!isNumber(user.bibitmangga)) user.bibitmangga = 0
        if (!isNumber(user.bibitpisang)) user.bibitpisang = 0
        if (!isNumber(user.botol)) user.botol = 0
        if (!isNumber(user.gelas)) user.gelas = 0
        if (!isNumber(user.plastik)) user.plastik = 0
        if (!isNumber(user.bow)) user.bow = 0
        if (!isNumber(user.bowdurability)) user.bowdurability = 0
        if (!isNumber(user.boxs)) user.boxs = 0
        if (!isNumber(user.brick)) user.brick = 0
        if (!isNumber(user.brokoli)) user.brokoli = 0
        if (!isNumber(user.buaya)) user.buaya = 0
        if (!isNumber(user.buntal)) user.buntal = 0
        if (!isNumber(user.cat)) user.cat = 0
        if (!isNumber(user.catexp)) user.catexp = 0
        if (!isNumber(user.catlastfeed)) user.catlastfeed = 0
        if (!isNumber(user.centaur)) user.centaur = 0
        if (!isNumber(user.centaurexp)) user.centaurexp = 0
        if (!isNumber(user.centaurlastclaim)) user.centaurlastclaim = 0
        if (!isNumber(user.centaurlastfeed)) user.centaurlastfeed = 0
        if (!isNumber(user.clay)) user.clay = 0
        if (!isNumber(user.coal)) user.coal = 0
        if (!isNumber(user.coin)) user.coin = 0
        if (!isNumber(user.common)) user.common = 0
        if (!isNumber(user.crystal)) user.crystal = 0
        if (!isNumber(user.fruits)) user.fruits = 0
        if (!isNumber(user.cumi)) user.cumi = 0
        if (!isNumber(user.cupon)) user.cupon = 0
        if (!isNumber(user.diamond)) user.diamond = 0
        if (!isNumber(user.damage)) user.damage = 0
        if (!isNumber(user.dog)) user.dog = 0
        if (!isNumber(user.dogexp)) user.dogexp = 0
        if (!isNumber(user.doglastfeed)) user.doglastfeed = 0
        if (!isNumber(user.dory)) user.dory = 0
        if (!isNumber(user.dragon)) user.dragon = 0
        if (!isNumber(user.dragonexp)) user.dragonexp = 0
        if (!isNumber(user.dragonlastfeed)) user.dragonlastfeed = 0
        if (!isNumber(user.emas)) user.emas = 0
        if (!isNumber(user.emerald)) user.emerald = 0
        if (!isNumber(user.enchant)) user.enchant = 0
        if (!isNumber(user.esteh)) user.esteh = 0
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.expg)) user.expg = 0
        if (!isNumber(user.exphero)) user.exphero = 0
        if (!isNumber(user.fishingrod)) user.fishingrod = 0
        if (!isNumber(user.fishingroddurability)) user.fishingroddurability = 0
        if (!isNumber(user.fortress)) user.fortress = 0
        if (!isNumber(user.fox)) user.fox = 0
        if (!isNumber(user.foxexp)) user.foxexp = 0
        if (!isNumber(user.foxlastfeed)) user.foxlastfeed = 0
        if (!isNumber(user.fullatm)) user.fullatm = Infinity
        if (!isNumber(user.gadodado)) user.gadodado = 0
        if (!isNumber(user.gajah)) user.gajah = 0
        if (!isNumber(user.gamemines)) user.gamemines = false
        if (!isNumber(user.ganja)) user.ganja = 0
        if (!isNumber(user.gardenboxs)) user.gardenboxs = 0
        if (!isNumber(user.gems)) user.gems = 0
        if (!isNumber(user.glass)) user.glass = 0
        if (!isNumber(user.glimit)) user.glimit = 20
        if (!isNumber(user.glory)) user.glory = 0
        if (!isNumber(user.gold)) user.gold = 0
        if (!isNumber(user.griffin)) user.griffin = 0
        if (!isNumber(user.griffinexp)) user.griffinexp = 0
        if (!isNumber(user.griffinlastclaim)) user.griffinlastclaim = 0
        if (!isNumber(user.griffinlastfeed)) user.griffinlastfeed = 0
        if (!isNumber(user.gulai)) user.gulai = 0
        if (!isNumber(user.gurita)) user.gurita = 0
        if (!isNumber(user.harimau)) user.harimau = 0
        if (!isNumber(user.haus)) user.haus = 100
        if (!isNumber(user.healt)) user.healt = 500
        if (!isNumber(user.hdUses)) user.hdUses = 0
        if (!isNumber(user.health)) user.health = 500
        if (!isNumber(user.healthmonster)) user.healthmonster = 0
        if (!isNumber(user.healtmonster)) user.healtmonster = 0
        if (!isNumber(user.hero)) user.hero = 1
        if (!isNumber(user.herolastclaim)) user.herolastclaim = 0
        if (!isNumber(user.hiu)) user.hiu = 0
        if (!isNumber(user.horse)) user.horse = 0
        if (!isNumber(user.horseexp)) user.horseexp = 0
        if (!isNumber(user.horselastfeed)) user.horselastfeed = 0
        if (!isNumber(user.ikan)) user.ikan = 0
        if (!isNumber(user.ikanbakar)) user.ikanbakar = 0
        if (!isNumber(user.intelligence)) user.intelligence = 0
        if (!isNumber(user.iron)) user.iron = 0
        if (!isNumber(user.jagung)) user.jagung = 0
        if (!isNumber(user.jagungbakar)) user.jagungbakar = 0
        if (!isNumber(user.jeruk)) user.jeruk = 0
        if (!isNumber(user.joinlimit)) user.joinlimit = 1
        if (!isNumber(user.judilast)) user.judilast = 0
        if (!isNumber(user.kaleng)) user.kaleng = 0
        if (!isNumber(user.kambing)) user.kambing = 0
        if (!isNumber(user.kangkung)) user.kangkung = 0
        if (!isNumber(user.kapak)) user.kapak = 0
        if (!isNumber(user.kardus)) user.kardus = 0
        if (!isNumber(user.katana)) user.katana = 0
        if (!isNumber(user.katanadurability)) user.katanadurability = 0
        if (!isNumber(user.wood)) user.wood = 0
        if (!isNumber(user.kentang)) user.kentang = 0
        if (!isNumber(user.kentanggoreng)) user.kentanggoreng = 0
        if (!isNumber(user.kepiting)) user.kepiting = 0
        if (!isNumber(user.kepitingbakar)) user.kepitingbakar = 0
        if (!isNumber(user.kerbau)) user.kerbau = 0
        if (!isNumber(user.kerjadelapan)) user.kerjadelapan = 0
        if (!isNumber(user.kerjadelapanbelas)) user.kerjadelapanbelas = 0
        if (!isNumber(user.kerjadua)) user.kerjadua = 0
        if (!isNumber(user.kerjaduabelas)) user.kerjaduabelas = 0
        if (!isNumber(user.kerjaduadelapan)) user.kerjaduadelapan = 0
        if (!isNumber(user.kerjaduadua)) user.kerjaduadua = 0
        if (!isNumber(user.kerjaduaempat)) user.kerjaduaempat = 0
        if (!isNumber(user.kerjaduaenam)) user.kerjaduaenam = 0
        if (!isNumber(user.kerjadualima)) user.kerjadualima = 0
        if (!isNumber(user.kerjaduapuluh)) user.kerjaduapuluh = 0
        if (!isNumber(user.kerjaduasatu)) user.kerjaduasatu = 0
        if (!isNumber(user.kerjaduasembilan)) user.kerjaduasembilan = 0
        if (!isNumber(user.kerjaduatiga)) user.kerjaduatiga = 0
        if (!isNumber(user.kerjaduatujuh)) user.kerjaduatujuh = 0
        if (!isNumber(user.kerjaempat)) user.kerjaempat = 0
        if (!isNumber(user.kerjaempatbelas)) user.kerjaempatbelas = 0
        if (!isNumber(user.kerjaenam)) user.kerjaenam = 0
        if (!isNumber(user.kerjaenambelas)) user.kerjaenambelas = 0
        if (!isNumber(user.kerjalima)) user.kerjalima = 0
        if (!isNumber(user.kerjalimabelas)) user.kerjalimabelas = 0
        if (!isNumber(user.kerjasatu)) user.kerjasatu = 0
        if (!isNumber(user.kerjasebelas)) user.kerjasebelas = 0
        if (!isNumber(user.kerjasembilan)) user.kerjasembilan = 0
        if (!isNumber(user.kerjasembilanbelas)) user.kerjasembilanbelas = 0
        if (!isNumber(user.kerjasepuluh)) user.kerjasepuluh = 0
        if (!isNumber(user.kerjatiga)) user.kerjatiga = 0
        if (!isNumber(user.kerjatigabelas)) user.kerjatigabelas = 0
        if (!isNumber(user.kerjatigapuluh)) user.kerjatigapuluh = 0
        if (!isNumber(user.kerjatujuh)) user.kerjatujuh = 0
        if (!isNumber(user.kerjatujuhbelas)) user.kerjatujuhbelas = 0
        if (!isNumber(user.korbanngocok)) user.korbanngocok = 0
        if (!isNumber(user.kubis)) user.kubis = 0
        if (!isNumber(user.kucing)) user.kucing = 0
        if (!isNumber(user.kucinglastclaim)) user.kucinglastclaim = 0
        if (!isNumber(user.kuda)) user.kuda = 0
        if (!isNumber(user.kudalastclaim)) user.kudalastclaim = 0
        if (!isNumber(user.kyubi)) user.kyubi = 0
        if (!isNumber(user.kyubiexp)) user.kyubiexp = 0
        if (!isNumber(user.kyubilastclaim)) user.kyubilastclaim = 0
        if (!isNumber(user.kyubilastfeed)) user.kyubilastfeed = 0
        if (!isNumber(user.labu)) user.labu = 0
        if (!isNumber(user.laper)) user.laper = 100
        if (!isNumber(user.lastadventure)) user.lastadventure = 0
        if (!isNumber(user.lastExploring)) user.lastExploring = 0
        if (!isNumber(user.lastbansos)) user.lastbansos = 0
        if (!isNumber(user.lastberbru)) user.lastberbru = 0
        if (!isNumber(user.lastyoutuber)) user.lastyoutuber = 0
        if (!isNumber(user.lastReset2)) user.lastReset2 = 0
        if (!isNumber(user.subscribers)) user.subscribers = 0
        if (!isNumber(user.lastberburu)) user.lastberburu = 0
        if (!isNumber(user.lastberkebon)) user.lastberkebon = 0
        if (!isNumber(user.lastbunga)) user.lastbunga = 0
        if (!isNumber(user.lastngewe)) user.lastngewe = 0
        if (!isNumber(user.lastbunuhi)) user.lastbunuhi = 0
        if (!isNumber(user.lastclaim)) user.lastclaim = 0
        if (!isNumber(user.lastcode)) user.lastcode = 0
        if (!isNumber(user.lastTrade)) user.lastTrade = 0
        if (!isNumber(user.lastcodereg)) user.lastcodereg = 0
        if (!isNumber(user.lastcrusade)) user.lastcrusade = 0
        if (!isNumber(user.lastbossbattle)) user.lastbossbattle = 0
        if (!isNumber(user.lastdagang)) user.lastdagang = 0
        if (!isNumber(user.lastduel)) user.lastduel = 0
        if (!isNumber(user.lastdungeon)) user.lastdungeon = 0
        if (!isNumber(user.lastdungeon1)) user.lastdungeon1 = 0
        if (!isNumber(user.lastdungeon2)) user.lastdungeon2 = 0
        if (!isNumber(user.lastdungeon3)) user.lastdungeon3 = 0
        if (!isNumber(user.lastdungeon4)) user.lastdungeon = 0
        if (!isNumber(user.lasteasy)) user.lasteasy = 0
        if (!isNumber(user.lastfight)) user.lastfight = 0
        if (!isNumber(user.lastfishing)) user.lastfishing = 0
        if (!isNumber(user.lastgift)) user.lastgift = 0
        if (!isNumber(user.lastgojek)) user.lastgojek = 0
        if (!isNumber(user.lastgrab)) user.lastgrab = 0
        if (!isNumber(user.lasthourly)) user.lasthourly = 0
        if (!isNumber(user.lasthunt)) user.lasthunt = 0
        if (!isNumber(user.lastIstigfar)) user.lastIstigfar = 0
        if (!isNumber(user.lastjb)) user.lastjb = 0
        if (!isNumber(user.lastkill)) user.lastkill = 0
        if (!isNumber(user.lastlink)) user.lastlink = 0
        if (!isNumber(user.lastlumber)) user.lastlumber = 0
        if (!isNumber(user.lastmancingeasy)) user.lastmancingeasy = 0
        if (!isNumber(user.lastAstronot)) user.lastAstronot = 0
        if (!isNumber(user.lastmancingextreme)) user.lastmancingextreme = 0
        if (!isNumber(user.lastmancinghard)) user.lastmancinghard = 0
        if (!isNumber(user.lastmancingnormal)) user.lastmancingnormal = 0
        if (!isNumber(user.lastmining)) user.lastmining = 0
        if (!isNumber(user.lastmisi)) user.lastmisi = 0
        if (!isNumber(user.lastmission)) user.lastmission = 0
        if (!isNumber(user.lastmonthly)) user.lastmonthly = 0
        if (!isNumber(user.lastmulung)) user.lastmulung = 0
        if (!isNumber(user.lastbisnis)) user.lastbisnis = 0
        if (!isNumber(user.lastnambang)) user.lastnambang = 0
        if (!isNumber(user.lastnebang)) user.lastnebang = 0
        if (!isNumber(user.lastngocok)) user.lastngocok = 0
        if (!isNumber(user.lastngojek)) user.lastngojek = 0
        if (!isNumber(user.lastPolisi)) user.lastPolisi = 0
        if (!isNumber(user.lastopen)) user.lastopen = 0
        if (!isNumber(user.lastpekerjaan)) user.lastpekerjaan = 0
        if (!isNumber(user.lastpotionclaim)) user.lastpotionclaim = 0
        if (!isNumber(user.lastrampok)) user.lastrampok = 0
        if (!isNumber(user.lastramuanclaim)) user.lastramuanclaim = 0
        if (!isNumber(user.lastrob)) user.lastrob = 0
        if (!isNumber(user.lastroket)) user.lastroket = 0
        if (!isNumber(user.lastsda)) user.lastsda = 0
        if (!isNumber(user.lastseen)) user.lastseen = 0
        if (!isNumber(user.lastSetStatus)) user.lastSetStatus = 0
        if (!isNumber(user.lastsironclaim)) user.lastsironclaim = 0
        if (!isNumber(user.lastsmancingclaim)) user.lastsmancingclaim = 0
        if (!isNumber(user.laststringclaim)) user.laststringclaim = 0
        if (!isNumber(user.lastswordclaim)) user.lastswordclaim = 0
        if (!isNumber(user.lastturu)) user.lastturu = 0
        if (!isNumber(user.lastwar)) user.lastwar = 0
        if (!isNumber(user.lastwarpet)) user.lastwarpet = 0
        if (!isNumber(user.lastweaponclaim)) user.lastweaponclaim = 0
        if (!isNumber(user.lastweekly)) user.lastweekly = 0
        if (!isNumber(user.lastwork)) user.lastwork = 0
        if (!isNumber(user.legendary)) user.legendary = 0
        if (!isNumber(user.lele)) user.lele = 0
        if (!isNumber(user.leleb)) user.leleb = 0
        if (!isNumber(user.lelebakar)) user.lelebakar = 0
        if (!isNumber(user.leleg)) user.leleg = 0
        if (!isNumber(user.level)) user.level = 0
        if (!isNumber(user.limit)) user.limit = 10
        if (!isNumber(user.limitjoinfree)) user.limitjoinfree = 1
        if (!isNumber(user.lion)) user.lion = 0
        if (!isNumber(user.lionexp)) user.lionexp = 0
        if (!isNumber(user.lionlastfeed)) user.lionlastfeed = 0
        if (!isNumber(user.lobster)) user.lobster = 0
        if (!isNumber(user.lumba)) user.lumba = 0
        if (!isNumber(user.magicwand)) user.magicwand = 0
        if (!isNumber(user.magicwanddurability)) user.magicwanddurability = 0
        if (!isNumber(user.makanancentaur)) user.makanancentaur = 0
        if (!isNumber(user.makanangriffin)) user.makanangriffin = 0
        if (!isNumber(user.makanankyubi)) user.makanankyubi = 0
        if (!isNumber(user.makanannaga)) user.makanannaga = 0
        if (!isNumber(user.makananpet)) user.makananpet = 0
        if (!isNumber(user.makananphonix)) user.makananphonix = 0
        if (!isNumber(user.makananserigala)) user.makananserigala = 0
        if (!isNumber(user.mana)) user.mana = 0
        if (!isNumber(user.mangga)) user.mangga = 0
        if (!isNumber(user.eris)) user.eris = 0
        if (!isNumber(user.monyet)) user.monyet = 0
        if (!isNumber(user.mythic)) user.mythic = 0
        if (!isNumber(user.moderatorV2)) user.moderatorV2 = 0
        if (!isNumber(user.naga)) user.naga = 0
        if (!isNumber(user.nagalastclaim)) user.nagalastclaim = 0
        if (!isNumber(user.net)) user.net = 0
        if (!isNumber(user.nila)) user.nila = 0
        if (!isNumber(user.nilabakar)) user.nilabakar = 0
        if (!isNumber(user.ojekk)) user.ojekk = 0
        if (!isNumber(user.ngewe)) user.ngewe = 0
        if (!isNumber(user.oporayam)) user.oporayam = 0
        if (!isNumber(user.orca)) user.orca = 0
        if (!isNumber(user.pancing)) user.pancing = 0
        if (!isNumber(user.pancingan)) user.pancingan = 0
        if (!isNumber(user.pistol)) user.pistol = 0
        if (!isNumber(user.peluru)) user.peluru = 0
        if (!isNumber(user.pancingandurability)) user.pancingandurability = 100
        if (!isNumber(user.panda)) user.panda = 0
        if (!isNumber(user.paus)) user.paus = 0
        if (!isNumber(user.gulaiayam)) user.gulaiayam = 0
        if (!isNumber(user.pausbakar)) user.pausbakar = 0
        if (!isNumber(user.pc)) user.pc = 0
        if (!isNumber(user.pepesikan)) user.pepesikan = 0
        if (!isNumber(user.pertambangan)) user.pertambangan = 0
        if (!isNumber(user.pertanian)) user.pertanian = 0
        if (!isNumber(user.pet)) user.pet = 0
        if (!isNumber(user.petFood)) user.petFood = 0
        if (!isNumber(user.phonix)) user.phonix = 0
        if (!isNumber(user.phonixexp)) user.phonixexp = 0
        if (!isNumber(user.phonixlastclaim)) user.phonixlastclaim = 0
        if (!isNumber(user.phonixlastfeed)) user.phonixlastfeed = 0
        if (!isNumber(user.pickaxe)) user.pickaxe = 0
        if (!isNumber(user.pickaxedurability)) user.pickaxedurability = 0
        if (!isNumber(user.pillhero)) user.pillhero = 0
        if (!isNumber(user.pisang)) user.pisang = 0
        if (!isNumber(user.pointxp)) user.pointxp = 0
        if (!isNumber(user.potion)) user.potion = 0
        if (!isNumber(user.psenjata)) user.psenjata = 0
        if (!isNumber(user.psepick)) user.psepick = 0
        if (!isNumber(user.ramuan)) user.ramuan = 0
        if (!isNumber(user.ramuancentaurlast)) user.ramuancentaurlast = 0
        if (!isNumber(user.pertambangan)) user.pertambangan = 0
        if (!isNumber(user.ramuangriffinlast)) user.ramuangriffinlast = 0
        if (!isNumber(user.ramuanherolast)) user.ramuanherolast = 0
        if (!isNumber(user.ramuankucinglast)) user.ramuankucinglast = 0
        if (!isNumber(user.ramuankudalast)) user.ramuankudalast = 0
        if (!isNumber(user.ramuankyubilast)) user.ramuankyubilast = 0
        if (!isNumber(user.ramuannagalast)) user.ramuannagalast = 0
        if (!isNumber(user.ramuanphonixlast)) user.ramuanphonixlast = 0
        if (!isNumber(user.ramuanrubahlast)) user.ramuanrubahlast = 0
        if (!isNumber(user.ramuanserigalalast)) user.ramuanserigalalast = 0
        if (!isNumber(user.reglast)) user.reglast = 0
        if (!isNumber(user.rendang)) user.rendang = 0
        if (!isNumber(user.rhinoceros)) user.rhinoceros = 0
        if (!isNumber(user.rhinocerosexp)) user.rhinocerosexp = 0
        if (!isNumber(user.rhinoceroslastfeed)) user.rhinoceroslastfeed = 0
        if (!isNumber(user.robo)) user.robo = 0
        if (!isNumber(user.roboxp)) user.roboxp = 0
        if (!isNumber(user.rock)) user.rock = 0
        if (!isNumber(user.roket)) user.roket = 0
        if (!isNumber(user.roti)) user.roti = 0
        if (!isNumber(user.rubah)) user.rubah = 0
        if (!isNumber(user.rubahlastclaim)) user.rubahlastclaim = 0
        if (!isNumber(user.rumahsakit)) user.rumahsakit = 0
        if (!isNumber(user.sampah)) user.sampah = 0
        if (!isNumber(user.shield)) user.shield = 0
        if (!isNumber(user.shieldDurability)) user.shieldDurability = 0
        if (!isNumber(user.sand)) user.sand = 0
        if (!isNumber(user.sapi)) user.sapi = 0
        if (!isNumber(user.sapir)) user.sapir = 0
        if (!isNumber(user.seedbayam)) user.seedbayam = 0
        if (!isNumber(user.seedbrokoli)) user.seedbrokoli = 0
        if (!isNumber(user.seedjagung)) user.seedjagung = 0
        if (!isNumber(user.seedkangkung)) user.seedkangkung = 0
        if (!isNumber(user.seedkentang)) user.seedkentang = 0
        if (!isNumber(user.seedkubis)) user.seedkubis = 0
        if (!isNumber(user.seedlabu)) user.seedlabu = 0
        if (!isNumber(user.seedtomat)) user.seedtomat = 0
        if (!isNumber(user.seedwortel)) user.seedwortel = 0
        if (!isNumber(user.serigala)) user.serigala = 0
        if (!isNumber(user.serigalalastclaim)) user.serigalalastclaim = 0
        if (!isNumber(user.shield)) user.shield = false
        if (!isNumber(user.skillexp)) user.skillexp = 0
        if (!isNumber(user.snlast)) user.snlast = 0
        if (!isNumber(user.soda)) user.soda = 0
        if (!isNumber(user.sop)) user.sop = 0
        if (!isNumber(user.spammer)) user.spammer = 0
        if (!isNumber(user.spinlast)) user.spinlast = 0
        if (!isNumber(user.ssapi)) user.ssapi = 0
        if (!isNumber(user.stamina)) user.stamina = 100
        if (!isNumber(user.steak)) user.steak = 0
        if (!isNumber(user.stick)) user.stick = 0
        if (!isNumber(user.trash)) user.trash = 0
        if (!isNumber(user.strength)) user.strength = 0
        if (!isNumber(user.string)) user.string = 0
        if (!isNumber(user.superior)) user.superior = 0
        if (!isNumber(user.suplabu)) user.suplabu = 0
        if (!isNumber(user.sushi)) user.sushi = 0
        if (!isNumber(user.sword)) user.sword = 0
        if (!isNumber(user.sworddurability)) user.sworddurability = 0
        if (!isNumber(user.tigame)) user.tigame = 50
        if (!isNumber(user.tiketcoin)) user.tiketcoin = 0
        if (!isNumber(user.title)) user.title = 0
        if (!isNumber(user.tomat)) user.tomat = 0
        if (!isNumber(user.tprem)) user.tprem = 0
        if (!isNumber(user.trash)) user.trash = 0
        if (!isNumber(user.trofi)) user.trofi = 0
        if (!isNumber(user.troopcamp)) user.troopcamp = 0
        if (!isNumber(user.tumiskangkung)) user.tumiskangkung = 0
        if (!isNumber(user.udang)) user.udang = 0
        if (!isNumber(user.udangbakar)) user.udangbakar = 0
        if (!isNumber(user.umpan)) user.umpan = 0
        if (!isNumber(user.uncommon)) user.uncommon = 0
        if (!isNumber(user.unreglast)) user.unreglast = 0
        if (!isNumber(user.upgrader)) user.upgrader = 0
        if (!isNumber(user.vodka)) user.vodka = 0
        if (!isNumber(user.waifu)) user.waifu = ""
        if (!isNumber(user.wallet)) user.wallet = 0
        if (!isNumber(user.warn)) user.warn = 0
        if (!isNumber(user.weapon)) user.weapon = 0
        if (!isNumber(user.weapondurability)) user.weapondurability = 0
        if (!isNumber(user.wolf)) user.wolf = 0
        if (!isNumber(user.warn2)) user.warn2 = 0
        if (!isNumber(user.wolfexp)) user.wolfexp = 0
        if (!isNumber(user.wolflastfeed)) user.wolflastfeed = 0
        if (!isNumber(user.wood)) user.wood = 0
        if (!isNumber(user.limitUsedToday)) user.limitUsedToday = 0
        if (!isNumber(user.wortel)) user.wortel = 0
        if (!isNumber(user.shield)) user.shield = 0
        if (!isNumber(user.wizardhat)) user.wizardhat = 0
        if (!isNumber(user.wand)) user.wand = 0
        if (!isNumber(user.guilds)) user.guilds = 0
        if (!isNumber(user.guildRequests)) user.guildRequests = 0
        if (!isNumber(user.magicalitem)) user.magicalitem = 0
        if (!isNumber(user.mushrooms)) user.mushrooms = 0
        if (!isNumber(user.stone)) user.stone = 0
        if (!isNumber(user.herbs)) user.herbs = 0
        if (!isNumber(user.followers2)) user.followers2 = 0
        if (!isNumber(user.likes2)) user.likes2 = 0
        if (!isNumber(user.comments2)) user.comments2 = 0
        if (!isNumber(user.shares2)) user.shares = 0
        if (!isNumber(user.feathers)) user.feathers = 0
        if (!isNumber(user.magicalitemdurability)) user.magicalitemdurability = 0

        if (!user.lbars) user.lbars = "[▒▒▒▒▒▒▒▒▒]"
        if (!user.job) user.job = "Pengangguran"
        if (!user.premium) user.premium = false
        if (!user.premium) user.premiumTime = 0
        if (!user.rtrofi) user.rtrofi = "Perunggu"
        if (!isNumber(user.limitjoin)) user.limitjoin = 0
      } else
        global.db.data.users[m.sender] = {
          afk: -1,
          box: [],
          herbal: 0,
          gojekLevel: 1,
          gojelExp: 0,
          gojekBalance: 0,
          gojekCooldown: 0,
          shares2: 0,
          comments2: 0,
          likes2: 0,
          followers: 0,
          stone: 0,
          aerozine: 0,
          herbs: 0,
          feathers: 0,
          mushrooms: 0,
          guilds: 0,
          guildRequests: 0,
          attack: 0,
          fuel: 0,
          levelGojek: 1,
          progressGojek: 0,
          lastGojek: 0,
          pemburuLevel: 1,
          pemburuProgres: 0,
          pemburuTargetKilled: 0,
          pemburuTargetLoss: 0,
          lastpemburu: 0,
          saldo: 0,
          tiketcn: 1,
          playButton: 0,
          like: 0,
          viewers: 0,
          shield: 0,
          wizardhat: 0,
          subscribers: 0,
          wand: 0,
          magicalitem: 0,
          magicalitemdurability: 0,
          email: 0,
          code: 0,
          warning: 0,
          afkReason: "",
          age: -1,
          likeinstagram: 0,
          followers: 0,
          fruits: 0,
          agility: 16,
          anakanjing: 0,
          anakcentaur: 0,
          anakgriffin: 0,
          anakkucing: 0,
          anakkuda: 0,
          anakkyubi: 0,
          anaknaga: 0,
          anakpancingan: 0,
          anakphonix: 0,
          anakrubah: 0,
          anakserigala: 0,
          anggur: 0,
          anjing: 0,
          anjinglastclaim: 0,
          lastopenbo: 0,
          lastExploring: 0,
          antispam: 0,
          antispamlastclaim: 0,
          apel: 0,
          aqua: 0,
          arc: 0,
          arcdurability: 0,
          arlok: 0,
          armor: 0,
          armordurability: 0,
          armormonster: 0,
          as: 0,
          atm: 1,
          autolevelup: true,
          axe: 0,
          axedurability: 0,
          ayam: 0,
          ayamb: 0,
          ayambakar: 0,
          ayamg: 0,
          ayamgoreng: 0,
          babi: 0,
          banExpires: 0,
          babihutan: 0,
          babipanggang: 0,
          bandage: 0,
          bank: 2000,
          banned: false,
          BannedReason: "",
          Banneduser: false,
          banteng: 0,
          batu: 0,
          balance: 0,
          bawal: 0,
          bawalbakar: 0,
          bayam: 0,
          berlian: 100,
          bibitanggur: 0,
          bibitapel: 0
,          bibitjeruk: 0,
          bibitmangga: 0,
          bibitpisang: 0,
          botol: 0,
          damage: 0,
          gelas: 0,
          plastik: 0,
          petfood: 0,
          bow: 0,
          bowdurability: 0,
          boxs: 0,
          brick: 0,
          brokoli: 0,
          buaya: 0,
          buntal: 0,
          cat: 0,
          catlastfeed: 0,
          catngexp: 0,
          centaur: 0,
          centaurexp: 0,
          centaurlastclaim: 0,
          centaurlastfeed: 0,
          clay: 0,
          coal: 0,
          coin: 0,
          common: 0,
          crystal: 0,
          cumi: 0,
          cupon: 0,
          diamond: 0,
          dog: 0,
          dogexp: 0,
          doglastfeed: 0,
          dory: 0,
          dragon: 0,
          dragonexp: 0,
          dragonlastfeed: 0,
          emas: 0,
          emerald: 0,
          esteh: 0,
          exp: 0,
          expg: 0,
          exphero: 0,
          expired: 0,
          fishingrod: 0,
          fishingroddurability: 0,
          fortress: 0,
          fox: 0,
          foxexp: 0,
          foxlastfeed: 0,
          fullatm: Infinity,
          gadodado: 0,
          gajah: 0,
          gamemines: false,
          ganja: 0,
          gardenboxs: 0,
          gems: 0,
          glass: 0,
          gold: 0,
          griffin: 0,
          griffinexp: 0,
          griffinlastclaim: 0,
          griffinlastfeed: 0,
          gulai: 0,
          gurita: 0,
          harimau: 0,
          haus: 100,
          healt: 500,
          health: 500,
          healtmonster: 100,
          hero: 1,
          herolastclaim: 0,
          hiu: 0,
          hdUses: 0,
          horse: 0,
          horseexp: 0,
          horselastfeed: 0,
          ikan: 0,
          ikanbakar: 0,
          intelligence: 10,
          iron: 0,
          jagung: 0,
          jagungbakar: 0,
          jeruk: 0,
          job: "Pengangguran",
          joinlimit: 1,
          judilast: 0,
          kaleng: 0,
          kambing: 0,
          kangkung: 0,
          kapak: 0,
          kardus: 0,
          katana: 0,
          katanadurability: 0,
          wood: 0,
          limitUsedToday: 0,
          kentang: 0,
          kentanggoreng: 0,
          kepiting: 0,
          kepitingbakar: 0,
          kerbau: 0,
          kerjadelapan: 0,
          kerjadelapanbelas: 0,
          kerjadua: 0,
          kerjaduabelas: 0,
          kerjaduadelapan: 0,
          kerjaduadua: 0,
          kerjaduaempat: 0,
          kerjaduaenam: 0,
          kerjadualima: 0,
          kerjaduapuluh: 0,
          kerjaduasatu: 0,
          kerjaduasembilan: 0,
          kerjaduatiga: 0,
          kerjaduatujuh: 0,
          kerjaempat: 0,
          kerjaempatbelas: 0,
          kerjaenam: 0,
          kerjaenambelas: 0,
          kerjalima: 0,
          kerjalimabelas: 0,
          kerjasatu: 0,
          kerjasebelas: 0,
          kerjasembilan: 0,
          kerjasembilanbelas: 0,
          kerjasepuluh: 0,
          kerjatiga: 0,
          kerjatigabelas: 0,
          kerjatigapuluh: 0,
          kerjatujuh: 0,
          kerjatujuhbelas: 0,
          korbanngocok: 0,
          kubis: 0,
          kucing: 0,
          kucinglastclaim: 0,
          kuda: 0,
          kudalastclaim: 0,
          kumba: 0,
          kyubi: 0,
          kyubilastclaim: 0,
          labu: 0,
          laper: 100,
          lastadventure: 0,
          lastyoutuber: 0,
          lastberbru: 0,
          lastberburu: 0,
          lastberkebon: 0,
          lastbunga: 0,
          lastPolisi: 0,
          lastbunuhi: 0,
          lastclaim: 0,
          lastcode: 0,
          lastTrade: 0,
          lastcrusade: 0,
          lastbossbattle: 0,
          lastdagang: 0,
          lastduel: 0,
          lastdungeon: 0,
          lastdungeon1: 0,
          lastdungeon2: 0,
          lastdungeon3: 0,
          lastdungeon4: 0,
          lasteasy: 0,
          lastfight: 0,
          lastfishing: 0,
          lastgojek: 0,
          lastgrab: 0,
          lasthourly: 0,
          lasthunt: 0,
          lastjb: 0,
          lastkill: 0,
          lastlink: 0,
          lastlumber: 0,
          lastmancingeasy: 0,
          lastmancingextreme: 0,
          lastmancinghard: 0,
          lastmancingnormal: 0,
          lastmining: 0,
          lastmisi: 0,
          Lastmission: 0,
          lastmonthly: 0,
          lastmulung: 0,
          lastnambang: 0,
          lastnebang: 0,
          lastngocok: 0,
          lastngojek: 0,
          lastopen: 0,
          lastReset2: 0,
          lastpekerjaan: 0,
          lastpotionclaim: 0,
          lastramuanclaim: 0,
          lastrob: 0,
          lastroket: 0,
          lastseen: 0,
          lastngewe: 0,
          lastSetStatus: 0,
          lastsironclaim: 0,
          lastsmancingclaim: 0,
          laststringclaim: 0,
          lastswordclaim: 0,
          lastturu: 0,
          lastAstronot: 0,
          lastwarpet: 0,
          lastweaponclaim: 0,
          lastweekly: 0,
          lastwork: 0,
          lbars: "[▒▒▒▒▒▒▒▒▒]",
          legendary: 0,
          lele: 0,
          leleb: 0,
          lelebakar: 0,
          leleg: 0,
          level: 0,
          limit: 100,
          limitjoinfree: 5,
          lion: 0,
          lionexp: 0,
          lionlastfeed: 0,
          lobster: 0,
          lumba: 0,
          magicwand: 0,
          magicwanddurability: 0,
          makanan: 0,
          makanancentaur: 0,
          makanangriffin: 0,
          makanankyubi: 0,
          makanannaga: 0,
          makananpet: 0,
          makananphonix: 0,
          makananserigala: 0,
          mana: 20,
          mangga: 0,
          moderatorV2: 0,
          misi: "",
          shield: 0,
          shieldDurability: 0,
          eris: 150000,
          monyet: 0,
          mythic: 0,
          naga: 0,
          nagalastclaim: 0,
          name: m.name,
          gojekName: m.gojekName,
          net: 0,
          nila: 0,
          nilabakar: 0,
          catatan: "",
          ojekk: 0,
          ngewe: 0,
          oporayam: 0,
          orca: 0,
          pancingan: 0,
          pancingandurability: 100,
          panda: 0,
          pasangan: "",
          paus: 0,
          pausbakar: 0,
          pc: 0,
          pepesikan: 0,
          pet: 0,
          phonix: 0,
          phonixexp: 0,
          phonixlastclaim: 0,
          phonixlastfeed: 0,
          pickaxe: 0,
          pickaxedurability: 0,
          pillhero: 0,
          pisang: 0,
          pointxp: 0,
          potion: 10,
          premium: false,
          premiumTime: 0,
          pistol: 0,
          peluru: 0,
          ramuan: 0,
          ramuancentaurlast: 0,
          ramuangriffinlast: 0,
          ramuanherolast: 0,
          ramuankucinglast: 0,
          ramuankudalast: 0,
          ramuankyubilast: 0,
          ramuannagalast: 0,
          ramuanphonixlast: 0,
          ramuanrubahlast: 0,
          ramuanserigalalast: 0,
          registered: false,
          reglast: 0,
          regTime: -1,
          rendang: 0,
          rhinoceros: 0,
          rhinocerosexp: 0,
          rhinoceroslastfeed: 0,
          rock: 0,
          roket: 0,
          role: "Newbie ㋡",
          roti: 0,
          rtrofi: "perunggu",
          rubah: 0,
          rubahlastclaim: 0,
          rumahsakit: 0,
          sampah: 0,
          sand: 0,
          sapi: 0,
          sapir: 0,
          seedbayam: 0,
          seedbrokoli: 0,
          seedjagung: 0,
          seedkangkung: 0,
          seedkentang: 0,
          seedkubis: 0,
          seedlabu: 0,
          seedtomat: 0,
          seedwortel: 0,
          semangka: 0,
          serigala: 0,
          serigalalastclaim: 0,
          sewa: false,
          shield: 0,
          skill: "",
          skillexp: 0,
          snlast: 0,
          soda: 0,
          sop: 0,
          spammer: 0,
          spinlast: 0,
          ssapi: 0,
          stamina: 100,
          steak: 0,
          stick: 0,
          strength: 30,
          string: 0,
          stroberi: 0,
          superior: 0,
          suplabu: 0,
          sushi: 0,
          sword: 0,
          sworddurability: 0,
          tigame: 50,
          tiketcoin: 0,
          title: "",
          title2: "",
          tomat: 0,
          tprem: 0,
          trash: 0,
          trofi: 0,
          troopcamp: 0,
          tumiskangkung: 0,
          udang: 0,
          udangbakar: 0,
          umpan: 0,
          uncommon: 0,
          unreglast: 0,
          upgrader: 0,
          vodka: 0,
          waifu: "",
          wallet: 0,
          warn: 0,
          weapon: 0,
          weapondurability: 0,
          wolf: 0,
          wolfexp: 0,
          wolflastfeed: 0,
          wood: 0,
          warn2: 0,
          wortel: 0,
          limitjoin: 500,
        }
let chat = global.db.data.chats[m.chat]
if (typeof chat !== "object") global.db.data.chats[m.chat] = {}
if (chat) {
    // === Properti yang ada di handler.js Anda: ===
    if (!('animeupdate' in chat)) chat.animeupdate = false // (Tidak ada di enable)
    if (!('isBanned' in chat)) chat.isBanned = false // (Tidak ada di enable)
    if (!('backupsc' in chat)) chat.backupsc = false // (Ada di enable - owner only)
    if (!('myanime' in chat)) chat.myanime = false // (Tidak ada di enable)
    if (!('antiwame' in chat)) chat.antiwame = false // (Tidak ada di enable)
    
    // === Properti yang TERKAIT dengan ENABLE/DISABLE: ===
    
    // Link/Media/Spam
    if (!('antiLink' in chat)) chat.antiLink = false // (Ada di enable)
    if (!('antilinkyt' in chat)) chat.antilinkyt = false // (Ada di enable)
    if (!('antiLinkall' in chat)) chat.antiLinkall = false // (Ada di enable)
    if (!('antipromosi' in chat)) chat.antiPromosi = false // (Ada di enable) *Perhatikan kapitalisasi 'P'
    if (!('antiSpam' in chat)) chat.antiSpam = false // (Ada di enable)
    if (!('antiToxic' in chat)) chat.antiToxic = false // (Ada di enable)
    if (!('antiNewsletter' in chat)) chat.antiNewsletter = false; // (Ada di enable)
    if (!('antiPoll' in chat)) chat.antiPoll = false; // (Ada di enable - antipolling)
    if (!('antitagbot' in chat)) chat.antitagbot = false; // (Ada di enable)
    if (!('antiTagStatus' in chat)) chat.antiTagStatus = false; // (Ada di enable - antitagsw)

    // Media Khusus (AntiFoto, AntiVideo, AntiAudio, AntiSticker)
    if (!('antifoto' in chat)) chat.antiFoto = false // (Ada di enable) *Perhatikan kapitalisasi 'F'
    if (!('antivideo' in chat)) chat.antiVideo = false // (Ada di enable) *Perhatikan kapitalisasi 'V'
    if (!('antiaudio' in chat)) chat.antiAudio = false // (Ada di enable) *Perhatikan kapitalisasi 'A'
    if (!('antisticker' in chat)) chat.antiSticker = false // (Ada di enable) *Perhatikan kapitalisasi 'S'

    // NSFW BARU!
    if (!('antiNsfw' in chat)) chat.antiNsfw = false; // <<< DITAMBAHKAN

    // Fitur Umum
    if (!('welcome' in chat)) chat.welcome = false // (Ada di enable)
    if (!('bye' in chat)) chat.bye = false // (Ada di enable - goodbye)
    if (!('delete' in chat)) chat.delete = true // (Ada di enable - antidelete (toggle))
    if (!('antimedia' in chat)) chat.antimedia = false // (Ada di enable - viewonce/antimedia)
    if (!('viewonce' in chat)) chat.viewonce = false // (Ada di enable - viewonce)
    if (!('autolevelup' in chat)) chat.autolevelup = false // (Ada di enable)
    if (!('autodelvn' in chat)) chat.autodelvn = false; // (Ada di enable)
    if (!('useDocument' in chat)) chat.useDocument = false; // (Ada di enable - document)
    if (!('bcjoin' in chat)) chat.bcjoin = false; // (Ada di enable)
    if (!('adminonly' in chat)) chat.adminonly = false; // (Ada di enable)

    // Chatbot / AI
    if (!('simi' in chat)) chat.simi = false // (Ada di enable)
    if (!('zahra' in chat)) chat.zahra = false // (Ada di enable)
    if (!('ubed' in chat)) chat.ubed = false // (Ada di enable)
    if (!('chatbot' in chat)) chat.chatbot = false // (Ada di enable - yue)
    if (!('autoPresence' in chat)) chat.autoPresence = false; // (Ada di enable)
    if (!('autoReply' in chat)) chat.autoReply = false; // (Ada di enable)
    if (!('autoSticker' in chat)) chat.autoSticker = false; // (Ada di enable)
    if (!('autojoin' in chat)) chat.autoJoin = false // (Ada di enable)
    if (!('updateAnimeNews' in chat)) chat.updateAnimeNews = false; // (Ada di enable - autoupnews)
    if (!('updateAnime' in chat)) chat.updateAnime = false; // (Ada di enable - autoupnime)
    if (!('getmsg' in chat)) chat.getmsg = false; // (Ada di enable)
    
    // Status/Lain-lain
    if (!('anticall' in chat)) chat.anticall = false // (Ada di enable)
    if (!('detect' in chat)) chat.detect = false // (Tidak ada di enable, tapi penting)
    if (!('autoread' in chat)) chat.autoread = false // (Ada di enable - owner only)
    if (!('antibot' in chat)) chat.antiBot = false // (Ada di enable) *Perhatikan kapitalisasi 'B'
    
    // === Properti yang TIDAK ada di enable tapi ada di database lama Anda: ===
    if (!('antiLinkGc' in chat)) chat.antiLinkGc = false 
    if (!('antiLinkTik' in chat)) chat.antiLinkTik = false
    if (!('antiLinkIg' in chat)) chat.antiLinkIg = false
    if (!('antiLinkTel' in chat)) chat.antiLinkTel = false
    if (!('antiLinkFb' in chat)) chat.antiLinkFb = false
    if (!('antiLinkHttp' in chat)) chat.antiLinkHttp = false
    if (!('antiBokep' in chat)) chat.antiBokep = false
    if (!('antiVirtex' in chat)) chat.antiVirtex = false
    if (!('virtex' in chat)) chat.virtex = false
    if (!('nsfw' in chat)) chat.nsfw = false
    if (!('premnsfw' in chat)) chat.premnsfw = false
    if (!('noprefix' in chat)) chat.noprefix = false
    if (!('isPremiumGroup' in chat)) chat.isPremiumGroup = false;
    if (!('premiumGroupExpire' in chat)) chat.premiumGroupExpire = 0;
    if (!('sWelcome' in chat)) chat.sWelcome = ''
    if (!('sBye' in chat)) chat.sBye = ''
    if (!('sPromote' in chat)) chat.sPromote = ''
    if (!('sDemote' in chat)) chat.sDemote = ''
    if (!isNumber(chat.expired)) chat.expired = 0

} else {
    // --- Initialisasi Baru ---
    global.db.data.chats[m.chat] = {
        animeupdate: false,
        isBanned: false,
        backupsc: false,
        myanime: false,
        antiwame: false,
        
        antiLink: false,
        antilinkyt: false,
        antiLinkall: false,
        antiPromosi: false,
        antiSpam: false,
        antiToxic: false,
        antiNewsletter: false,
        antiPoll: false,
        antitagbot: false,
        antiTagStatus: false,

        antiFoto: false,
        antiVideo: false,
        antiAudio: false,
        antiSticker: false,

        antiNsfw: false, // <<< DITAMBAHKAN
        
        welcome: false,
        bye: false,
        delete: true,
        antimedia: false,
        viewonce: false,
        autolevelup: false,
        autodelvn: false,
        useDocument: false,
        bcjoin: false,
        adminonly: false,
        
        chatbot: false,
        simi: false,
        zahra: false,
        ubed: false,
        autoPresence: false,
        autoReply: false,
        autoSticker: false,
        autoJoin: false,
        updateAnimeNews: false,
        updateAnime: false,
        getmsg: false,
        
        anticall: false,
        autoread: false, 
        antiBot: false,
        
        detect: false,
        antiLinkGc: false,
        antiLinkTik: false,
        antiLinkTel: false,
        antiLinkIg: false,
        antiLinkFb: false,
        antiLinkHttp: false,
        antiBokep: false,
        antiVirtex: false,
        virtex: false,
        sWelcome: '',
        sBye: '',
        sPromote: '',
        sDemote: '',
        expired: 0,
        nsfw: false,
        premnsfw: false,
        noprefix: false,
        isPremiumGroup: false,
        premiumGroupExpire: 0,
    }
}
      let akinator = global.db.data.users[m.sender].akinator
      if (typeof akinator !== 'object') global.db.data.users[m.sender].akinator = {}
      if (akinator) {
        if (!('sesi' in akinator)) akinator.sesi = false
        if (!('server' in akinator)) akinator.server = null
        if (!('frontaddr' in akinator)) akinator.frontaddr = null
        if (!('session' in akinator)) akinator.session = null
        if (!('signature' in akinator)) akinator.signature = null
        if (!('question' in akinator)) akinator.question = null
        if (!('progression' in akinator)) akinator.progression = null
        if (!('step' in akinator)) akinator.step = null
        if (!('soal' in akinator)) akinator.soal = null
      } else
        global.db.data.users[m.sender].akinator = {
          sesi: false,
          server: null,
          frontaddr: null,
          session: null,
          signature: null,
          question: null,
          progression: null,
          step: null,
          soal: null
        }
      let settings = global.db.data.settings[this.user.jid]
      if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}

      settings = global.db.data.settings[this.user.jid]

      if (!('self' in settings)) settings.self = false
      if (!('restrict' in settings)) settings.restrict = false
      if (!('jadibot' in settings)) settings.jadibot = false
      if (!('autorestart' in settings)) settings.autorestart = true
      if (!('cleartmp' in settings)) settings.lastcleartmp = 0
      if (!('clearmedia' in settings)) settings.lastclearmedia = 0
      if (!('restartDB' in settings)) settings.restartDB = 0
      if (!('status' in settings)) settings.status = 0
      if (!('backupsc' in settings)) settings.backupsc = false
      if (!('gconly' in settings)) settings.gconly = false

      if (!('menuMode' in settings)) settings.menuMode = 'button'
      if (!('autoread' in settings)) settings.autoread = false
      

    } catch (e) {
      console.error(e)
    }

    if (opts['nyimak']) return
    // Jika pesan dari bot sendiri (m.fromMe) dan mode 'self' non-aktif, lewati.
    if (m.fromMe && !opts['self']) {
      return
    }

    if (opts['pconly'] && m.chat.endsWith('g.us')) return
    if (opts['gconly'] && !m.chat.endsWith('g.us')) return
    if (opts['swonly'] && m.chat !== 'status@broadcast') return
    if (typeof m.text !== 'string') m.text = ''

    // Dapatkan metadata grup dan partisipan terlebih dahulu
const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
const participants = (m.isGroup ? groupMetadata.participants : []) || []

// Normalisasi m.sender ke WID menggunakan resolveWid
const sender = await resolveWid(m, conn, m.sender, participants);


// =========================================================================
// >>> PERBAIKAN FINAL: OWNER CHECK (Hanya Owner Terdaftar) <<<

// 1. Konversi nomor owner ke format JID (628xxxxxx@s.whatsapp.net)
const ownerJids = global.owner.map(v => v[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net');

// isROwner: Apakah JID pengirim (sender) termasuk dalam daftar Owner yang didefinisikan?
const isROwner = ownerJids.includes(sender) || false

// isOwner: Sekarang isOwner SAMA DENGAN isROwner. Cek m.fromMe DIHILANGKAN untuk perintah owner.
const isOwner = isROwner

// isMods: Mods adalah Owner ATAU JID pengirim ada di daftar global.mods
const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender)

// isPrems: Premium adalah ROwner ATAU JID pengirim ada di daftar global.prems ATAU punya premiumTime > 0
const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(sender) || db.data.users[sender]?.premiumTime > 0

const isPremiumGroup = m.isGroup && db.data.chats[m.chat]?.isPremiumGroup && db.data.chats[m.chat]?.premiumGroupExpire > Date.now();
const user = (m.isGroup ? participants.find(u => u.jid === m.sender) : {}) || {}
const bot = (m.isGroup ? participants.find(u => u.jid == this.user.jid) : {}) || {}
const isRAdmin = user?.admin == 'superadmin' || false
const isAdmin = isRAdmin || user?.admin == 'admin' || false
const isBotAdmin = bot?.admin || false
// =========================================================================


    // Logika pengecekan "Admin Only"
    if (m.isGroup) {
      let chatSettings = global.db.data.chats[m.chat] || {};
      if (chatSettings.adminonly) {
        if (!isAdmin && !isOwner) {
          return;
        }
      }
    }
    
    if (m.key.remoteJid == "status@broadcast" && isROwner) {
      conn.sendMessage(m.key.remoteJid, { react: { text: await emoji(), key: m.key } }, { statusJidList: [m.key.participant, m.sender] }).catch(() => {
        false
      });
    }

    if (m.isBaileys) return
    m.exp += Math.ceil(Math.random() * 10)
    
    let sticker = m.message?.stickerMessage;
if (sticker) {
  console.log('✅ Bot mendeteksi stiker!'); // Tambahkan baris ini
  let hash = sticker.fileSha256.toString('base64');
  let cmd = global.db.data.users[m.sender]?.sticker?.[hash]?.text;
  
  if (cmd) {
    console.log(`✅ Perintah ditemukan: ${cmd}`); // Tambahkan baris ini
    // ... kode eksekusi
  } else {
    console.log('❌ Perintah tidak ditemukan untuk stiker ini.'); // Tambahkan baris ini
  }
}

    let usedPrefix
    let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

    if (global.db.data.settings[this.user.jid].gconly && !m.fromMe && !m.chat.endsWith('g.us') && !isPrems && !isOwner) {
      return;
    }
    
    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    for (let name in global.plugins) {
      let plugin = global.plugins[name]
      if (!plugin) continue
      if (plugin.disabled) continue
      const __filename = join(___dirname, name)
      if (typeof plugin.all === 'function') {
        try {
          await plugin.all.call(this, m, {
            chatUpdate,
            __dirname: ___dirname,
            __filename
          })
        } catch (e) {
          console.error(e)
          for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
            let data = (await conn.onWhatsApp(jid))[0] || {}
            if (data.exists)
              m.reply(`*🗂️ Plugin:* ${name}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${m.text}\n\n${format(e)}`.trim(), data.jid)
          }
        }
      }
      if (!opts['restrict'])
        if (plugin.tags && plugin.tags.includes('admin')) {
          continue
        }
      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
      let match = (_prefix instanceof RegExp ?
        [[_prefix.exec(m.text), _prefix]] :
        Array.isArray(_prefix) ?
          _prefix.map(p => {
            let re = p instanceof RegExp ?
              p :
              new RegExp(str2Regex(p))
            return [re.exec(m.text), re]
          }) :
          typeof _prefix === 'string' ?
            [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
            [[[], new RegExp]]
      ).find(p => p[1])
      if (typeof plugin.before === 'function') {
        if (await plugin.before.call(this, m, {
          match,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          chatUpdate,
          __dirname: ___dirname,
          __filename
        }))
          continue
      }
      if (typeof plugin !== 'function')
        continue

      let chatSettings = global.db.data.chats[m.chat] || {}
      let isNoPrefixEnabled = chatSettings.noprefix;

      let result = '';

      if (isNoPrefixEnabled) {
        result = (match && match[0] && match[0][0]) || '';
        if (!result && m.text && plugin.command) {
          const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
          const cleanedText = m.text.trim().split` `.filter((v) => v)[0] || '';
          if (commands.some(cmd => cmd instanceof RegExp ? cmd.test(cleanedText) : cmd === cleanedText)) {
            result = '';
          } else {
            continue;
          }
        }
      } else {
        result = (match && match[0] && match[0][0]) || '';
        if (!result) continue;
      }

      usedPrefix = result;
      let noPrefix = !result ? m.text : m.text.replace(result, "");
      let [command, ...args] = noPrefix.trim().split` `.filter((v) => v);
      args = args || [];
      let _args = noPrefix.trim().split` `.slice(1);
      let text = _args.join` `;
      command = (command || "").toLowerCase();
      let fail = plugin.fail || global.dfail;

      const prefixCommand = !result
        ? plugin.customPrefix || plugin.command
        : plugin.command;

      let isAccept =
        (prefixCommand instanceof RegExp && prefixCommand.test(command)) ||
        (Array.isArray(prefixCommand) &&
          prefixCommand.some((cmd) =>
            cmd instanceof RegExp ? cmd.test(command) : cmd === command,
          )) ||
        (typeof prefixCommand === "string" && prefixCommand === command);

      m.prefix = !!result;
      usedPrefix = !result ? "" : result;

      if (!isAccept) continue;

      if (m.isGroup && global.db.data.chats[m.chat]?.isBanned === 'mute') {
        let groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
        let senderIsAdmin = groupMetadata?.participants?.find(p => p.id === m.sender)?.admin
        let isOwner = global.owner?.some(([number]) => m.sender === (number.replace(/[^0-9]/g, '') + '@s.whatsapp.net'))

        if (!senderIsAdmin && !isOwner) {
          return m.reply('Maaf, grup ini sedang dimute oleh admin.');
        }
      }

      m.plugin = name
      if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
        let chat = global.db.data.chats[m.chat]
        let user = global.db.data.users[m.sender]
        if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned)
          return
        if (name != 'owner-unbanuser.js' && user?.banned)
          return
      }
      if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
        fail('owner', m, this)
        continue
      }
      if (plugin.rowner && !isROwner) {
        fail('rowner', m, this)
        continue
      }
      if (plugin.owner && !isOwner) {
        fail('owner', m, this)
        continue
      }
      if (plugin.mods && !isMods) {
        fail('mods', m, this)
        continue
      }
      if (plugin.premium && !isPrems && !isPremiumGroup) {
        fail('premium', m, this)
        continue
      }

      if (plugin.group && !m.isGroup) {
        fail('group', m, this)
        continue
      } else if (plugin.botAdmin && !isBotAdmin) {
        fail('botAdmin', m, this)
        continue
      } else if (plugin.admin && !isAdmin) {
        fail('admin', m, this)
        continue
      }
      if (plugin.private && m.isGroup) {
        fail('private', m, this)
        continue
      }
      if (plugin.register == true && _user.registered == false) {
        fail('unreg', m, this)
        continue
      }
      m.isCommand = true
      let xp = "exp" in plugin ? parseInt(plugin.exp) : 17
      if (xp > 200)
        this.reply(m.chat, `[🚩] *Sepertinya Anda Menyontek Menggunakan Kalkulator*\n\n • .shop buy limit\n • .buylimit\n\nCheat Limit /ngechit`,)
      else
        m.exp += xp

      if (!isPrems && !isPremiumGroup && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
        let limitabis = `[🔑] *Limit kamu habis. Sebagian fitur terkunci*\n\nKamu bisa beli premium untuk bermain bot tanpa limit\n.premium\n> [ untuk membeli premium ]\n\nKamu bisa ambil limit gratis dengan cara\n.freelimit\n> [ untuk mendapatkan limit gratis ]`;

        conn.sendMessage(m.chat, {
          document: fs.readFileSync("./thumbnail.jpg"),
          fileName: `- ${global.botname} By ${global.author} -`,
          fileLength: '1',
          mimetype: 'application/msword',
          jpegThumbnail: fs.readFileSync("./thumbnail.jpg"),
          caption: limitabis,
          footer: `${global.botname} || ${global.author}`,
          buttons: [
            {
              buttonId: '.addlimitme',
              buttonText: { displayText: 'Limit Gratis' },
              type: 1
            }
          ],
          headerType: 1,
          viewOnce: true,
          contextInfo: {
            forwardingScore: 99999999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '-@newsletter',
              serverMessageId: null,
              newsletterName: `© ${global.botname} || ${global.author}`
            }
          }
        }, { quoted: m });

        continue;
      }

      if (plugin.level > _user.level) {
        this.reply(m.chat, `[🚩] *${plugin.level}* level required to use this command. Your level *${_user.level}🎋*\n*${plugin.level}* level is required to use this command. Your level is *${_user.level}🎋*`,)
        continue
      }
      let extra = {
        match,
        usedPrefix,
        noPrefix,
        _args,
        args,
        command,
        text,
        conn: this,
        participants,
        groupMetadata,
        user,
        bot,
        isROwner,
        isOwner,
        isRAdmin,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate,
        __dirname: ___dirname,
        __filename
      }
      try {
        await plugin.call(this, m, extra)
        if (!isPrems)
          m.limit = m.limit || plugin.limit || false
      } catch (e) {

        m.error = e
        console.error(e)
        if (e) {
          let text = format(e)
          for (let key of Object.values(global.APIKeys))
            text = text.replace(new RegExp(key, "g"), "#HIDDEN#")
          if (e.name)
            for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
              let data = (await conn.onWhatsApp(jid))[0] || {}
              if (data.exists)
                return m.reply(`*🗂️ Plugins:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(" ")}\n📄 *Error Logs:*\n\n${text}`.trim(), data.jid)
            }
          m.reply(text)
        }
      } finally {

        if (typeof plugin.after === "function") {
          try {
            await plugin.after.call(this, m, extra)
          } catch (e) {
            console.error(e)
          }
        }
      }
      break
    }
  } catch (e) {
    console.error(e)
  } finally {
    if (opts['queque'] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1)
        this.msgqueque.splice(quequeIndex, 1)
    }

    let user, stats = global.db.data.stats
    if (m) {
      if (m.sender && (user = global.db.data.users[m.sender])) {
        user.exp += m.exp
        user.limit -= m.limit * 1
      }

      let stat
      if (m.plugin) {
        let now = +new Date
        if (m.plugin in stats) {
          stat = stats[m.plugin]
          if (!isNumber(stat.total))
            stat.total = 1
          if (!isNumber(stat.success))
            stat.success = m.error != null ? 0 : 1
          if (!isNumber(stat.last))
            stat.last = now
          if (!isNumber(stat.lastSuccess))
            stat.lastSuccess = m.error != null ? 0 : now
        } else
          stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now
          }
        stat.total += 1
        stat.last = now
        if (m.error == null) {
          stat.success += 1
          stat.lastSuccess = now
        }
      }
    }

    try {
      if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }

    if (global.db.data.settings[this.user.jid]?.autoread) {
      this.readMessages([m.key]);
    }
  }
}
export async function participantsUpdate(participantsUpdate) {
  if (opts['self']) return
  if (this.isInit) return
  if (global.db.data == null) await loadDatabase()

  const { id, participants, action } = participantsUpdate; // Destructuring di sini
  if (!id) return;
  
  let chat = global.db.data.chats[id] || {}
  let text = ''
  let mentionedJid = [id]
  switch (action) {
  case 'add':
  if (chat.welcome) {
    let groupMetadata = await conn.groupMetadata(id)
      .catch(() => (conn.chats[id] || {}).metadata) || {}

    for (let participant of participants) {
      try {
        let userJid = jidNormalizedUser(participant)
        let name
        try {
          name = await conn.getName(userJid)
        } catch {
          name = userJid.split('@')[0]
        }

        let welcomeMessage = chat.sWelcome || `👋 Selamat datang @user di *@subject*!`
        welcomeMessage = welcomeMessage
          .replace(/@user/g, `@${name}`)
          .replace(/@subject/g, groupMetadata.subject || 'Grup')
          .replace(/@desc/g, groupMetadata.desc || 'Tidak ada deskripsi')

        await conn.sendMessage(id, {
          text: welcomeMessage,
          mentions: [userJid]
        })
      } catch (e) {
        console.error('Gagal kirim welcome:', e)
      }
    }
  }
  break

    case 'remove':
  if (chat.bye) {
    let groupMetadata = await this.groupMetadata(id)
      .catch(() => (this.chats[id] || {}).metadata) || {}
    let nickgc = groupMetadata.subject || await this.getName(id)

    for (let participant of participants) {
      try {
        // pastikan userJid normal (bukan LID)
        const userJid = jidNormalizedUser(participant)

        // ambil nama dengan fallback ke nomor
        let name
        try {
          name = await this.getName(userJid)
          if (!name) {
            const [result] = await this.onWhatsApp(userJid).catch(() => [{}])
            name = result?.notify || result?.vname || result?.name || userJid.split('@')[0]
          }
        } catch {
          name = userJid.split('@')[0]
        }

        // ambil avatar
        let avatar
        try {
          avatar = await this.profilePictureUrl(userJid, 'image')
        } catch {
          avatar = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
        }
        if (!avatar) avatar = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'

        // buat pesan goodbye
        let byeMessage = chat.sBye || `👋 Selamat tinggal @user!\nSemoga sukses di luar sana 👋`
        byeMessage = byeMessage
          .replace(/@user/g, `@${name}`)
          .replace(/@subject/g, groupMetadata.subject || 'Grup')
          .replace(/@desc/g, groupMetadata.desc || 'Tidak ada deskripsi')

        // gunakan background yang bisa di-set melalui setbye
        let apiUrl = `https://api.siputzx.my.id/api/canvas/goodbyev2?` +
          new URLSearchParams({
            username: name,
            guildName: nickgc,
            memberCount: groupMetadata.participants?.length || 0,
            avatar: avatar,
            background: chat.byeBg || 'https://files.catbox.moe/7cclct.jpeg'
          })

        let buffer = await fetch(apiUrl).then(res => res.buffer())

        await this.sendMessage(id, {
          image: buffer,
          caption: byeMessage,
          mentions: [userJid]
        }, { quoted: null })

      } catch (e) {
        console.error('Gagal kirim goodbye:', e)
      }
    }
  }
  break;

    case 'promote':
      text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
    case 'demote':
      if (!text)
        text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
      text = text.replace('@user', '@' + participants[0].split('@')[0])
      if (chat.detect)
        this.sendMessage(id, { text, mentions: this.parseMention(text) })
      break
  }
}
// --- PENTING: Fungsi onCall yang telah diperbarui untuk WhiskeySockets ---
export async function onCall(callUpdate) {
  if (!global.db.data.settings[this.user.jid].anticall) return;

  const { from, isGroup, id } = callUpdate;
  let user = global.db.data.users[from] || {};

  if (user.whitelist) return;

  if (from && !isGroup) {
    this.rejectCall(id, from);
    
    const ownerNumber = global.owner[0][0];
    const ownerJid = ownerNumber + '@s.whatsapp.net';

    this.sendMessage(from, {
      text: `📞 Kamu diblokir karena menelepon bot. Silakan hubungi owner untuk dibuka: ${PhoneNumber('+' + ownerNumber).getNumber('international')}`
    }, { quoted: null }).catch(e => console.log('Gagal kirim pesan blokir:', e));

    user.banned = true;
    user.BannedReason = "Menelepon bot";
    user.banExpires = Date.now() + (1000 * 60 * 60 * 24 * 7);
    console.log(`User ${from} diblokir karena menelepon bot.`);
  }
}
// -------------------------------------------------------------------------

export async function groupsUpdate(groupsUpdate) {
  if (opts['self']) return
  for (const groupUpdate of groupsUpdate) {
    const id = groupUpdate.id
    if (!id) continue
    let chats = global.db.data.chats[id], text = ''
    if (!chats?.detect) continue
    if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Deskripsi grup telah diubah menjadi```\n@desc').replace('@desc', groupUpdate.desc)
    if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Nama grup telah diubah menjadi```\n@subject').replace('@subject', groupUpdate.subject)
    if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon grup telah diubah menjadi```').replace('@icon', groupUpdate.icon)
    if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Link grup telah diubah menjadi```\n@revoke').replace('@revoke', groupUpdate.revoke)
    if (!text) continue
    await this.sendMessage(id, { text, mentions: this.parseMention(text) })
  }
}

// --- PENTING: Fungsi deleteUpdate yang telah diperbarui untuk WhiskeySockets ---
export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe) return
        
        let msg = conn.serializeM(conn.loadMessage(id)) // Menggunakan conn
        if (!msg) return
        
        let chat = global.db.data.chats[msg.chat] || {}
        if (!chat.delete) return
        
    conn.sendMessage(msg.chat, { // Menggunakan conn
        text: `🗑️ Terdeteksi *@${participant.split`@`[0]}* telah menghapus pesan tersebut.`,
        contextInfo: {
            externalAdReply: {
                title: global.botname,
                thumbnailUrl: global.foto,
                sourceUrl: global.web,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: msg })
    conn.copyNForward(msg.chat, msg, false).catch(e => console.log(e, msg)) // Menggunakan conn
    } catch (e) {
        console.error(e)
    }
}


// --------------------------------------------------------------------------

global.dfail = async (type, m, mufar) => {
  const userTag = `👋 Hai @${m.sender.split("@")[0]}\n`
  const emoji = {
    general: '⚙️',
    owner: '👑',
    moderator: '🛡️',
    premium: '💎',
    group: '👥',
    private: '📱',
    admin: '👤',
    botAdmin: '🤖',
    unreg: '🔒',
    nsfw: '🔞',
    rpg: '🎮',
    restrict: '⛔',
  }

  const msg = {
    owner: `${userTag} Perintah ini hanya dapat digunakan oleh *Owner Bot* !`,
    moderator: `${userTag} Perintah ini hanya dapat digunakan oleh *Moderator* !`,
    premium: `${userTag} Perintah ini hanya untuk member *Premium* !\n\nMau beli premium?\nketik: *.premium*`,
    group: `${userTag} Perintah ini hanya dapat digunakan di grup !`,
    private: `${userTag} Perintah ini hanya dapat digunakan di Chat Pribadi !`,
    admin: `${userTag} Perintah ini hanya untuk *Admin* grup !`,
    botAdmin: `${userTag} Jadikan bot sebagai *Admin* untuk menggunakan perintah ini !`,
    nsfw: `*${userTag} NSFW tidak aktif, Silahkan hubungi Team Bot Discussion untuk mengaktifkan fitur ini !`,
    rpg: `*${userTag} RPG tidak aktif, Silahkan hubungi Team Bot Discussion Untuk mengaktifkan fitur ini !`,
    restrict: `*${userTag} Fitur ini di *disable* !`,
  }[type]

  if (msg) {
    return mufar.sendMessage(
      m.chat, {
      text: msg,
      contextInfo: {
        externalAdReply: {
          title: '✖️ Y O U R  N O T  A C C E S S',
          body: 'Akses kamu ditolak',
          thumbnailUrl: global.foto,
          sourceUrl: global.web,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: m }
    )
  }

  let daftar = {
  unreg: `Hai User Tercinta, sebelum menggunakan ${global.botname}, sebaiknya daftar dulu ya agar bisa menggunakan fitur yang ada di ${global.botname} 🍏

📋 *Cara Daftarnya:*
> .daftar nama

💡 *Contoh:* \`.daftar ${global.author}\`

Jika kurang paham kamu bisa bertanya sama Owner.
\`\`\`Ketuk tombol:\`\`\` ${global.author}

🍏 .daftar nama.umur  
🍏 Pencet tombol *Verify* di bawah`
}[type]

if (daftar) {
  const pp = await mufar.profilePictureUrl(m.sender, 'image').catch(() => global.img)
  const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net'
  const author = global.author || '𝚇𝚒𝚝𝚎𝚛 𝚃𝚛𝚊𝚗𝚜 𝙼𝙳' // fallback kalau global.author kosong

  const registerOptions = [
    {
      header: '🔓 Verify Akun',
      title: 'Verifikasi akun Anda',
      description: 'Pastikan akun Anda terverifikasi untuk akses penuh.',
      id: '@verify'
    },
    {
      header: '🔐 Daftar Sekarang',
      title: 'Daftar dengan nama Anda',
      description: `Contoh: .daftar ${author} atau .daftar ${author}.20`,
      id: '.register'
    },
    {
      header: `📞 ${author}`,
      title: 'Hubungi Owner untuk bantuan',
      description: 'Jika ada masalah atau pertanyaan.',
      id: '.owner'
    }
  ]

  return mufar.sendMessage(m.chat, {
    product: {
      productImage: { url: pp },
      productId: '9999999999999999',
      title: `🌟 Hai Kak ${await mufar.getName(m.sender)}!`,
      description: daftar.trim(),
      currencyCode: 'IDR',
      priceAmount1000: '99999999999',
      retailerId: 'register_info',
      url: myweb,
      productImageCount: 1
    },
    businessOwnerJid: primaryOwnerJid,
    caption: `> © 2025 - ${global.botname}\nDaftar Dulu Yuks Kak sebelum menggunakan perintah Bot ! 💐`,
    title: '✨ Daftar Dulu Yuk! ✨',
    subtitle: 'Akses Fitur Eksklusif Menantimu!',
    interactiveButtons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: 'Pilih Opsi Pendaftaran',
          sections: [
            {
              title: 'Tindakan Penting',
              highlight_label: 'Pilih Salah Satu',
              rows: registerOptions
            }
          ]
        })
      }
    ],
    hasMediaAttachment: false
  }, { quoted: m })
}
}
    
let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.redBright("Pembaruan 'handler.js'"))
  if (global.reloadHandler) console.log(await global.reloadHandler())
})
