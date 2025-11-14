// Dibuat oleh UBED - Nooriko Bot
// Plugin untuk mengedit profil pengguna menggunakan InteractiveButtons.

let handler = async (m, { conn, usedPrefix, command }) => {
    // Pastikan pengguna memiliki data di database (global.db.data.users)
    global.db.data.users = global.db.data.users || {};
    let user = global.db.data.users[m.sender];

    if (!user) {
        // Jika pengguna belum terdaftar, berikan pesan.
        return conn.reply(m.chat, "Kamu belum terdaftar. Silakan daftarkan diri terlebih dahulu.", m);
    }

    // --- Definisi Menu Interaktif (Sections dan Rows) ---
    const profileSections = [
        {
            title: "Informasi Pribadi",
            highlight_label: "Wajib diisi",
            rows: [
                {
                    header: "✏️ Nama Lengkap",
                    title: "Ubah Nama",
                    description: "Nama kamu di profil bot.",
                    id: ".setprofile nama" 
                },
                {
                    header: "🎂 Umur",
                    title: "Ubah Umur (13-30)",
                    description: "Memunculkan menu pilihan umur (pilih dari daftar).",
                    id: ".setprofile umur" // <--- Perubahan di sini
                },
                {
                    header: "📅 Tanggal Lahir (TTL)",
                    title: "Ubah TTL",
                    description: "Format: DD-MM-YYYY (contoh: 01-01-2000)",
                    id: ".setprofile ttl"
                },
                {
                    header: "⚧️ Jenis Kelamin (JK)",
                    title: "Ubah Jenis Kelamin",
                    description: "Pria/Wanita.",
                    id: ".setprofile jk"
                },
                {
                    header: "🛐 Agama",
                    title: "Ubah Agama",
                    description: "Agama yang kamu anut.",
                    id: ".setprofile agama"
                }
            ]
        },
        {
            title: "Minat & Lokasi",
            rows: [
                {
                    header: "🎨 Hobi",
                    title: "Ubah Hobi",
                    description: "Hobi atau minat kamu.",
                    id: ".setprofile hobi"
                },
                {
                    header: "🌆 Kota",
                    title: "Ubah Kota",
                    description: "Kota tempat tinggalmu.",
                    id: ".setprofile kota"
                },
                {
                    header: "🌍 Negara",
                    title: "Ubah Negara",
                    description: "Negara tempat tinggalmu.",
                    id: ".setprofile negara"
                }
            ]
        },
        {
            title: "Sosial & Hubungan",
            rows: [
                {
                    header: "💑 Pacar",
                    title: "Ubah Status Pacar",
                    description: "Nama pacar (jika ada).",
                    id: ".setprofile pacar"
                },
                {
                    header: "💍 Pernikahan",
                    title: "Ubah Status Pernikahan",
                    description: "Status pernikahanmu.",
                    id: ".setprofile pernikahan"
                },
                {
                    header: "👯‍♂️ Sahabat",
                    title: "Ubah Nama Sahabat",
                    description: "Nama sahabat terbaik kamu.",
                    id: ".setprofile sahabat"
                }
            ]
        },
        {
            title: "Tautan Media Sosial",
            rows: [
                {
                    header: "📺 Channel",
                    title: "Ubah Link Channel",
                    description: "Tautan ke channel kamu (YouTube/Telegram).",
                    id: ".setprofile channel"
                },
                {
                    header: "📱 Facebook",
                    title: "Ubah Link Facebook",
                    description: "Tautan profil Facebook.",
                    id: ".setprofile facebook"
                },
                {
                    header: "📸 Instagram",
                    title: "Ubah Link Instagram",
                    description: "Tautan profil Instagram.",
                    id: ".setprofile instagram"
                },
                {
                    header: "🎵 TikTok",
                    title: "Ubah Link TikTok",
                    description: "Tautan profil TikTok.",
                    id: ".setprofile tiktok"
                }
            ]
        }
    ];

    // Mengirim pesan dengan InteractiveButtons
    await conn.sendMessage(m.chat, {
        text: `*⚙️ EDITOR PROFIL ⚙️*\n\nSilakan pilih kategori informasi yang ingin kamu edit.`,
        title: "Pilih Opsi Edit",
        footer: "> Nooriko Bot | Editor Profil",
        interactiveButtons: [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Pilih Kategori',
                    sections: profileSections
                })
            }
        ]
    }, { quoted: m });
};

handler.help = ["editprofile"];
handler.tags = ["main", "rpg"];
handler.command = /^(editprofile|editprofil)$/i;
handler.register = true;

module.exports = handler;