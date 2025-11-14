import axios from 'axios'
import * as cheerio from "cheerio"

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `• *Example:* ${usedPrefix + command} zenzxdd`
    let username = args[0]

    // React emoji sebelum proses
    await conn.sendMessage(m.chat, {
        react: {
            text: "🕊️",
            key: m.key
        }
    })

    try {
        let hasil = await igstalk(username)
        if (hasil.error) throw hasil.error

        let caption = `┌─⭓「 *Instagram Stalker* 」\n` +
                      `│ *• Username :* ${hasil.username || '-'}\n` +
                      `│ *• Bio :* ${hasil.description || '-'}\n` +
                      `│ *• Posts :* ${hasil.posts || '-'}\n` +
                      `│ *• Followers :* ${hasil.followers || '-'}\n` +
                      `│ *• Following :* ${hasil.following || '-'}\n` +
                      `└───────────────⭓`

        await conn.sendFile(m.chat, hasil.avatar, 'profile.jpg', caption, m)
    } catch (err) {
        m.reply(`❌ Error: ${err.message || err}`)
    }
}

handler.help = ['igstalk'].map(v => v + ' <username>')
handler.tags = ['tools']
handler.command = /^igstalk$/i
export default handler

async function igstalk(username) {
    try {
        const url = `https://insta-stories-viewer.com/${username}`
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
            },
        })

        const $ = cheerio.load(html)

        const avatar = $('.profile__avatar-pic').attr('src')
        const nickname = $('.profile__nickname').clone().children().remove().end().text().trim()
        const description = $('.profile__description').text().trim()

        const posts = $('.profile__stats-posts').text().trim()
        const followers = $('.profile__stats-followers').text().trim()
        const following = $('.profile__stats-follows').text().trim()

        return {
            username: nickname,
            avatar,
            description,
            posts,
            followers,
            following,
        }
    } catch (error) {
        return { error: error.message || 'Scrape error' }
    }
}