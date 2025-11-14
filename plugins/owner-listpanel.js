import fetch from 'node-fetch'

const handler = async (m, { conn, command }) => {
  const domain = "https://private.ubed.my.id"
  const apikey = "ptla_hsCXOzRmkqAg2uuYxfx9wRsNMHosSPCKeuFUWr9c62J" // Ganti dengan API Key yang sebenarnya jika ini hanya contoh

  try {
    // Ambil daftar server
    const serverRes = await fetch(`${domain}/api/application/servers`, {
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json"
      }
    })

    const serverData = await serverRes.json()
    if (serverData.errors) {
      return m.reply("❌ Error mengambil daftar server:\n" + JSON.stringify(serverData.errors[0], null, 2))
    }

    const servers = serverData.data // Data server ada di properti 'data'

    if (servers.length === 0) {
      return m.reply("❗ Tidak ada panel yang terdaftar.")
    }

    let listText = "📜 *Daftar Panel Server* 📜\n\n"
    for (const server of servers) {
      const attributes = server.attributes
      listText += `*ID Server:* \`${attributes.id}\`\n`
      listText += `*Nama:* \`${attributes.name}\`\n`
      listText += `*Deskripsi:* \`${attributes.description || 'N/A'}\`\n`
      listText += `*RAM:* ${attributes.limits.memory ? attributes.limits.memory / 1000 + 'GB' : 'Unlimited'}\n`
      listText += `*Disk:* ${attributes.limits.disk ? attributes.limits.disk / 1000 + 'GB' : 'Unlimited'}\n`
      listText += `*CPU:* ${attributes.limits.cpu ? attributes.limits.cpu + '%' : 'Unlimited'}\n`
      listText += `*Status:* ${attributes.status || 'Unknown'}\n`
      listText += `*Owner ID:* ${attributes.user}\n`
      listText += `*Last Updated:* ${new Date(attributes.updated_at).toLocaleDateString('id-ID')}\n\n`
    }

    listText += "```Gunakan .delpanel <server_id> untuk menghapus.```"

    await conn.reply(m.chat, listText, m)

  } catch (err) {
    console.error(err)
    return m.reply("❌ Gagal mengambil daftar panel:\n" + err.message)
  }
}

handler.owner = true; // Hanya owner bot yang bisa menggunakan command ini
handler.command = /^(listpanel)$/i
export default handler