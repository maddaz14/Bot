let handler = async (m, { conn, args, usedPrefix }) => {
    let info = `
乂 List Pet:
🐈 • Kucing
🐕 • Anjing
🐎 • Kuda
🦊 • Rubah
🐉 • Naga

*➠ Example:* ${usedPrefix}feed kucing petfood
*➠ Example:* ${usedPrefix}feed kucing ramuan
`.trim()

    let pesan = pickRandom(['ɴʏᴜᴍᴍᴍ~', 'ᴛʜᴀɴᴋs', 'ᴛʜᴀɴᴋʏᴏᴜ ^-^', '...', 'ᴛʜᴀɴᴋ ʏᴏᴜ~', 'ᴀʀɪɢᴀᴛᴏᴜ ^-^'])
    let type = (args[0] || '').toLowerCase()
    let foodType = (args[1] || '').toLowerCase()

    let emo = (type === 'rubah' ? '🦊' :
               type === 'kucing' ? '🐈' :
               type === 'anjing' ? '🐕' :
               type === 'kuda' ? '🐎' :
               type === 'naga' ? '🐉' : '')

    if (!type || !foodType) {
        return m.reply(info) // Show info if no pet type or food type is specified
    }

    let user = global.db.data.users[m.sender]
    let petData = {
        'kucing': { level: user.kucing || 0, lastClaim: user.kucinglastclaim, foodKey: 'anakkucing', levelKey: 'kucing' },
        'anjing': { level: user.anjing || 0, lastClaim: user.anjinglastclaim, foodKey: 'anakanjing', levelKey: 'anjing' },
        'kuda': { level: user.kuda || 0, lastClaim: user.kudalastclaim, foodKey: 'anakkuda', levelKey: 'kuda' },
        'rubah': { level: user.rubah || 0, lastClaim: user.rubahlastclaim, foodKey: 'anakrubah', levelKey: 'rubah' },
        'naga': { level: user.naga || 0, lastClaim: user.nagalastclaim, foodKey: 'anaknaga', levelKey: 'naga' }
    }

    let selectedPet = petData[type]
    if (!selectedPet) return m.reply(`Hewan peliharaan tidak valid. Pilih dari:\n🐈 Kucing\n🐕 Anjing\n🐎 Kuda\n🦊 Rubah\n🐉 Naga`)

    if (selectedPet.level === 0) return m.reply('Anda belum memiliki hewan peliharaan ini!')
    if (selectedPet.level === 15) return m.reply('Hewan kamu telah mencapai level maksimal')

    let timeDifference = (new Date - selectedPet.lastClaim)
    let timeRemaining = (600000 - timeDifference)
    let formattedTime = clockString(timeRemaining)

    if (new Date - selectedPet.lastClaim > 600000) {
        let increment = 0
        if (foodType === 'petfood') {
            increment = 20
            if (user.petfood <= 0) {
                return m.reply(`Kamu tidak memiliki petfood. Silakan beli di Shop\n.shop buy petfood`)
            }
            user.petfood -= 1
        } else if (foodType === 'ramuan') {
            increment = 40
            if (user.ramuan <= 0) {
                return m.reply(`Kamu tidak memiliki ramuan. Silahkan buat ramuan dulu\n${usedPrefix}meracik ramuan`)
            }
            user.ramuan -= 1
        } else {
            return m.reply('Tolong pilih jenis makanan yang valid: *petfood* atau *ramuan*')
        }

        user[selectedPet.foodKey] += increment
        user[`${selectedPet.levelKey}lastclaim`] = new Date * 1
        m.reply(`Mengasih makan *${type}*...\n*${emo} ${type.capitalize()}:* ${pesan}`)

        // Level up system
        let requiredPoints = ((selectedPet.level * 100) - 1)
        if (user[selectedPet.foodKey] > requiredPoints) {
            user[selectedPet.levelKey] += 1
            user[selectedPet.foodKey] -= (selectedPet.level * 100)
            m.reply(`*Selamat!* ${type.capitalize()} kamu naik level!`)
        }
    } else {
        m.reply(`Hewan peliharaan Anda kenyang, coba beri makan lagi dalam\n➞ *${formattedTime}*`)
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

let pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

let clockString = (ms) => {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    return `${minutes} menit ${seconds} detik`
}

handler.help = ['feed']
handler.tags = ['rpg']
handler.command = /^(feed(ing)?)$/i

handler.register = true
handler.group = true
handler.rpg = true
export default handler