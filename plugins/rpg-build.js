//Harga Build
let rumahsakit = 500
let benteng = 700
let camptroops = 900
let pertanian = 700
let pertambangan = 600

let handler = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    let type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    
    let caption = `*List Bangunan*
- Benteng
- Pertanian
- Camptroops
- Pertambangan
- Rumahsakit

Contoh: .bangun rumahsakit
`

    try {
        if (/build|bangun/i.test(command)) {
            const count = args[1] && args[1].length > 0
                ? Math.min(99999999, Math.max(parseInt(args[1]), 1))
                : 1

            switch (type) {
                case 'benteng': case 'fortress':
                    if (user.kayu >= benteng * count && user.batu >= benteng * count) {
                        user.fortress += count
                        user.kayu -= benteng * count
                        user.batu -= benteng * count
                        m.reply(`Berhasil membangun *Benteng*!`)
                    } else {
                        m.reply(`Sumber daya tidak cukup!\nButuh: ${benteng * count} Kayu & ${benteng * count} Batu`)
                    }
                    break

                case 'pertanian':
                    if (user.kayu >= pertanian * count && user.batu >= pertanian * count) {
                        user.pertanian += count
                        user.kayu -= pertanian * count
                        user.batu -= pertanian * count
                        m.reply(`Berhasil membangun *Pertanian*!`)
                    } else {
                        m.reply(`Sumber daya tidak cukup!\nButuh: ${pertanian * count} Kayu & ${pertanian * count} Batu`)
                    }
                    break

                case 'camptroops': case 'camptroop': case 'kamp':
                    if (user.kayu >= camptroops * count && user.batu >= camptroops * count) {
                        user.camptroops += count
                        user.kayu -= camptroops * count
                        user.batu -= camptroops * count
                        m.reply(`Berhasil membangun *Kamp Pasukan*!`)
                    } else {
                        m.reply(`Sumber daya tidak cukup!\nButuh: ${camptroops * count} Kayu & ${camptroops * count} Batu`)
                    }
                    break

                case 'pertambangan':
                    if (user.kayu >= pertambangan * count && user.batu >= pertambangan * count) {
                        user.tambang += count
                        user.kayu -= pertambangan * count
                        user.batu -= pertambangan * count
                        m.reply(`Berhasil membangun *Pertambangan*!`)
                    } else {
                        m.reply(`Sumber daya tidak cukup!\nButuh: ${pertambangan * count} Kayu & ${pertambangan * count} Batu`)
                    }
                    break

                case 'rumahsakit': case 'hospital':
                    if (user.kayu >= rumahsakit * count && user.batu >= rumahsakit * count) {
                        user.rumahsakit += count
                        user.kayu -= rumahsakit * count
                        user.batu -= rumahsakit * count
                        m.reply(`Berhasil membangun *Rumah Sakit*!`)
                    } else {
                        m.reply(`Sumber daya tidak cukup!\nButuh: ${rumahsakit * count} Kayu & ${rumahsakit * count} Batu`)
                    }
                    break

                default:
                    return conn.reply(m.chat, caption, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, 'Terjadi kesalahan saat membangun!', m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, 'build.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', m)
            }
        }
    }
}

handler.help = ['bangun', 'upgrade']
handler.tags = ['rpg']
handler.command = /^(build|bangun|upgrade|upgd)$/i
handler.owner = false

export default handler