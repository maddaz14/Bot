import fs from 'fs'
import { createCanvas } from 'canvas'

let handler = async (m, { conn }) => {
    const kodeBaru = generateRandomCode(6)
    const dbPath = "./plugins/database/codereedem.json"

    // Simpan kode ke database
    let data = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : []
    data.push({ code: kodeBaru, remaining: 10, usedBy: [] })
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

    // Gambar CAPTCHA
    const width = 200, height = 80
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)

    const fontSize = 42
    ctx.font = `bold ${fontSize}px Sans`
    ctx.fillStyle = '#333'

    const text = kodeBaru
    const textWidth = ctx.measureText(text).width
    const x = (width - textWidth) / 2
    const y = (height + fontSize / 2) / 2

    ctx.fillText(text, x, y)

    // Tambahkan noise garis
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = getRandomColor()
        ctx.beginPath()
        ctx.moveTo(Math.random() * width, Math.random() * height)
        ctx.lineTo(Math.random() * width, Math.random() * height)
        ctx.stroke()
    }

    const buffer = canvas.toBuffer()

    await conn.sendMessage(m.chat, {
        image: buffer,
        caption: `✅ *Kode berhasil dibuat!*\n\n📌 Kode: \`${kodeBaru}\`\n👥 Bisa digunakan oleh *10 orang*\n\nGunakan perintah: *.reedem*`,
    }, { quoted: m })
}

handler.help = ['buatkode']
handler.tags = ['rpg']
handler.command = /^(buatkode|createredeem)$/i
handler.owner = true

export default handler

function generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}