import fetch from 'node-fetch'

const handler = async (m, { text, command, conn }) => {
  const allowedCommands = ['1gb','2gb','3gb','4gb','5gb','6gb','7gb','8gb','9gb','10gb','unlimited','unli']
  if (!allowedCommands.includes(command)) return

  if (!text) return m.reply(`❗ Contoh:\n.${command} username,6285XXXXXX[,grupid@s.whatsapp.net]`)

  let [usernem, nomorRaw, chatTarget] = text.split(',').map(t => t.trim())

  if (!usernem || !nomorRaw) return m.reply(`❗ Format salah.\nContoh: .${command} username,6285XXXX[,grupid]`)

  let nomor = nomorRaw.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
  let targetChat = chatTarget && chatTarget.endsWith('@g.us') ? chatTarget : nomor

  const onWa = await conn.onWhatsApp(nomor.split("@")[0])
  if (!onWa?.[0]?.exists) return m.reply("❌ Nomor tidak terdaftar di WhatsApp!")

  const resourceMap = {
    "1gb": { ram: 1000, disk: 1000, cpu: 40 },
    "2gb": { ram: 2000, disk: 1000, cpu: 60 },
    "3gb": { ram: 3000, disk: 2000, cpu: 80 },
    "4gb": { ram: 4000, disk: 2000, cpu: 100 },
    "5gb": { ram: 5000, disk: 3000, cpu: 120 },
    "6gb": { ram: 6000, disk: 3000, cpu: 140 },
    "7gb": { ram: 7000, disk: 4000, cpu: 160 },
    "8gb": { ram: 8000, disk: 4000, cpu: 180 },
    "9gb": { ram: 9000, disk: 5000, cpu: 200 },
    "10gb": { ram: 10000, disk: 5000, cpu: 220 },
    "unlimited": { ram: 0, disk: 0, cpu: 0 },
    "unli": { ram: 0, disk: 0, cpu: 0 }
  }

  const { ram, disk, cpu } = resourceMap[command]
  const username = usernem.toLowerCase()
  const password = `${username}001`
  const email = `${username}-${Date.now()}@gmail.com`
  const name = username + ' Server'

  const domain = "https://privatfiff.lightsecret.xyz"
  const apikey = "-"
  const nestid = "5"
  const egg = "15"
  const loc = "1"

  try {
    const res = await fetch(`${domain}/api/application/users`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apikey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email,
        username,
        first_name: name,
        last_name: "Bot",
        language: "en",
        password
      })
    })

    const userData = await res.json()
    if (userData.errors) return m.reply("❌ Error membuat user:\n" + JSON.stringify(userData.errors[0], null, 2))
    const user = userData.attributes

    const eggInfo = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${egg}`, {
      headers: { Authorization: "Bearer " + apikey, Accept: "application/json" }
    }).then(res => res.json())

    if (!eggInfo?.attributes?.startup) {
      return m.reply("❌ Gagal ambil data egg. Periksa ID egg atau izin API.")
    }

    const startup_cmd = eggInfo.attributes.startup

    const serverRes = await fetch(`${domain}/api/application/servers`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        description: new Date().toLocaleDateString('id-ID'),
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: startup_cmd,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start",
          JS_FILE: "index.js" // ✅ Ditambahkan agar tidak error
        },
        limits: { memory: ram, swap: 0, disk, io: 500, cpu },
        feature_limits: { databases: 5, backups: 5, allocations: 5 },
        deploy: { locations: [parseInt(loc)], dedicated_ip: false, port_range: [] }
      })
    })

    const serverData = await serverRes.json()
    if (serverData.errors) return m.reply("❌ Error saat buat server:\n" + JSON.stringify(serverData.errors[0], null, 2))
    const server = serverData.attributes

    const teks = `
✅ *Panel berhasil dibuat!*

📡 *Server ID:* ${server.id}
👤 *Username:* \`${user.username}\`
🔐 *Password:* \`${password}\`
📅 *Aktif:* ${new Date().toLocaleDateString('id-ID')}

⚙️ *Spesifikasi*
- RAM: ${ram ? ram / 1000 + 'GB' : 'Unlimited'}
- Disk: ${disk ? disk / 1000 + 'GB' : 'Unlimited'}
- CPU: ${cpu ? cpu + '%' : 'Unlimited'}
- Panel: ${domain}

📌 *Note:*
- Berlaku 30 hari
- Simpan data dengan aman
- Klaim garansi 15 hari harus disertai bukti pembelian
`

    await conn.sendMessage(targetChat, { text: teks }, { quoted: m })

    if (targetChat !== m.chat) {
      await m.reply(`✅ Data akun dikirim ke *${targetChat}*`)
    }

  } catch (err) {
    console.error(err)
    return m.reply("❌ Gagal membuat panel:\n" + err.message)
  }
}

handler.owner = true;
handler.command = /^([1-9]gb|10gb|unli|unlimited)$/i
export default handler