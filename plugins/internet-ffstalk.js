import axios from 'axios'

async function ffSearch(username) {
 const { data } = await axios.get(`https://discordbot.freefirecommunity.com/search_player_api?nickname=${encodeURIComponent(username)}`, {
 headers: {
 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
 'Accept': '*/*',
 'Referer': 'https://www.freefirecommunity.com/ff-player-search/'
 }
 })
 return data
}

let handler = async (m, { conn, args }) => {
 try {
 if (!args[0]) return m.reply('Berikan Nickname FF Nya')
 
 let data = await ffSearch(args[0])
 
 if (data.error) return m.reply('Skill Issue : ' + data.error)
 
 let text = `Result For : ${args[0]}\n\n`
 
 data.forEach((player, index) => {
 const lastLogin = new Date(player.lastLogin * 1000).toLocaleDateString('id-ID')
 text += `${index + 1}. Nickname : ${player.nickname}\n`
 text += ` Account ID : ${player.accountId}\n`
 text += ` Level : ${player.level}\n`
 text += ` Region : ${player.region}\n`
 text += ` Last Login : ${lastLogin}\n\n`
 })
 
 m.reply(text.trim())
 } catch (e) {
 m.reply(e.message)
 }
}

handler.help = ['ffsearch']
handler.command = ['ffsearch', 'ffstalk']
handler.tags = ['internet']

export default handler