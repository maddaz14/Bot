// Dibuat oleh UBED - Nooriko Bot
// Plugin setprofile yang mendukung InteractiveButtons untuk bidang pilihan.

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
    // Pastikan pengguna memiliki data di database
    global.db.data.users = global.db.data.users || {};
    let user = global.db.data.users[m.sender];

    if (!user) {
        return conn.reply(m.chat, "Kamu belum terdaftar. Silakan daftarkan diri terlebih dahulu.", m);
    }

    // Memisahkan input menjadi bidang (field) dan nilai (value)
    const input = text.split(' ');
    const field = input[0]?.toLowerCase(); // Bidang yang ingin diedit (e.g., 'umur')
    const value = input.slice(1).join(' ').trim(); // Nilai baru (e.g., '25')

    // --- Definisi Bidang yang Memiliki Pilihan Interaktif (Buttons) ---
    const selectableFields = {
        'umur': {
            title: 'Pilih Umur Kamu',
            sections: [{
                title: 'Daftar Umur (13-30)',
                rows: Array.from({ length: 18 }, (_, i) => {
                    let umur = i + 13;
                    return {
                        header: `${umur} Tahun`,
                        title: `Umur ${umur}`,
                        description: `Pilih umur ${umur} tahun`,
                        id: `.setprofile umur ${umur}`
                    };
                })
            }]
        },
        'jk': {
            title: 'Pilih Jenis Kelamin',
            sections: [{
                title: 'Jenis Kelamin',
                rows: [
                    {
                        header: "Pria",
                        title: "Pria",
                        description: "Pilih Jenis Kelamin Pria",
                        id: ".setprofile jk Pria"
                    },
                    {
                        header: "Wanita",
                        title: "Wanita",
                        description: "Pilih Jenis Kelamin Wanita",
                        id: ".setprofile jk Wanita"
                    }
                ]
            }]
        },
        'agama': {
            title: 'Pilih Agama',
            sections: [{
                title: 'Agama',
                rows: [
                    { header: "Islam", title: "Islam", description: "Pilih Agama Islam", id: ".setprofile agama Islam" },
                    { header: "Kristen", title: "Kristen", description: "Pilih Agama Kristen", id: ".setprofile agama Kristen" },
                    { header: "Katolik", title: "Katolik", description: "Pilih Agama Katolik", id: ".setprofile agama Katolik" },
                    { header: "Hindu", title: "Hindu", description: "Pilih Agama Hindu", id: ".setprofile agama Hindu" },
                    { header: "Buddha", title: "Buddha", description: "Pilih Agama Buddha", id: ".setprofile agama Buddha" },
                    { header: "Konghucu", title: "Konghucu", description: "Pilih Agama Konghucu", id: ".setprofile agama Konghucu" }
                ]
            }]
        },
        'pernikahan': {
            title: 'Pilih Status Pernikahan',
            sections: [{
                title: 'Status',
                rows: [
                    { header: "Belum Menikah", title: "Belum Menikah", description: "Status: Belum Menikah", id: ".setprofile pernikahan Belum Menikah" },
                    { header: "Sudah Menikah", title: "Sudah Menikah", description: "Status: Sudah Menikah", id: ".setprofile pernikahan Sudah Menikah" },
                    { header: "Cerai", title: "Cerai", description: "Status: Cerai", id: ".setprofile pernikahan Cerai" }
                ]
            }]
        }
    };

    // Bidang yang memerlukan input teks bebas
    const textInputFields = [
        'nama', 'ttl', 'hobi', 'kota', 'negara', 
        'pacar', 'sahabat', 'channel', 'facebook', 'instagram', 'tiktok'
    ];

    // Gabungkan semua bidang yang diizinkan
    const allAllowedFields = [...Object.keys(selectableFields), ...textInputFields];

    // --- Logika Penanganan ---

    // 1. Jika pengguna hanya mengetik `.setprofile` tanpa bidang
    if (!field) {
        return conn.reply(m.chat, `*Format salah.* Gunakan perintah seperti ini:\n\n*${usedPrefix}${command} <bidang> <nilai>*\n\nContoh: *${usedPrefix}${command} hobi gaming*\n\nAtau gunakan *.editprofile* untuk menu utama.`, m);
    }
    
    // 2. Jika bidang dikenali, tetapi nilai belum ada (misal, datang dari menu .editprofile)
    if (allAllowedFields.includes(field) && !value) {
        
        // Jika bidang memiliki opsi interaktif, tampilkan menu buttons
        if (selectableFields[field]) {
            const menuData = selectableFields[field];

            // Mengirim pesan dengan InteractiveButtons
            await conn.sendMessage(m.chat, {
                text: `*Pilih opsi untuk bidang ${field.toUpperCase()}*`,
                title: `Atur ${field.toUpperCase()}`,
                footer: "> Nooriko Bot | Editor Profil",
                interactiveButtons: [
                    {
                        name: 'single_select',
                        buttonParamsJson: JSON.stringify({
                            title: menuData.title,
                            sections: menuData.sections
                        })
                    }
                ]
            }, { quoted: m });
            
            return; // Hentikan eksekusi setelah menampilkan menu
        }

        // Jika bidang adalah input teks, minta pengguna untuk mengetik nilai
        if (textInputFields.includes(field)) {
            return conn.reply(m.chat, `Mohon masukkan nilai baru untuk *${field}*.\n\nContoh: *${usedPrefix}${command} ${field} [nilai_baru]*`, m);
        }
        
        // Jika bidang tidak valid
        return conn.reply(m.chat, `Bidang '${field}' tidak valid.`, m);
    }

    // 3. Jika bidang dan nilai telah tersedia (baik dari teks input manual atau dari klik button)
    if (allAllowedFields.includes(field) && value) {
        
        // Validasi khusus untuk 'umur'
        if (field === 'umur') {
            const umurValue = parseInt(value, 10);
            // Pastikan nilai adalah angka dan dalam rentang 13-30 jika Umur yang diset
            if (isNaN(umurValue) || umurValue < 13 || umurValue > 30) {
                return conn.reply(m.chat, "Umur harus antara 13 sampai 30 tahun.", m);
            }
        }
        
        // Perbarui data pengguna
        user[field] = value;

        // Kirim konfirmasi
        let confirmationMessage = `✅ *Berhasil!* Profil kamu untuk bidang *${field}* telah diperbarui menjadi:\n\n*${value}*`;
        await conn.reply(m.chat, confirmationMessage, m);
        return;
    }
    
    // Default fallback untuk bidang yang tidak dikenal atau error
    return conn.reply(m.chat, `Bidang '${field}' tidak valid atau terjadi kesalahan.`, m);
};

handler.help = ['setprofile <bidang> <nilai>', 'setprofile <bidang>'];
handler.tags = ['main', 'rpg'];
handler.command = /^(setprofile|setprofil)$/i;
handler.register = true;

 module.exports = handler;