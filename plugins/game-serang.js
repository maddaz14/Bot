const handler = async (m, { conn, command, text }) => {
    // Logika dasar untuk memulai perang kartu
    const target = m.mentionedJid[0]
    if (!target) throw `Tag seseorang untuk bertarung!\n\nContoh: ${command} @user`

    const battleText = `🃏 *Perang Kartu Dimulai!*\n\nMusuh: @${target.split('@')[0]}\n\nPilih kartu untuk bertarung!`
    const buttons = [
        { buttonId: 'serang', buttonText: { displayText: 'Serang Kartu ⚔️' }, type: 1 },
        { buttonId: 'pertahanan', buttonText: { displayText: 'Bertahan 🛡️' }, type: 1 },
        { buttonId: 'spesial', buttonText: { displayText: 'Gunakan Kartu Spesial 🌟' }, type: 1 }
    ]

    // Kirim pesan dengan tombol pilihan kartu
    await conn.sendMessage(m.chat, {
        text: battleText,
        mentions: [target],
        footer: 'ubed Bot - Card Battle',
        buttons: buttons,
        headerType: 1
    })
}

// Kode untuk menangani aksi dari button yang ditekan (serang, pertahanan, atau spesial)
const handleCardAction = async (m, { conn, command }) => {
    const playerPower = Math.floor(Math.random() * 50) + 10  // Power serang acak (10-50)
    const enemyPower = Math.floor(Math.random() * 50) + 10   // Power musuh acak (10-50)

    if (command === 'serang') {
        const result = playerPower > enemyPower ? 'Menang' : 'Kalah'
        const battleOutcome = result === 'Menang' ? `🎉 Kamu menang! Kekuatan: ${playerPower} > ${enemyPower}` : `😞 Kamu kalah! Kekuatan: ${playerPower} < ${enemyPower}`

        await conn.sendMessage(m.chat, {
            text: `${battleOutcome}\n\nHadiah: 10000-1000000 money, 49-4999 exp, 20-150 balance!`,
            footer: 'ubed Bot - Card Battle'
        })
    }

    if (command === 'pertahanan') {
        const defensePower = Math.floor(Math.random() * 30) + 10
        const battleOutcome = playerPower > (enemyPower - defensePower) ? 'Menang' : 'Kalah'

        await conn.sendMessage(m.chat, {
            text: `${battleOutcome}\n\nKekuatan pertahanan: ${defensePower}\nHadiah: 5000-500000 money, 30-3000 exp, 10-100 balance!`,
            footer: 'ubed Bot - Card Battle'
        })
    }

    if (command === 'spesial') {
        const specialEffect = Math.floor(Math.random() * 30) + 10
        const newEnemyPower = enemyPower - specialEffect
        const battleOutcome = playerPower > newEnemyPower ? 'Menang' : 'Kalah'

        await conn.sendMessage(m.chat, {
            text: `${battleOutcome}\n\nKartu Spesial mengurangi serangan musuh sebesar ${specialEffect}!\nHadiah: 15000-1500000 money, 100-4999 exp, 50-200 balance!`,
            footer: 'ubed Bot - Card Battle'
        })
    }
}

handler.command = /^(serang|pertahanan|spesial)$/i
handler.group = true

export default handler