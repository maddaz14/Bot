import axios from 'axios';

let timeout = 60000; // Waktu tunggu 60 detik
let poin = 4999; // Poin yang diberikan setelah menjawab dengan benar

let handler = async (m, { conn, usedPrefix, command }) => {
  conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {}; // Menyimpan status soal yang belum dijawab

  let id = m.chat;
  if (id in conn.tebakkalimat) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0]);
    throw false; // Jika ada soal belum dijawab, tampilkan pesan dan hentikan eksekusi
  }

  try {
    // Mengambil soal dan jawaban dari API
    const apiUrl = `https://api.ubed.my.id/games/Tebak-kalimat?apikey=${global.ubed}`;
    const response = await axios.get(apiUrl);

    // Menampilkan respons API untuk debugging
    console.log('Respons API:', response.data);

    // Menangani respons API jika statusnya true
    if (response.data.status === true) {
      const soal = response.data.data.soal;
      const jawaban = response.data.data.jawaban.toLowerCase(); // Menyimpan jawaban dalam huruf kecil

      // Mengirimkan soal ke pengguna dan menyimpan ID soal
      let caption = `
        ${soal}
        Timeout *${(timeout / 1000).toFixed(2)} detik*
        Ketik ${usedPrefix}teka untuk bantuan
        Bonus: ${poin} XP
      `.trim();

      // Menyimpan soal dan jawaban
      conn.tebakkalimat[id] = [
        await conn.reply(m.chat, caption, m),
        { soal, jawaban }, // Menyimpan soal dan jawaban untuk verifikasi
        poin
      ];

      // Event listener untuk menangani jawaban pengguna
      const messageListener = async (msg) => {
        if (msg.key.remoteJid === m.chat && msg.text) {
          const userAnswer = msg.text.toLowerCase(); // Ambil jawaban pengguna dan ubah menjadi huruf kecil
          const correctAnswer = conn.tebakkalimat[id][1].jawaban;

          // Verifikasi jawaban pengguna
          if (userAnswer === correctAnswer) {
            await conn.sendMessage(m.chat, { text: '✅ Jawaban Anda benar! Terima kasih telah bermain.' });
            await conn.sendMessage(m.chat, { react: { text: '🎉', key: m.key } });
            delete conn.tebakkalimat[id]; // Menghapus soal setelah dijawab dengan benar
            conn.removeListener('message', messageListener); // Menghapus event listener setelah jawaban diberikan
          } else {
            await conn.sendMessage(m.chat, { text: `❌ Jawaban Anda salah. Jawaban yang benar adalah: *${correctAnswer}*` });
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            delete conn.tebakkalimat[id]; // Menghapus soal setelah dijawab dengan salah
            conn.removeListener('message', messageListener); // Menghapus event listener setelah jawaban diberikan
          }
        }
      };

      // Menambahkan event listener untuk menangani jawaban pengguna
      conn.on('message', messageListener);

      // Timeout untuk soal
      setTimeout(() => {
        if (conn.tebakkalimat[id]) {
          conn.reply(m.chat, `Waktu habis! Jawabannya adalah *${jawaban}*`, conn.tebakkalimat[id][0]);
          delete conn.tebakkalimat[id]; // Menghapus soal setelah waktu habis
          conn.removeListener('message', messageListener); // Menghapus event listener jika waktu habis
        }
      }, timeout);

    } else {
      // Jika API gagal, jangan tampilkan error ke pengguna
      console.log('Error API: Data tidak valid');
    }
  } catch (error) {
    // Pastikan soal tetap aktif meskipun terjadi kesalahan di console log
    console.log('Terjadi kesalahan saat mengakses API:', error);
    // Tidak ada tindakan lebih lanjut, soal tetap muncul dan berlanjut.
  }
};

handler.command = ['tebakkalimat'];
handler.help = ['tebakkalimat'];
handler.tags = ['game'];
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler;