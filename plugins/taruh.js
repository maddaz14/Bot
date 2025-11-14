// plugins/rpg-taruh.js
import pkg from '@fuxxy-star/baileys'
const { generateWAMessageFromContent } = pkg

let handler = async (m, { sock }) => {
    let oya = `Pilih Jumlah Money yang ingin Anda pertaruhkan`

    // Daftar opsi taruhan
    let taruhanList = [
        ["10000", "10,000"], ["20000", "20,000"], ["30000", "30,000"], ["40000", "40,000"],
        ["50000", "50,000"], ["60000", "60,000"], ["70000", "70,000"], ["80000", "80,000"],
        ["90000", "90,000"], ["100000", "100,000"], ["150000", "150,000"], ["200000", "200,000"],
        ["250000", "250,000"], ["300000", "300,000"], ["350000", "350,000"], ["400000", "400,000"],
        ["500000", "500,000"], ["700000", "700,000"], ["900000", "900,000"], ["1000000", "1,000,000"],
        ["all", "Semua Saldo"]
    ]

    let rows = taruhanList.map(([value, display]) => ({
        header: "",
        title: `${display} IDR`,
        description: `Taruhkan jumlah ini`,
        id: `.judi ${value}`
    }))

    let msg = generateWAMessageFromContent(
        m.key.remoteJid,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: "© ubed-MD 2025" },
                        header: {
                            title: "",
                            subtitle: "Pilih Jumlah Taruhan"
                        },
                        contextInfo: {
                            forwardingScore: 2025,
                            isForwarded: true,
                            mentionedJid: [m.sender]
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Jumlah Taruhan",
                                    sections: [{
                                        title: "Daftar Taruhan",
                                        highlight_label: "Judi RPG",
                                        rows
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    )

    await sock.relayMessage(m.key.remoteJid, msg.message, { messageId: msg.key.id })
}

handler.help = ["taruh"]
handler.tags = ["rpg"]
handler.command = /^taruh$/i

export default handler