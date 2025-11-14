import os from 'os'
import { execSync } from 'child_process'

let handler = async (m, { conn }) => {
  // RAM info
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  // CPU info
  const cpus = os.cpus()
  const cpuLoad = cpus.map(cpu => {
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0)
    return (1 - cpu.times.idle / total) * 100
  })
  const avgCpu = (cpuLoad.reduce((a, b) => a + b, 0) / cpuLoad.length).toFixed(2)

  // Disk info (Linux/Unix only)
  let diskInfo = 'Tidak tersedia'
  try {
    const df = execSync('df -h --total | grep total').toString().split(/\s+/)
    diskInfo = `Total: ${df[1]}, Digunakan: ${df[2]}, Tersedia: ${df[3]}, Penggunaan: ${df[4]}`
  } catch (e) {}

  const formatBytes = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 B'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  const status = `
*CPU Usage:* ${avgCpu}%
*RAM:*
• Total: ${formatBytes(totalMem)}
• Digunakan: ${formatBytes(usedMem)}
• Tersisa: ${formatBytes(freeMem)}

*Disk:* ${diskInfo}
`.trim()

  m.reply(status)
}

handler.help = ['vpsstatus']
handler.tags = ['info', 'tools']
handler.command = /^vps(status)?$/i
handler.owner = true

export default handler