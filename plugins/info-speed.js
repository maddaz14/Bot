import os from 'os'
import util from 'util'
import { performance } from 'perf_hooks'
import { exec } from 'child_process'
import fs from 'fs/promises'

let handler = async (m, { conn }) => {
  try {
    let oldTime = performance.now()
    let uptime = process.uptime() * 1000
    let totalMem = os.totalmem()
    let freeMem = os.freemem()
    let usedMem = totalMem - freeMem
    let formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB'
    let formatGB = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
    let cpuArch = os.arch()
    let cpuCount = os.cpus().length
    let platform = os.platform()
    let osVersion = os.release()
    let loadAvg = os.loadavg().map(x => x.toFixed(2)).join(', ')
    let getVersion = (cmd) => new Promise((resolve) => {
      exec(cmd, (err, stdout) => resolve(err ? '✖️' : stdout.trim()))
    })
    let [nodeVer, npmVer, ffmpegVer, pythonVer] = await Promise.all([
      getVersion('node -v'),
      getVersion('npm -v'),
      getVersion('ffmpeg -version'),
      getVersion('python3 --version || python --version')
    ])
    let distroInfo = ''
    try {
      let osRelease = await fs.readFile('/etc/os-release', 'utf8')
      let lines = osRelease.split('\n').filter(line => line)
      distroInfo = lines.map(line => `└ ${line}`).join('\n')
    } catch (e) {
      distroInfo = ''
    }
    let newTime = performance.now()
    let ping = (newTime - oldTime).toFixed(2)
    let text = `
🔹 *Kecepatan Server*
└📡 Ping: *${ping} ms*

🔹 *Status RAM*
├💾 Total: *${formatGB(totalMem)} / ${formatMB(totalMem)}*
├📉 Digunakan: *${formatGB(usedMem)} / ${formatMB(usedMem)}*
└📂 Tersisa: *${formatGB(freeMem)} / ${formatMB(freeMem)}*

🕒 *Uptime*: ${clockString(uptime)}

📊 *Informasi Sistem*
├🌐 *Platform*: ${platform}
├💻 *Arsitektur CPU*: ${cpuArch}
├🧠 *Jumlah CPU*: ${cpuCount}
├⏱️ *Waktu Aktif*: ${clockString(uptime)}
├📀 *Versi OS*: ${osVersion}
└📊 *Rata-rata Beban (1, 5, 15 menit)*: ${loadAvg}

🛠️ *Versi Alat*
├☕ *Node.js*: ${nodeVer}
├📦 *NPM*: ${npmVer}
├🎥 *FFmpeg*: ${ffmpegVer}
└🐍 *Python*: ${pythonVer}
${distroInfo ? `\n🐧 *Distribusi Linux*\n${distroInfo}` : ''}
    `.trim()
    m.reply(text)
  } catch (e) {
    console.error(e)
    m.reply('Yah, ada error nih saat cek server. Coba lagi ya, Senpai!')
  }
}

function clockString(ms) {
  let d = Math.floor(ms / (1000 * 60 * 60 * 24))
  let h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  let s = Math.floor((ms % (1000 * 60)) / 1000)
  return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['speed']
handler.tags = ['info']
handler.command = ['speed']

export default handler