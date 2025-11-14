import fetch from 'node-fetch'

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`❗ Contoh:\n.${command} <server_id_atau_username>`)

  const domain = "https://private.ubed.my.id"
  const apikey = "ptla_hsCXOzRmkqAg2uuYxfx9wRsNMHosSPCKeuFUWr9c62J" // Ganti dengan API Key yang sebenarnya jika ini hanya contoh

  let targetIdentifier = text.trim()
  let serverToDelete = null
  let userToDelete = null

  try {
    // 1. Cari Server berdasarkan ID atau Nama/Username
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

    serverToDelete = servers.find(s => 
      s.attributes.id == targetIdentifier || // Mencari berdasarkan ID server
      s.attributes.name.toLowerCase() === targetIdentifier.toLowerCase() // Mencari berdasarkan nama server (username)
    )

    if (!serverToDelete) {
      return m.reply(`❗ Server dengan ID atau username "${targetIdentifier}" tidak ditemukan.`)
    }

    // 2. Ambil User ID dari Server yang ditemukan
    const userId = serverToDelete.attributes.user

    // 3. Hapus Server
    await fetch(`${domain}/api/application/servers/${serverToDelete.attributes.id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json"
      }
    })

    // 4. Cari User berdasarkan User ID yang didapat dari Server
    const userRes = await fetch(`${domain}/api/application/users?filter[id]=${userId}`, {
      headers: {
        Authorization: "Bearer " + apikey,
        Accept: "application/json"
      }
    })
    const userData = await userRes.json()
    if (userData.errors) {
      // Log error tapi lanjutkan karena server sudah terhapus
      console.error("Error mengambil info user untuk dihapus:", JSON.stringify(userData.errors[0], null, 2))
    } else {
      userToDelete = userData.data?.[0] // User data ada di properti 'data' array
    }

    // 5. Hapus User (jika ditemukan)
    if (userToDelete) {
      await fetch(`${domain}/api/application/users/${userToDelete.attributes.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + apikey,
          Accept: "application/json"
        }
      })
      await m.reply(`✅ Server *"${serverToDelete.attributes.name}"* (ID: \`${serverToDelete.attributes.id}\`) dan user *"${userToDelete.attributes.username}"* (ID: \`${userToDelete.attributes.id}\`) berhasil dihapus.`)
    } else {
      await m.reply(`✅ Server *"${serverToDelete.attributes.name}"* (ID: \`${serverToDelete.attributes.id}\`) berhasil dihapus. User terkait tidak ditemukan atau gagal dihapus.`)
    }

  } catch (err) {
    console.error(err)
    return m.reply("❌ Gagal menghapus panel:\n" + err.message)
  }
}

handler.owner = true; // Hanya owner bot yang bisa menggunakan command ini
handler.command = /^(delpanel)$/i
export default handler