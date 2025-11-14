let handler = async (m, { args, command }) => {
    if (!args[0]) return m.reply(`Contoh penggunaan:\n.${command} kill,match,lose,win,target_wr\n\nContoh:\n.${command} 50,12,2,10,90%`)

    let input = args[0].split(',')
    if (input.length !== 5) return m.reply(`⚠️ Format salah!\nContoh: .${command} 50,12,2,10,90%`)

    let [kill, match, lose, win, wrTarget] = input.map(v => v.toLowerCase().replace(/%/g, ''))
    kill = parseInt(kill)
    match = parseInt(match)
    lose = parseInt(lose)
    win = parseInt(win)
    wrTarget = parseFloat(wrTarget)

    if ([kill, match, lose, win, wrTarget].some(isNaN)) return m.reply('⚠️ Semua nilai harus berupa angka!\nContoh: .winrate 50,12,2,10,90%')

    let wrSekarang = (win / match) * 100
    if (wrTarget <= wrSekarang) return m.reply(`🎯 WR kamu sekarang sudah ${wrSekarang.toFixed(2)}%. Tidak perlu menambah kemenangan.`)

    let winTambahan = 0
    let matchBaru = match
    let winBaru = win

    while (true) {
        matchBaru++
        winBaru++
        winTambahan++
        let wrBaru = (winBaru / matchBaru) * 100
        if (wrBaru >= wrTarget) break
        if (winTambahan > 1000) break // biar ga infinite
    }

    return m.reply(
`📊 *Analisa Winrate Mobile Legends*
- WR Saat Ini: *${wrSekarang.toFixed(2)}%*
- Target WR: *${wrTarget}%*
- Match Saat Ini: *${match}*
- Win Saat Ini: *${win}*
- Kill Total: *${kill}*
- Lose: *${lose}*

🎯 Untuk mencapai *${wrTarget}% WR*, kamu harus menang *${winTambahan}x* berturut-turut tanpa kalah!
Setelah itu, match-mu akan menjadi *${match + winTambahan}* dengan total win *${win + winTambahan}*.
`)
}

handler.help = ['winrate']
handler.tags = ['tools', 'ml']
handler.command = /^winrate$/i

export default handler