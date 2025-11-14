import fetch from 'node-fetch';

let maxAttempts = 10;
let timeout = 180000;

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.tebakangka = conn.tebakangka || {};
    let id = m.chat;

    try {
        if (command === 'tebakangka') {
            if (text.trim().toLowerCase() === 'menyerah') {
                if (!(id in conn.tebakangka)) {
                    conn.reply(m.chat, 'Tidak ada permainan tebak angka yang aktif.', m);
                    return;
                }

                let [msg, num, attempts, timeoutID] = conn.tebakangka[id];
                conn.reply(m.chat, `😔 Kamu menyerah! Angka yang benar adalah *${num}*`, msg);
                clearTimeout(timeoutID);
                delete conn.tebakangka[id];
                return;
            }

            if (id in conn.tebakangka) {
                conn.reply(m.chat, 'Masih ada permainan yang belum selesai!', conn.tebakangka[id][0]);
                return;
            }

            let randomNumber = Math.floor(Math.random() * 100) + 1;
            let caption = `
🎮 Saya sudah memikirkan sebuah angka antara 1 dan 100.
Coba tebak angkanya!

🎯 Kamu memiliki ${maxAttempts} kesempatan untuk menebak.
🕑 Timeout: ${(timeout / 1000).toFixed(2)} detik
📝 Untuk menebak contoh: \`.20\`
📝 Ketik ${usedPrefix}tebakangka menyerah untuk menyerah
`.trim();

            conn.tebakangka[id] = [
                await conn.reply(m.chat, caption, m),
                randomNumber,
                0, // inisialisasi attempts ke 0
                setTimeout(() => {
                    if (conn.tebakangka[id]) {
                        conn.reply(m.chat, `⏳ Waktu habis! Angka yang benar adalah *${randomNumber}*`, conn.tebakangka[id][0]);
                        delete conn.tebakangka[id];
                    }
                }, timeout)
            ];
        } else if (command === 'menyerah' && text.trim().toLowerCase() === 'tebakangka') {
            if (!(id in conn.tebakangka)) {
                conn.reply(m.chat, 'Tidak ada permainan tebak angka yang aktif.', m);
                return;
            }

            let [msg, num, attempts, timeoutID] = conn.tebakangka[id];
            conn.reply(m.chat, `😔 Kamu menyerah! Angka yang benar adalah *${num}*`, msg);
            clearTimeout(timeoutID);
            delete conn.tebakangka[id];
        } else {
            if (!(id in conn.tebakangka)) return; // Abaikan pesan jika tidak ada game yang aktif

            let guess = parseInt(command); // Anggap command adalah angka yang ditebak
            if (isNaN(guess)) return; // Abaikan jika bukan angka yang valid

            let [message, correctNumber, attempts, timeoutId] = conn.tebakangka[id];
            attempts++;
            conn.tebakangka[id][2] = attempts;
            let remainingAttempts = maxAttempts - attempts;

            if (guess === correctNumber) {
                let earnedExp = Math.floor(Math.random() * 50000) + 1;
                global.db.data.users[m.sender].limit += 2; // Tambah 2 limit
                conn.reply(m.chat, `🎉 Selamat! Kamu telah menebak angka yang benar yaitu *${correctNumber}*!\n\n💰 Kamu mendapatkan *${earnedExp}* XP!\n🎁 Dan +2 Limit!`, message);
                clearTimeout(timeoutId);
                delete conn.tebakangka[id];
            } else if (attempts >= maxAttempts) {
                conn.reply(m.chat, `Kamu sudah menggunakan semua kesempatan! Angka yang benar adalah *${correctNumber}*`, message);
                clearTimeout(timeoutId);
                delete conn.tebakangka[id];
            } else {
                let hint = Math.abs(guess - correctNumber) <= 2 ? 'Dikit lagi! 🎯' : guess > correctNumber ? 'Terlalu tinggi! 📉' : 'Terlalu rendah! 📈';
                conn.reply(m.chat, `${hint}\nSisa kesempatan: ${remainingAttempts}`, message);
            }
        }
    } catch (e) {
        conn.reply(m.chat, 'Terjadi kesalahan, coba lagi nanti.', m);
        console.error(e);
    }
};

handler.help = ['tebakangka'];
handler.tags = ['game'];
handler.command = /^(tebakangka|menyerah|\d+)$/i;

export default handler;