// plugins/tools-converter.js
import pkg from '@fuxxy-star/baileys'
const { generateWAMessageFromContent, proto } = pkg
import axios from 'axios'

let handler = async (m, { sock, usedPrefix, command }) => {
    const quoted = m.quoted ? m.quoted : m
    const originalCode = quoted.text || quoted.caption

    if (!originalCode) {
        return m.reply(`Balas pesan yang berisi kode JavaScript dengan perintah:\n*${usedPrefix + command}*`)
    }

    try {
        const conversionType = command === 'cte' ? 'CJS to ESM' : 'ESM to CJS'
        let convertedCode = ''
        let source = 'API'

        try {
            convertedCode = await convertWithApi(originalCode, command)
        } catch (apiError) {
            console.error('API Error:', apiError)
            source = 'Local'
            convertedCode = localConversion(originalCode, command)
        }

        const interactiveMessage = createInteractiveMessage(conversionType, convertedCode, source)

        const message = await generateWAMessageFromContent(
            m.key.remoteJid,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        interactiveMessage: proto.Message.InteractiveMessage.fromObject(interactiveMessage)
                    }
                }
            },
            { userJid: sock.user.id, quoted: m }
        )

        await sock.relayMessage(m.key.remoteJid, message.message, { messageId: message.key.id })

    } catch (error) {
        console.error('Conversion error:', error)
        m.reply(`Gagal mengkonversi kode: ${error.message}\n\nPastikan kode yang dikirim valid dan coba lagi.`)
    }
}

handler.help = [
    'cte <reply code> - Convert CJS to ESM',
    'etc <reply code> - Convert ESM to CJS'
]
handler.tags = ['tools']
handler.command = ['cte', 'etc']
handler.limit = true
handler.owner = true

export default handler

// =============================
// Fungsi pembantu
// =============================
async function convertWithApi(code, command) {
    const apiUrl = command === 'cte'
        ? 'https://api.nekorinn.my.id/tools/cjs2esm'
        : 'https://api.nekorinn.my.id/tools/esm2cjs'

    const response = await axios.post(apiUrl, { code }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
    })

    if (response.data?.result) {
        return response.data.result
    } else {
        throw new Error('Format respons tidak valid')
    }
}

function localConversion(code, type) {
    try {
        if (type === 'cte') {
            return code
                .replace(/require\((['"])(.*?)\1\)/g, 'import $2 from $1$2$1')
                .replace(/module\.exports\s*=\s*(.*?);/g, 'export default $1;')
                .replace(/exports\.(\w+)\s*=\s*(.*?);/g, 'export const $1 = $2;')
        } else {
            return code
                .replace(/import\s+(.*?)\s+from\s+(['"])(.*?)\2/g, 'const $1 = require($2$3$2)')
                .replace(/export\s+default\s+(.*?);/g, 'module.exports = $1;')
                .replace(/export\s+(const|let|var)\s+(\w+)\s*=\s*(.*?);/g, 'exports.$2 = $3;')
        }
    } catch (e) {
        console.error('Local conversion error:', e)
        throw new Error('Gagal melakukan konversi lokal')
    }
}

function createInteractiveMessage(conversionType, convertedCode, source) {
    const resultText = `*Hasil Konversi ${conversionType} (${source})*\n\`\`\`javascript\n${convertedCode}\n\`\`\``
    return {
        body: { text: resultText },
        footer: { text: global.namabot || "UbedBot" },
        header: {
            title: `${conversionType} Converter`,
            subtitle: "Klik tombol untuk salin",
            hasMediaAttachment: false
        },
        nativeFlowMessage: {
            buttons: [
                {
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({
                        display_text: "📋 Salin Kode",
                        id: `copy-code-${Date.now()}`,
                        copy_code: convertedCode
                    })
                }
            ]
        }
    }
}