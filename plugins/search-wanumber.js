import moment from 'moment-timezone'

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return m.reply(`Provide Number with last number x\n\nContoh: ${usedPrefix + command} 91690913721x`)

  const inputnumber = text.split(" ")[0]

  m.reply(`Searching for WhatsApp account in given range...`)

  function countInstances(string, word) {
    return string.split(word).length - 1
  }

  const number0 = inputnumber.split('x')[0]
  const number1 = inputnumber.split('x')[countInstances(inputnumber, 'x')] || ''
  const random_length = countInstances(inputnumber, 'x')

  let randomxx
  if (random_length === 1) randomxx = 10
  else if (random_length === 2) randomxx = 100
  else if (random_length === 3) randomxx = 1000
  else randomxx = 1

  let text66 = `*==[ List of Whatsapp Numbers ]==*\n\n`
  let nobio = `\n*Bio:* || \nHey there! I am using WhatsApp.\n`
  let nowhatsapp = `\n*Numbers with no WhatsApp account within provided range.*\n`

  for (let i = 0; i < randomxx; i++) {
    const nu = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9']
    // generate random digits to replace 'x'
    const randomDigits = Array(random_length).fill(0).map(() => nu[Math.floor(Math.random() * nu.length)]).join('')

    // Construct the full number replacing 'x' with randomDigits
    const fullNumber = `${number0}${randomDigits}${number1}`
    try {
      // Check if number is on WhatsApp
      const anu = await conn.onWhatsApp(`${fullNumber}@s.whatsapp.net`)
      if (anu && anu.length > 0) {
        try {
          const status = await conn.fetchStatus(anu[0].jid)
          if (!status || status.status === '' || status === '401') {
            nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`
          } else {
            text66 += `🪀 *Number:* wa.me/${anu[0].jid.split("@")[0]}\n 🎗️*Bio :* ${status.status}\n🧐*Last update :* ${moment(status.setAt).tz('Asia/Kolkata').format('HH:mm:ss DD/MM/YYYY')}\n\n`
          }
        } catch {
          nobio += `wa.me/${anu[0].jid.split("@")[0]}\n`
        }
      } else {
        nowhatsapp += `${fullNumber}\n`
      }
    } catch (e) {
      nowhatsapp += `${fullNumber}\n`
    }
  }

  m.reply(`${text66}${nobio}${nowhatsapp}`)
}

handler.help = ['wanumber <number>x']
handler.tags = ['search']
handler.command = /^(wanumber|searchno|searchnumber)$/i

export default handler