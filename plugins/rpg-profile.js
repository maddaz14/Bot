import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn }) => {
    global.db.data.users = global.db.data.users || {};

    const fkontak = {
        "key": {
            "participant": '0@s.whatsapp.net',
            "remoteJid": "0@s.whatsapp.net",
            "fromMe": false,
            "id": "Halo",
        },
        "message": {
            "conversation": `✨ Profil Pengguna ${global.namebot || 'Bot'} ✨`,
        }
    };

    let target;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else {
        target = m.sender;
    }

    if (!global.db.data.users[target]) {
        global.db.data.users[target] = {};
    }
    let user = global.db.data.users[target];

    // Pastikan properti user ada atau beri nilai default
    user.name = user.name || (await conn.getName(target)) || "Pengguna Cantik";
    user.umur = user.umur || "-";
    user.ttl = user.ttl || "-";
    user.foto = user.foto || null;
    user.jk = user.jk || "-";
    user.agama = user.agama || "-";
    user.hobi = user.hobi || "-";
    user.kota = user.kota || "-";
    user.negara = user.negara || "-";
    user.level = user.level || 1;
    user.money = user.money || 0;
    user.bank = user.bank || 0;
    user.exp = user.exp || 0;
    user.premium = user.premium || false;
    user.limit = user.limit || 10;
    user.pacar = user.pacar || "-";
    user.pernikahan = user.pernikahan || "Belum Menikah";
    user.jumlahAnak = user.jumlahAnak || 0;
    user.sahabat = user.sahabat || "-";
    user.channel = user.channel || "-";
    user.facebook = user.facebook || "-";
    user.instagram = user.instagram || "-";
    user.tiktok = user.tiktok || "-";
    
    // Tambahkan properti keluarga dan pastikan defaultnya
    user.pasangan = user.pasangan || null;
    user.anak = user.anak || [];

    let {
        name, umur, ttl, foto, jk, agama, hobi, kota, negara,
        level, money, bank, exp, premium, pacar, pernikahan,
        jumlahAnak, sahabat, channel, facebook, instagram, tiktok
    } = user;
    let limit = premium ? "♾️ Unlimited" : user.limit;

    let botName = global.namebot || "Bot Default";
    let mode = global.opts?.self ? "🔒 Self" : "🌍 Public";

    let uptimeSeconds = process.uptime();
    let hari = Math.floor(uptimeSeconds / (3600 * 24));
    uptimeSeconds %= (3600 * 24);
    let jam = Math.floor(uptimeSeconds / 3600);
    uptimeSeconds %= 3600;
    let menit = Math.floor(uptimeSeconds / 60);
    let detik = Math.floor(uptimeSeconds % 60);
    let uptimeText = `${hari} hari, ${jam} jam, ${menit} menit, ${detik} detik`;

    let d = new Date();
    let date = d.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    let time = d.toLocaleTimeString("id-ID");

    let thumbnailUrl;
    try {
        if (foto && foto.startsWith('http')) {
            thumbnailUrl = foto;
        } else {
            let ppUrl = await conn.profilePictureUrl(target, 'image').catch(() => null);
            thumbnailUrl = ppUrl || 'https://telegra.ph/file/ee60957d56941b8fdd221.jpg'; 
        }
    } catch (e) {
        console.error('Error fetching profile image, using fallback:', e);
        thumbnailUrl = 'https://telegra.ph/file/ee60957d56941b8fdd221.jpg'; 
    }

    // Dapatkan nama pasangan dari JID atau berikan status default
    let namaPasangan = "Belum Menikah";
    if (user.pasangan) {
        try {
            namaPasangan = await conn.getName(user.pasangan);
        } catch {
            namaPasangan = "Tidak Dikenal";
        }
    }

    // Format daftar nama anak
    let daftarAnak = user.anak.length > 0 ? user.anak.join(", ") : "Tidak Punya Anak";

    // --- Detail informasi profil untuk caption utama ---
    let mainCaption = `
✨ *PROFIL PENGGUNA* ✨
----------------------------------------
📝 *Nama:* ${name}
🎂 *Umur:* ${umur}
📅 *Tanggal Lahir:* ${ttl}
⚧️ *Jenis Kelamin:* ${jk}
🛐 *Agama:* ${agama}
🎨 *Hobi:* ${hobi}
🌆 *Kota:* ${kota}
🌍 *Negara:* ${negara}

----------------------------------------
⭐ *Level:* ${level}
🎯 *Limit:* ${limit}
💸 *Saldo:* Rp ${money.toLocaleString('id-ID')}
🏦 *Bank:* Rp ${bank.toLocaleString('id-ID')}
⚡ *Exp:* ${exp}
🎫 *Premium:* ${premium ? '✅ Ya' : '❌ Tidak'}

---
🏡 *STATUS KELUARGA* 🏡
----------------------------------------
💑 *Pasangan:* ${namaPasangan}
👶 *Anak:* ${daftarAnak}

----------------------------------------
📺 *Channel:* ${channel}
📱 *Facebook:* ${facebook}
📸 *Instagram:* ${instagram}
🎵 *TikTok:* ${tiktok}

✨ *INFO BOT & WAKTU* ✨
----------------------------------------
🤖 *Nama Bot:* ${botName}
🛠️ *Mode:* ${mode}
⏱️ *Uptime:* ${uptimeText}
🗓️ *Tanggal:* ${date}
⏰ *Waktu:* ${time} WIB

> © ${global.namebot || 'Bot'} 2025 🌷
    `.trim();
    // --- Akhir detail informasi profil untuk caption utama ---

    const profileOptions = [
        {
            header: '✏️ Edit Profilku',
            title: 'Ubah informasi pribadi Anda',
            description: 'Nama, umur, hobi, dll.',
            id: '.editprofile'
        },
        {
            header: '💰 Cek Saldo',
            title: 'Lihat jumlah uang Anda',
            description: 'Saldo uang dan bank',
            id: '.bank'
        },
        {
            header: '📈 Lihat Statistik',
            title: 'Lihat level, EXP, dan limit Anda',
            description: 'Progres dan batasan akun',
            id: '.inv'
        },
        {
            header: 'ℹ️ Info Bot',
            title: 'Informasi umum tentang bot',
            description: 'Uptime, mode, dll.',
            id: '.sc'
        }
    ];

    let interactiveButtons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: 'Pilih Opsi Profil',
                sections: [
                    {
                        title: 'Tindakan Profil',
                        highlight_label: 'Pilih Salah Satu',
                        rows: profileOptions
                    }
                ]
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '👤 Owner',
                url: 'https://wa.me/6285147777105',
                merchant_url: 'https://wa.me/6285147777105'
            })
        }
    ];

    await conn.sendMessage(m.chat, {
        react: { text: '👤', key: m.key }
    });

    await conn.sendMessage(m.chat, {
        product: {
            productImage: { url: thumbnailUrl },
            productId: '9999999999999999',
            title: `Profil ${name}`,
            description: `Level ${level} | Limit ${limit}`,
            currencyCode: 'IDR',
            priceAmount1000: '0',
            retailerId: 'user-profile',
            url: 'https://wa.me/' + target.split('@')[0],
            productImageCount: 1
        },
        businessOwnerJid: '6285147777105@s.whatsapp.net',
        caption: mainCaption,
        title: `Informasi Akun ${name}`,
        subtitle: `ID: ${target.split('@')[0]}`,
        footer: `> ${botName} | ${date}`,
        interactiveButtons: interactiveButtons,
        hasMediaAttachment: false
    }, { quoted: fkontak });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.command = ["profile", "me", "saya"];
handler.help = ["profile [@tag]", "me [@tag]", "saya [@tag]"];
handler.tags = ["main"];
handler.register = true;

export default handler;