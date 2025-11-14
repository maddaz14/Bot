import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    try {
        let [packname, ...author] = args.join` `.split`|`
        author = (author || []).join`|`
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (/webp/g.test(mime)) {
            throw 'Kamu tidak bisa mengubah stiker yang sudah ada menjadi stiker lagi! Silakan balas ke foto atau video.'
        } else if (/image/g.test(mime)) {
            let img = await q.download?.()
            stiker = await createSticker(img, false, packname, author)
        } else if (/video/g.test(mime) || /image\/gif/.test(mime)) { // Tambahkan dukungan untuk GIF
            const mediaBuffer = await q.download()

            if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')

            const tempInputPath = path.join('./tmp', `input_${Date.now()}.${/image\/gif/.test(mime) ? 'gif' : 'mp4'}`)
            const tempOutputPath = path.join('./tmp', `output_${Date.now()}.webp`)

            fs.writeFileSync(tempInputPath, mediaBuffer)

            await new Promise((resolve, reject) => {
                const ffmpegCmd = [
                    `-i ${tempInputPath}`,
                    '-vcodec libwebp',
                    '-lossless 0',
                    '-compression_level 6',
                    '-qscale 40',
                    '-preset default',
                    '-filter:v',
                    'fps=10,scale=320:320:force_original_aspect_ratio=decrease:flags=lanczos,pad=320:320:-1:-1:color=0x00000000',
                    '-loop 0',
                    '-an',
                    '-vsync 0',
                    '-t 5',
                    tempOutputPath
                ].join(' ')

                exec(`ffmpeg ${ffmpegCmd}`, (err, stdout, stderr) => {
                    if (err) return reject(err)
                    resolve()
                })
            })

            const stickerBuffer = fs.readFileSync(tempOutputPath)
            stiker = stickerBuffer

            fs.unlinkSync(tempInputPath)
            fs.unlinkSync(tempOutputPath)

        } else if (args[0] && isUrl(args[0])) {
            stiker = await createSticker(false, args[0], packname, author, 20)
        } else {
            throw `🛟 Silakan balas ke gambar atau video/gif dengan perintah ${usedPrefix + command}`
        }
    } catch (e) {
        console.log(e)
        stiker = e
    } finally {
        if (stiker && stiker instanceof Buffer) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
        } else if (typeof stiker === 'string') {
            m.reply(stiker)
        }
    }
}

handler.help = ['sticker', 's', 'stikergif', 'sgif']
handler.limit = true;
handler.tags = ['sticker']
handler.alias = ['stiker', 'sticker', 'sgif', 'stikergif', 'stickergif', 'togif'] // Tambahkan togif sebagai alias
handler.command = /^s(tic?ker)?(gif)?$/i

export default handler

const isUrl = (text) => text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))

async function createSticker(img, url, packName, authorName, quality) {
    let stickerMetadata = {
        type: 'full',
        pack: packName || global.packname, // Gunakan packName dari argumen atau global
        author: authorName || global.author, // Gunakan authorName dari argumen atau global
        quality
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}

async function mp4ToWebp(file, stickerMetadata) {
    if (stickerMetadata) {
        if (!stickerMetadata.pack) stickerMetadata.pack = global.packname
        if (!stickerMetadata.author) stickerMetadata.author = global.author
        if (!stickerMetadata.crop) stickerMetadata.crop = false
    } else if (!stickerMetadata) {
        stickerMetadata = { pack: global.packname, author: global.author, crop: false }
    }
    let getBase64 = file.toString('base64')
    const Format = {
        file: `data:video/mp4;base64,${getBase64}`,
        processOptions: {
            crop: stickerMetadata?.crop,
            startTime: '00:00:00.0',
            endTime: '00:00:7.0',
            loop: 0
        },
        stickerMetadata: {
            ...stickerMetadata
        },
        sessionInfo: {
            WA_VERSION: '2.2106.5',
            PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
            WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
            BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
            OS: 'Windows Server 2016',
            START_TS: 1614310326309,
            NUM: '6247',
            LAUNCH_TIME_MS: 7934,
            PHONE_VERSION: '2.20.205.16'
        },
        config: {
            sessionId: 'session',
            headless: true,
            qrTimeout: 20,
            authTimeout: 0,
            cacheEnabled: false,
            useChrome: true,
            killProcessOnBrowserClose: true,
            throwErrorOnTosBlock: false,
            chromiumArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--aggressive-cache-discard',
                '--disable-cache',
                '--disable-application-cache',
                '--disable-offline-load-stale-cache',
                '--disk-cache-size=0'
            ],
            executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
            skipBrokenMethodsCheck: true,
            stickerServerEndpoint: true
        }
    }
    let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
        method: 'post',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(Format)
    })
    return Buffer.from((await res.text()).split(';base64,')[1], 'base64')
}