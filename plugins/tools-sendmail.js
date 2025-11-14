import fetch from 'node-fetch'

let handler = async (m, { args, usedPrefix, command }) => {
  if (args.length < 4)
    return m.reply(`*Contoh penggunaan:*\n${usedPrefix + command} recipient@example.com anonymous@example.com "Subject Email" "Isi pesan email"`)

  let [to, from, subject, ...messageParts] = args
  let message = messageParts.join(' ').replace(/"/g, '')

  let apiUrl = `https://api.ubed.my.id/tools/sendmail?apikey=ubed2407` +
               `&to=${encodeURIComponent(to)}` +
               `&from=${encodeURIComponent(from)}` +
               `&subject=${encodeURIComponent(subject)}` +
               `&message=${encodeURIComponent(message)}`

  m.reply('_Mengirim email..._')

  let res = await fetch(apiUrl)
  let json = await res.json().catch(() => null)

  if (!json || json.status !== 200)
    return m.reply('❌ Gagal mengirim email.')

  let { to: toMail, from: fromMail, subject: subj, messagePreview, timestamp } = json.result

  let hasil = `*✅ Email Berhasil Dikirim!*\n\n` +
              `*Kepada:* ${toMail}\n` +
              `*Dari:* ${fromMail}\n` +
              `*Subjek:* ${subj}\n` +
              `*Isi:* ${messagePreview}\n` +
              `*Waktu:* ${new Date(timestamp).toLocaleString()}`

  m.reply(hasil)
}

handler.help = ['sendmail <to> <from> <subject> <message>']
handler.tags = ['tools']
handler.command = /^sendmail$/i

export default handler