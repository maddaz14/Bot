import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('⚠️ Masukkan kode yang ingin digunakan!\nContoh: `.reedem hbafd21`')

    // Baca database kode redeem
    let data = JSON.parse(fs.readFileSync("./plugins/database/codereedem.json", "utf-8"))
    let kodeData = data.find(c => c.code === args[0])

    if (!kodeData) return m.reply('❌ Tidak Ada Kode Seperti itu\nHarap Huruf Kecil & Besar sama!!')

    // Cek apakah user sudah menggunakan kode ini sebelumnya
    if (kodeData.usedBy.includes(m.sender)) {
        return m.reply('❌ Anda sudah pernah menggunakan kode ini!')
    }

    let user = db.data.users[m.sender]

    // Sistem Random
    let moneyChance = Math.random() * 100;
    let expChance = Math.random() * 100;
    let limitChance = Math.random() * 100;

    let money = moneyChance <= 30
        ? pickRandom([700000, 1000000, 1500000, 2000000])
        : pickRandom([10000, 30000, 50000, 100000, 200000, 300000, 500000])

    let exp = expChance <= 30
        ? pickRandom([1000, 2000, 3000, 4000, 4999])
        : pickRandom([400, 500, 600, 700, 800, 900, 1000])

    let limit = limitChance <= 30
        ? pickRandom([100, 200, 500, 1000, 2000, 3000, 5000, 7000, 9999])
        : pickRandom([10, 20, 30, 50, 70, 100, 150])

    user.money += money
    user.exp += exp
    user.limit += limit

    kodeData.remaining -= 1
    kodeData.usedBy.push(m.sender)

    if (kodeData.remaining <= 0) {
        data = data.filter(c => c.code !== args[0])
    }

    // Pastikan folder './plugins/database/userclaim/' ada sebelum menulis file user
    const userClaimDir = './plugins/database/userclaim/'
    if (!fs.existsSync(userClaimDir)) {
        fs.mkdirSync(userClaimDir, { recursive: true })
    }

    // Simpan data kode redeem
    fs.writeFileSync("./plugins/database/codereedem.json", JSON.stringify(data, null, 2))

    // Simpan data user klaim, misal buat file user json
    // Contoh untuk membuat file user claim per sender (kalau memang diperlukan)
    // fs.writeFileSync(path.join(userClaimDir, `${m.sender}.json`), JSON.stringify(user, null, 2))

    m.reply(`🎉 **Selamat!**\nAnda mendapatkan:\n- **${money} money**\n- **${exp} exp**\n- **${limit} limit** dari kode redeem!`)
}

handler.help = ['reedem']
handler.tags = ['rpg']
handler.command = /^(reedem|redeem)$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}