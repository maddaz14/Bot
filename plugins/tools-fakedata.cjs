const fetch = require('node-fetch')

let handler = async (m, { conn, text, usedPrefix, command }) => {
 try {
 // Send processing reaction
 await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

 // Parse input
 const [type, count] = text.split(' ')
 const validTypes = ['person', 'company', 'product', 'address', 'internet', 'finance', 'vehicle', 'lorem', 'date']
 
 // Validate input
 if (!type||!validTypes.includes(type.toLowerCase())) {
 throw `Invalid type. Available types:\n${validTypes.join(', ')}\n\nExample: ${usedPrefix + command} person 5`
 }
 
 const itemCount = parseInt(count)||1
 if (itemCount < 1||itemCount > 20) {
 throw 'Count must be between 1-20'
 }

 // Fetch fake data from API
 const response = await fetch(`https://api.siputzx.my.id/api/tools/fake-data?type=${type}&count=${itemCount}`)
 if (!response.ok) throw 'Failed to fetch fake data'
 
 const json = await response.json()
 if (!json.status||!json.data) throw 'No data received'

 // Format the response based on type
 let message = `*🔹 FAKE ${type.toUpperCase()} DATA (${json.count}) 🔹*\n\n`
 
 json.data.forEach((item, index) => {
 message += `*#${index + 1}*\n`
 
 if (type === 'person') {
 message += `👤 Name: ${item.name}\n`
 message += `📧 Email: ${item.email}\n`
 message += `📞 Phone: ${item.phone}\n`
 message += `🎂 Birth: ${new Date(item.birthDate).toLocaleDateString()}\n`
 message += `⚧ Gender: ${item.gender}\n`
 message += `🖼️ Avatar: ${item.avatar}\n`
 } 
 else if (type === 'company') {
 message += `🏢 Name: ${item.name}\n`
 message += `📍 Industry: ${item.industry}\n`
 message += `📧 Email: ${item.email}\n`
 message += `🌐 Website: ${item.website}\n`
 }
 else if (type === 'product') {
 message += `📦 Name: ${item.name}\n`
 message += `💰 Price: ${item.price}\n`
 message += `📝 Description: ${item.description}\n`
 message += `🏷️ Category: ${item.category}\n`
 }
 // Add more type handlers as needed
 else {
 // Default handler for other types
 for (const [key, value] of Object.entries(item)) {
 message += `🔸 ${key}: ${value}\n`
 }
 }
 
 message += '\n'
 })

 message += `_Generated at: ${new Date().toLocaleString('id-ID')}_`

 // Send the result
 await conn.sendMessage(m.chat, { 
 text: message,
 mentions: [m.sender]
 }, { quoted: m })

 await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
 } catch (e) {
 console.error(e)
 await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
 m.reply(`Error: ${e.message||e}`)
 }
}

handler.help = ['fakedata <type> <count>']
handler.tags = ['tools']
handler.command = /^(fakedata|fake|randomdata)$/i
handler.limit = true

module.exports = handler