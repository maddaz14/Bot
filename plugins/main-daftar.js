import { createHash } from 'crypto';
import fetch from 'node-fetch'; // Sepertinya fetch tidak digunakan di kode ini, bisa dihapus jika memang tidak ada keperluan lain
import moment from 'moment-timezone';

// Objek fkontak untuk tampilan pesan yang dikutip (opsional, bisa dihapus jika tidak diperlukan)
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `✍️ Pendaftaran Pengguna ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async function (m, { conn, text, usedPrefix, command, participants }) { // Tambahkan 'participants'
    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function randomAge(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let d = new Date(new Date() + 3600000);
    let locale = 'id';
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let wibh = moment.tz('Asia/Jakarta').format('HH');
    let wibm = moment.tz('Asia/Jakarta').format('mm');
    let wibs = moment.tz('Asia/Jakarta').format('ss');
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`;

    let senderJid = m.sender; // JID awal, bisa berupa @s.whatsapp.net atau @lid

    // --- Penanganan JID @lid seperti di addowner.js ---
    if (senderJid.endsWith('@lid')) {
        let resolved = participants.find(u => u.id === senderJid || u.jid === senderJid);
        if (resolved?.jid?.endsWith('@s.whatsapp.net')) {
            senderJid = resolved.jid; // Ganti dengan JID yang sudah diresolusi
        } else {
            // Jika tidak bisa diresolusi, minta user untuk chat pribadi
            throw `🚫 Gagal mendapatkan nomor WhatsApp Anda yang asli. Mohon kirim pesan ke bot ini di chat pribadi terlebih dahulu agar pendaftaran bisa diproses.`;
        }
    }
    // --- Akhir penanganan @lid ---

    // Pastikan senderJid sudah dalam format @s.whatsapp.net setelah resolusi
    if (!senderJid || !senderJid.endsWith('@s.whatsapp.net')) {
        throw `⚠️ Gagal mendapatkan ID WhatsApp Anda. Silakan coba lagi.`;
    }

    let user = global.db.data.users[senderJid]; // Menggunakan JID yang sudah bersih sebagai kunci

    const pp = await conn.profilePictureUrl(senderJid, "image").catch((_) => global.foto || "https://telegra.ph/file/ee60957d56941b8fdd221.jpg"); // Menggunakan JID bersih untuk ambil PP

    if (user && user.registered === true) throw `Kamu sudah terdaftar!\nMau daftar ulang? *${usedPrefix}unreg <nomer sn>*`;
    if (!text) throw `Ketik yang benar!\nContoh: *${usedPrefix}daftar Ubed*\nContoh: *${usedPrefix}daftar Ubed.20*`;

    let [name, ageText] = text.split('.');
    if (!name) throw 'Nama tidak boleh kosong!';

    let age = parseInt(ageText);
    if (!age || age <= 0) age = randomAge(18, 50); // Usia default jika tidak dimasukkan atau tidak valid

    // Inisialisasi data user jika belum ada (penting saat menggunakan JID bersih sebagai kunci baru)
    if (!global.db.data.users[senderJid]) {
        global.db.data.users[senderJid] = {};
    }

    global.db.data.users[senderJid].name = name.trim();
    global.db.data.users[senderJid].age = age;
    global.db.data.users[senderJid].regTime = +new Date();
    global.db.data.users[senderJid].registered = true;
    let sn = createHash('md5').update(senderJid).digest('hex'); // SN berdasarkan JID yang bersih

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    // Menggunakan gambar profil pengguna sebagai gambar produk
    let thumbnailUrl = pp; 

    let caption = `
✨ *PENDAFTARAN BERHASIL!* ✨
----------------------------------------
📝 *Nama:* ${name}
🎂 *Umur:* ${age} tahun

----------------------------------------
✅ *Status:* Terdaftar
🔑 *Serial Number (SN):* ${sn}

----------------------------------------
> Jangan lupa baca *rules* di deskripsi bot ya!
> Data pengguna yang tersimpan di database bot dijamin aman dan tidak akan disebarluaskan.

✨ *INFO WAKTU* ✨
----------------------------------------
🗓️ *Tanggal:* ${week}, ${date}
⏰ *Waktu:* ${wktuwib} WIB

> © ${global.namebot || 'Bot'} 2025 🌷
    `.trim();

    // --- Definisikan opsi-opsi untuk daftar pilihan ---
    const registrationOptions = [
        {
            header: '🍏 Lihat Menu Bot',
            title: 'Jelajahi semua fitur yang tersedia',
            description: 'Akses daftar lengkap perintah bot.',
            id: '.menu'
        },
        {
            header: '📚 Baca Rules Bot',
            title: 'Pahami aturan penggunaan bot',
            description: 'Penting untuk kenyamanan bersama.',
            id: 'https://wa.me/message/YOUR_BOT_NUMBER_HERE' // Ini akan menjadi URL yang dibuka jika diklik
        },
        {
            header: '💬 Hubungi Owner',
            title: 'Ajukan pertanyaan atau laporkan masalah',
            description: 'Dapatkan bantuan dari pengembang bot.',
            id: '.owner' // Asumsi ada command .owner
        }
    ];

    // --- Susun interactiveButtons dengan single_select ---
    let interactiveButtons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: 'Langkah Selanjutnya', // Judul utama untuk daftar pilihan
                sections: [
                    {
                        title: 'Pilih Tindakan', // Judul bagian dalam daftar
                        highlight_label: 'Pilih Salah Satu',
                        rows: registrationOptions // Baris-baris pilihan yang sudah didefinisikan
                    }
                ]
            })
        }
    ];

    // --- Pastikan primaryOwnerJid juga menggunakan JID yang bersih jika diperlukan, atau pastikan formatnya sudah benar ---
    // Asumsi global.owner[0][0] sudah dalam format angka, jadi kita hanya tambahkan @s.whatsapp.net
    const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net'; 

    await conn.sendMessage(m.chat, {
        product: {
            productImage: { url: thumbnailUrl },
            productId: '9999999999999999', // ID produk dummy
            title: `Pendaftaran ${name}`,
            description: `Umur ${age} tahun | Status Terdaftar`,
            currencyCode: 'IDR',
            priceAmount1000: '0',
            retailerId: 'user-registration',
            url: 'https://wa.me/' + senderJid.split('@')[0], // Link ke WA user pakai JID bersih
            productImageCount: 1
        },
        businessOwnerJid: primaryOwnerJid, 
        caption: caption,
        title: `Selamat Datang, ${name}!`,
        subtitle: `ID: ${senderJid.split('@')[0]}`, // ID: tanpa @s.whatsapp.net
        footer: `> ${global.namebot || 'Bot'} | ${date}`,
        interactiveButtons: interactiveButtons,
        hasMediaAttachment: false
    }, { quoted: fkontak }); // Menggunakan fkontak untuk kutipan

};

handler.help = ['daftar <nama>.<umur>'];
handler.tags = ['main', 'users'];
handler.command = /^(daftar|verify|reg(ister)?)$/i;
handler.register = false; // Menandai bahwa ini adalah handler pendaftaran

export default handler;