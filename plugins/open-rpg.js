const rewards = {
    common: {
        money: 101,
        exp: 201,
        trash: 11,
        potion: [0, 1, 0, 1, 0, 0, 0, 0, 0],
        common: [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        uncommon: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    uncommon: {
        money: 201,
        exp: 401,
        trash: 31,
        potion: [0, 1, 0, 0, 0, 0, 0],
        diamond: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        common: [0, 1, 0, 0, 0, 0, 0, 0],
        uncommon: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        wood: [0, 1, 0, 0, 0, 0],
        rock: [0, 1, 0, 0, 0, 0],
        string: [0, 1, 0, 0, 0, 0]
    },
    mythic: {
        money: 301,
        exp: 551,
        trash: 61,
        potion: [0, 1, 0, 0, 0, 0],
        emerald: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        diamond: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        gold: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        iron: [0, 1, 0, 0, 0, 0, 0, 0],
        common: [0, 1, 0, 0, 0, 0],
        uncommon: [0, 1, 0, 0, 0, 0, 0, 0],
        mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        legendary: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pet: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        wood: [0, 1, 0, 0, 0],
        rock: [0, 1, 0, 0, 0],
        string: [0, 1, 0, 0, 0]
    },
    legendary: {
        money: 401,
        exp: 601,
        trash: 101,
        potion: [0, 1, 0, 0, 0],
        emerald: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        diamond: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        gold: [0, 1, 0, 0, 0, 0, 0, 0],
        iron: [0, 1, 0, 0, 0, 0, 0],
        common: [0, 1, 0, 0],
        uncommon: [0, 1, 0, 0, 0, 0],
        mythic: [0, 1, 0, 0, 0, 0, 0, 0, 0],
        legendary: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        pet: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        wood: [0, 1, 0, 0],
        rock: [0, 1, 0, 0],
        string: [0, 1, 0, 0]
    },
    pet: {
        petFood: [0, 1, 0, 0, 0],
        dog: [0, 1, 0, 0, 0, 0],
        cat: [0, 1, 0, 0, 0, 0],
        bird: [0, 1, 0, 0, 0, 0]
    }
}

let handler = async (m, { command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let today = new Date().toISOString().slice(0, 10) // Format YYYY-MM-DD

    if (!user.dailyCreate) {
        user.dailyCreate = { date: today, count: 0 }
    }

    // Reset counter jika sudah hari baru
    if (user.dailyCreate.date !== today) {
        user.dailyCreate.date = today
        user.dailyCreate.count = 0
    }

    let listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user))
    
    let info = `
Pake Format *${usedPrefix}${command} [crate] [count]*
Contoh: *${usedPrefix}${command} common 10*

Crate List: 
${Object.keys(listCrate).map((v) => `${global.rpg.emoticon(v)}${v}`).join('\n')}
`.trim()

    let type = (args[0] || '').toLowerCase()
    let count = Math.max(1, Math.min(parseInt(args[1]) || 1, Number.MAX_SAFE_INTEGER))

    if (!(type in listCrate)) return m.reply(info)
    if (user[type] < count) return m.reply(`Crate kamu tidak cukup. Kamu hanya punya ${user[type]} *${type} Crate*`)

    // Cek batasan maksimal crate per hari
    if (user.dailyCreate.count + count > 100) {
        return m.reply(`Kamu sudah mencapai batas **100 crate per hari**. Tunggu reset harian!`)
    }

    let crateReward = {}
    for (let i = 0; i < count; i++) {
        for (let [reward, value] of Object.entries(listCrate[type])) {
            if (reward in user) {
                const total = value.getRandom()
                if (total) {
                    user[reward] += total
                    crateReward[reward] = (crateReward[reward] || 0) + total
                }
            }
        }
    }

    user[type] -= count
    user.dailyCreate.count += count

    m.reply(`
Kamu membuka *${count}* ${type} crate dan mendapatkan:
${Object.keys(crateReward).map(reward => `*${reward}:* ${crateReward[reward]}`).join('\n')}
`.trim())
}

handler.help = ['open', 'gacha']
handler.tags = ['rpg']
handler.command = /^(open|buka|gacha)$/i

export default handler

// Fungsi Cek Random Array
Array.prototype.getRandom = function () {
    return this[Math.floor(Math.random() * this.length)]
}