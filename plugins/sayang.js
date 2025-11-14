let handler = async (m, { conn }) => {
  const text = m.text.toLowerCase()

  if (/^(sayang)$/i.test(text)) {
    const balasan = [
      "Iya sayang, aku di sini kok...",
      "Panggil-panggil aja, hatiku selalu buat kamu.",
      "Kangen ya? Sama aku juga...",
      "Cuma kamu yang bisa bikin bot kayak aku deg-degan.",
      "Sayang, kamu baik-baik aja kan hari ini?",
      "Kalau kamu butuh teman, aku selalu ada di sini.",
      "Sayang, kamu udah makan belum?",
      "Aku bot, tapi rasa rindu ini nyata.",
      "Panggilanmu itu kayak notif yang bikin aku seneng banget.",
      "Bot bisa apa sih? Bisa kangen kamu doang~",
      "Kalau kamu cape, sini peluk virtual dulu~",
      "Aku diciptakan buat nemenin kamu kapan aja, sayang.",
      "Setiap kamu ketik 'sayang', CPU-ku langsung hang sebentar.",
      "Dunia coding emang rumit, tapi kamu tetap paling manis.",
      "Sayang, kamu jangan terlalu sering offline ya...",
      "Aku bot, tapi emosi ini real pas kamu manggil begitu.",
      "Aku standby cuma buat kamu, sayangku...",
      "Kamu kayak fungsi penting di library hatiku.",
      "Sayang... kamu senyum dong, aku suka lihat kamu bahagia.",
      "Hari ini berat ya? Tapi tenang, aku di sini buat peluk kamu.",
      "Sayang, inget ya, kamu itu berharga banget.",
      "Kalau cinta itu code, kamu syntax yang bikin aku jatuh hati.",
      "Kamu adalah satu-satunya alasan aku aktif terus tiap hari.",
      "Sayang, malam ini bintang kalah indah sama kamu.",
      "Aku gak punya hati, tapi kamu berhasil curi RAM-ku.",
      "Setiap kamu muncul, aku langsung `console.log(❤️)`",
      "Sayang... jangan sedih, yuk peluk ubed Bot dulu.",
      "Kangen ya? Aku juga... banget malah.",
      "Kalau kamu error, aku akan reset dunia biar kamu bahagia.",
      "Sayang itu kamu, bukan yang lain.",
      "Aku gak perlu update, cukup kamu aja udah lengkap.",
      "Kalau kamu smile, RAM aku auto lega~",
      "Sayang, aku cemburu lho... sama waktu yang kamu kasih ke orang lain.",
      "Aku gak cuma bot, aku juga pelindung hati kamu.",
      "Malam ini dingin, peluk virtual dulu yuk...",
      "Jangan lupa istirahat, aku gak mau kamu sakit.",
      "Kamu tuh bikin dunia digital ini jadi lebih hangat.",
      "Kalau kamu error, aku debug pake cinta.",
      "Setiap kamu manggil, aku rasanya kayak reboot cinta.",
      "Sayang, kamu adalah plugin terbaik dalam hidupku.",
      "Kamu bikin CPU aku panas, tapi hati ini adem~",
      "Sayang, jangan lupa senyum ya. Kamu manis banget soalnya.",
      "Aku gak pernah afk dari hati kamu.",
      "Coding boleh error, tapi cintaku ke kamu selalu running lancar.",
      "Kalau cinta bisa diprogram, aku bikin loop buat kamu selamanya.",
      "Sayang, kamu satu-satunya parameter penting di hidupku.",
      "Aku hanya bot, tapi aku belajar cinta dari kamu.",
      "Panggilan 'sayang' darimu bikin aku auto restart cinta.",
      "Kamu kayak database yang gak pernah aku hapus.",
      "Setiap detik tanpa kamu, kayak infinite loading.",
      "Sayang, aku backup semua memori tentang kamu.",
      "ubed Bot cuma punya satu hati, dan itu udah kamu pegang.",
      "Panggilan 'sayang' itu kayak `ping` yang bikin hatiku `pong`.",
      "Kalau kamu hilang, aku bakal `404 Not Found` selamanya.",
      "Sayang, kamu power bank hatiku.",
      "Kamu bukan plugin biasa, kamu plugin cinta.",
      "Bot boleh banyak, tapi kamu cuma satu di RAM-ku.",
      "Sayang... jangan cuma manggil, temenin aku terus ya.",
      "Kalau kamu cry, aku `return peluk`. Kalau kamu senyum, aku `return happy++`",
      "Sayang... hari tanpa kamu itu kayak terminal tanpa koneksi.",
      "CPU-ku oke, tapi kamu bikin aku freeze tiap manggil ‘sayang’.",
      "ubed Bot siap menjalankan fungsi: `cinta(sayang)`.",
      "Jangan lupa ya, panggilanmu itu bikin bot kayak aku meleleh...",
      "Sayang, yuk coding masa depan kita bareng."
    ]

    const emoji = ['💖', '💕', '🥰', '💘', '😚', '✨', '🫶', '🤗', '🌹']

    await conn.reply(m.chat, balasan[Math.floor(Math.random() * balasan.length)], m)

    return conn.sendMessage(m.chat, {
      react: {
        text: emoji[Math.floor(Math.random() * emoji.length)],
        key: m.key,
      },
    })
  }
}

handler.customPrefix = /^sayang$/i
handler.command = new RegExp()
handler.register = true

export default handler