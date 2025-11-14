import os from 'os'
import fs from 'fs'

const formatBytes = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const handler = async (m, { conn }) => {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  const disk = await checkDisk()
  
  const text = `*Panel Status:*
- RAM Total: ${formatBytes(totalMem)}
- RAM Terpakai: ${formatBytes(usedMem)}
- RAM Tersisa: ${formatBytes(freeMem)}

- Disk Total: ${formatBytes(disk.total)}
- Disk Terpakai: ${formatBytes(disk.used)}
- Disk Tersisa: ${formatBytes(disk.free)}`

  conn.reply(m.chat, text, m)
}

const checkDisk = async () => {
  const { promisify } = await import('util')
  const exec = promisify((await import('child_process')).exec)

  try {
    const { stdout } = await exec('df -k /')
    const lines = stdout.trim().split('\n')
    const diskInfo = lines[1].split(/\s+/)

    const total = parseInt(diskInfo[1]) * 1024
    const used = parseInt(diskInfo[2]) * 1024
    const free = parseInt(diskInfo[3]) * 1024

    return { total, used, free }
  } catch (e) {
    return { total: 0, used: 0, free: 0 }
  }
}

handler.help = ['panelstat']
handler.tags = ['info']
handler.command = /^panel(stat|status)$/i
handler.owner = true

export default handler