let handler = async (m, {
    command,
    usedPrefix,
    DevMode,
    args
}) => {
    let type = (args[0] || '').toLowerCase()
    let user = global.db.data.users[m.sender]
    let author = global.author
    let cok = `「 *C O O K I N G* 」

* 🍖 Ayam Bakar
* 🥩 Steak
* 🐟 Ikan Bakar
* 🐟 Lele Bakar

Contoh penggunaan: .masak ayambakar

Gunakan spasi`

    try {
        if (/masak|cook/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(999999999999999999999999999, Math.max(parseInt(args[1]), 1)) : 1
            let waktuMasak = 0 // Waktu masak dalam menit
            let bahan = '' // Bahan yang dibutuhkan
            let coalNeeded = 1 // Jumlah coal yang dibutuhkan

            // Tentukan jumlah coal berdasarkan jumlah masakan
            if (count > 20 && count <= 150) {
                coalNeeded = 3
            } else if (count > 150 && count <= 500) {
                coalNeeded = 5
            } else if (count > 500) {
                coalNeeded = 10
            }

            switch (type) {
                case 'ayambakar':
                    waktuMasak = 3 // Waktu memasak 3 menit
                    bahan = `${count} Ayam dan ${coalNeeded} coal`
                    if (user.ayam >= count && user.coal >= coalNeeded) {
                        user.ayam -= count
                        user.coal -= coalNeeded
                        user.ayambakar += count
                        conn.reply(m.chat, `Sukses memasak ${count} Ayam Bakar 🍖\nWaktu Selesai: ${waktuMasak} menit`, m)
                    } else conn.reply(m.chat, `Anda tidak memiliki bahan yang cukup untuk memasak Ayam Bakar\nAnda butuh ${bahan} untuk memasak`, m)
                    break
                case 'steak':
                    waktuMasak = 4 // Waktu memasak 4 menit
                    bahan = `${count} Sapi dan ${coalNeeded} coal`
                    if (user.sapi >= count && user.coal >= coalNeeded) {
                        user.sapi -= count
                        user.coal -= coalNeeded
                        user.steak += count
                        conn.reply(m.chat, `Sukses memasak ${count} Steak 🥩\nWaktu Selesai: ${waktuMasak} menit`, m)
                    } else conn.reply(m.chat, `Anda tidak memiliki bahan yang cukup untuk memasak Steak\nAnda butuh ${bahan} untuk memasak`, m)
                    break
                case 'ikanbakar':
                    waktuMasak = 2 // Waktu memasak 2 menit
                    bahan = `${count} Ikan dan ${coalNeeded} coal`
                    if (user.ikan >= count && user.coal >= coalNeeded) {
                        user.ikan -= count
                        user.coal -= coalNeeded
                        user.ikanbakar += count
                        conn.reply(m.chat, `Sukses memasak ${count} Ikan Bakar 🐟\nWaktu Selesai: ${waktuMasak} menit`, m)
                    } else conn.reply(m.chat, `Anda tidak memiliki bahan yang cukup untuk memasak Ikan Bakar\nAnda butuh ${bahan} untuk memasak`, m)
                    break
                case 'lelebakar':
                    waktuMasak = 3 // Waktu memasak 3 menit
                    bahan = `${count} Lele dan ${coalNeeded} coal`
                    if (user.lele >= count && user.coal >= coalNeeded) {
                        user.lele -= count
                        user.coal -= coalNeeded
                        user.lelebakar += count
                        conn.reply(m.chat, `Sukses memasak ${count} Lele Bakar 🐟\nWaktu Selesai: ${waktuMasak} menit`, m)
                    } else conn.reply(m.chat, `Anda tidak memiliki bahan yang cukup untuk memasak Lele Bakar\nAnda butuh ${bahan} untuk memasak`, m)
                    break
                default:
                    await conn.reply(m.chat, cok, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, `Sepertinya ada yang error, coba laporkan ke owner`, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.reply(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}

handler.help = ['cook']
handler.tags = ['rpg']
handler.command = /^(masak|cook)$/i

export default handler