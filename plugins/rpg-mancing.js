let handler = async (m, { conn, usedPrefix }) => {
    let __timers = (new Date - global.db.data.users[m.sender].lastmisi)
    let _timers = (3600000 - __timers)
    let timers = clockString(_timers) 
    let name = conn.getName(m.sender)
    let user = global.db.data.users[m.sender]
    let id = m.sender
    let kerja = 'Memancing'
    conn.misi = conn.misi ? conn.misi : {}

    if (id in conn.misi) {
        conn.reply(m.chat, `Selesaikan Misi ${conn.misi[id][0]} Terlebih Dahulu`, m)
        throw true
    }

    if (user.pancingan < 1 ) return m.reply('Kamu Harus Mempunyai Fishingrod 🎣 Terlebih Dahulu Jika Ingin Memancing')
    if (user.pancingandurability < 50 ) return m.reply('Pancinganmu Hampir Hancur, Anda Harus Memperbaikinya Terlebih Dahulu Dengan Cara  *.repair*')
    if (user.umpan < 249) return m.reply('Kamu Membutuhkan Umpan Sebanyak 250 🪱 Untuk Memancing!')

    if (_timers <= 0) {
        let ikan1 = Math.floor(Math.random() * 500)
        let ikan2 = Math.floor(Math.random() * 500)
        let ikan3 = Math.floor(Math.random() * 500)
        let ikan4 = Math.floor(Math.random() * 500)
        let ikan5 = Math.floor(Math.random() * 500)
        let ikan6 = Math.floor(Math.random() * 500)
        let ikan7 = Math.floor(Math.random() * 500)
        let ikan8 = Math.floor(Math.random() * 500)
        let ikan9 = Math.floor(Math.random() * 500)
        let ikan10 = Math.floor(Math.random() * 500)
        let ikan11 = Math.floor(Math.random() * 500)
        let ikan12 = Math.floor(Math.random() * 500) // Lele

        let umpans = `${Math.floor(Math.random() * 10)}`
        let pancingandurabilitys= `${Math.floor(Math.random() * 10)}`

        let hsl = `   
*🎣 Hasil tangkapan Mu*
${ikan1 ? `🦀 Kepiting: ${ikan1}` : ''} 
${ikan2 ? `🦞 Lobster: ${ikan2}` : ''} 
${ikan3 ? `🦐 Udang: ${ikan3}` : ''} 
${ikan4 ? `🦑 Cumi: ${ikan4}` : ''} 
${ikan5 ? `🐙 Gurita: ${ikan5}` : ''} 
${ikan6 ? `🐡 Buntal: ${ikan6}` : ''} 
${ikan7 ? `🐠 Dory: ${ikan7}` : ''} 
${ikan8 ? `🐳 Orca: ${ikan8}` : ''} 
${ikan9 ? `🐬 Lumba: ${ikan9}` : ''} 
${ikan10 ? `🐋 Paus: ${ikan10}` : ''} 
${ikan11 ? `🦈 Hiu: ${ikan11}` : ''} 
${ikan12 ? `🐟 Lele: ${ikan12}` : ''}

Ketik: *.kolam* Untuk Melihat Hasilnya
Kerusakan Pancingan:   - ${pancingandurabilitys}
Umpan Terpakai:   - ${umpans}
`.trim()

        // Tambahkan hasil ke inventori user
        user.kepiting += ikan1
        user.lobster += ikan2
        user.udang += ikan3
        user.cumi += ikan4
        user.gurita += ikan5
        user.buntal += ikan6
        user.dory += ikan7
        user.orca += ikan8
        user.lumba += ikan9
        user.paus += ikan10
        user.hiu += ikan11
        user.lele = (user.lele || 0) + ikan12

        user.pancingandurability -= parseInt(pancingandurabilitys)
        user.umpan -= parseInt(umpans)
        if (user.umpan < 0) user.umpan = 0
        if (user.pancingandurability < 0) user.pancingandurability = 0

        conn.misi[id] = [
            kerja,
            setTimeout(() => {
                delete conn.misi[id]
                m.reply('Kamu sudah bisa memancing kembali!')
            }, 62000)
        ]

        setTimeout(() => m.reply(hsl), 62000)
        setTimeout(() => m.reply(`Ini Dia Hasil Tangkapanmu`), 60000)
        setTimeout(() => m.reply('Kamu Sedang Memancing...\nTunggu 1 Menit Karena Kamu Lagi Nunggu Ikan'), 0)

        user.lastmisi = new Date * 1
    } else m.reply(`Mohon Tunggu Selama ${timers} Sebelum Memancing Kembali`)
}
handler.help = ['mancing']
handler.tags = ['rpg']
handler.command = /^(mancing|fishing|memancing)$/i
handler.register = true
handler.group = true
handler.level = 10
handler.rpg = true
export default handler

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}