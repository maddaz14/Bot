// plugins/kapal-berlayar.js
import fs from 'fs'
import pkg from '@fuxxy-star/baileys'
const { generateWAMessageFromContent, proto } = pkg

// Kontak fiktif untuk quoted
const fkontak = {
    key: {
        participant: '0@s.whatsapp.net',
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo',
    },
    message: {
        conversation: `berlayar ${global.namebot || 'Bot'} ✨`,
    }
}

let cooldowns = {}
const COOLDOWN_TIME = 60 * 60 * 1000 // 1 jam

export default async function kapalBerlayar(sock, m, body, args, command) {
    try {
        let sender = m.key.participant || m.key.remoteJid
        let chatId = m.key.remoteJid
        let name = (global.db?.data?.users?.[sender]?.name) || sender.split('@')[0]

        // Inisialisasi cooldown user
        let currentTime = Date.now()
        if (!cooldowns[sender]) cooldowns[sender] = 0

        // Cek cooldown
        if (currentTime < cooldowns[sender]) {
            let remainingTime = Math.ceil((cooldowns[sender] - currentTime) / 1000 / 60)
            return await sock.sendMessage(chatId, { text: `⏳ Harap tunggu ${remainingTime} menit lagi sebelum berlayar lagi.` }, { quoted: fkontak })
        }

        const countries = [
            "Amerika", "Belanda", "China", "Inggris", "India", "Indonesia",
            "Italia", "Jepang", "Korea", "Malaysia", "Rusia", "Singapura",
            "Spanyol", "Thailand", "Jerman"
        ]

        if (command === 'kapal') {
            let countryList = countries.map((c, i) => `${i + 1}. ${c}`).join('\n')
            return await sock.sendMessage(chatId, {
                text: `🚢 Berlayar menuju berbagai dunia.\n\n${countryList}\n\nContoh: .berlayar 10`
            }, { quoted: fkontak })
        }

        if (command === 'berlayar') {
            let choice = parseInt(args[0]) - 1
            if (isNaN(choice) || choice < 0 || choice >= countries.length) {
                return await sock.sendMessage(chatId, { text: "Pilihan tidak valid. Ketik .kapal untuk melihat daftar negara." }, { quoted: fkontak })
            }

            let selectedCountry = countries[choice]

            // Pesan keberangkatan
            await sock.sendMessage(chatId, { text: `🛳️ Kamu berangkat menuju\n🗺 ${selectedCountry}.` }, { quoted: fkontak })

            // Random hadiah
            let moneyReward = Math.floor(Math.random() * (3000000 - 100 + 1)) + 100
            let expReward = Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000
            let legendaryReward = Math.floor(Math.random() * (30 - 12 + 1)) + 12

            cooldowns[sender] = currentTime + COOLDOWN_TIME

            // Simulasi perjalanan
            await new Promise(res => setTimeout(res, 5000))

            // Kirim hasil perjalanan
            let hasil = `🚢 Perjalanan menuju ${selectedCountry} berhasil 🌎\n\n` +
                        `💰 Money: ${moneyReward}\n` +
                        `🧪 Exp: ${expReward}\n` +
                        `🏆 Legendary: ${legendaryReward}`

            await sock.sendMessage(chatId, { text: hasil }, { quoted: fkontak })

            // Update database global
            if (!global.db.data.users[sender]) {
                global.db.data.users[sender] = { money: 0, exp: 0, legendary: 0 }
            }
            global.db.data.users[sender].money += moneyReward
            global.db.data.users[sender].exp += expReward
            global.db.data.users[sender].legendary += legendaryReward

            // Pesan ajakan lagi 1 jam kemudian
            setTimeout(() => {
                sock.sendMessage(chatId, { text: `Ayo berlayar lagi ke negara-negara besar!` }, { quoted: fkontak })
            }, COOLDOWN_TIME)
        }
    } catch (err) {
        console.error(err)
        await sock.sendMessage(m.key.remoteJid, { text: `❌ Terjadi kesalahan: ${err.message}` }, { quoted: fkontak })
    }
}