const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `kerja ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn, command, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase();
    let users = global.db.data.users[m.sender];
    let time = users && users.lastkerja ? users.lastkerja + 300000 : 0; // Mengubah durasi istirahat menjadi 5 menit (300000 milidetik)

    let jobs = {
        dokter: {
            emoji: '⚕️',
            names: ['Dokter Praktek Pribadi', 'Dokter Umum', 'Dokter Gigi', 'Dokter Spesialis'],
            actions: ['Menyembuhkan', 'Mendiagnosis', 'Menangani', 'Membantu']
        },
        kuli: {
            emoji: '👷‍♂️',
            names: ['Tukang Bangunan', 'Tukang Las', 'Tukang Kebun', 'Tukang Cat'],
            actions: ['Membangun', 'Memperbaiki', 'Merawat', 'Melukis']
        },
        montir: {
            emoji: '🔧',
            names: ['Montir Motor', 'Montir Mobil', 'Montir Sepeda', 'Montir Listrik'],
            actions: ['Memperbaiki', 'Mengganti', 'Mengoprek', 'Mengatasi']
        },
        ojek: {
            emoji: '🛵',
            names: ['Ojek Online', 'Ojek Pangkalan', 'Ojek Langganan', 'Ojek Part Time'],
            actions: ['Mengantar', 'Membawa', 'Menjemput', 'Mengirim']
        },
        pedagang: {
            emoji: '🛒',
            names: ['Pedagang Pasar', 'Pedagang Kaki Lima', 'Pedagang Keliling', 'Pedagang Online'],
            actions: ['Menjual', 'Melayani', 'Memasarkan', 'Membeli']
        },
        petani: {
            emoji: '🌾',
            names: ['Petani Padi', 'Petani Sayur', 'Petani Buah', 'Petani Ternak'],
            actions: ['Menanam', 'Merawat', 'Memanen', 'Membajak']
        },
        penulis: {
            emoji: '✍️',
            names: ['Penulis Buku', 'Penulis Artikel', 'Penulis Konten', 'Penulis Skripsi'],
            actions: ['Menulis', 'Mengedit', 'Menerjemahkan', 'Mencari Ide']
        },
        guru: {
            emoji: '👩‍🏫',
            names: ['Guru SD', 'Guru SMP', 'Guru SMA', 'Dosen'],
            actions: ['Mengajar', 'Memberikan Tugas', 'Mengoreksi', 'Membimbing']
        },
        desainer: {
            emoji: '🎨',
            names: ['Desainer Grafis', 'Desainer Mode', 'Desainer Interior', 'Desainer Produk'],
            actions: ['Mendesain', 'Mengedit', 'Membuat Konsep', 'Melakukan Riset']
        },
        programmer: {
            emoji: '💻',
            names: ['Frontend Developer', 'Backend Developer', 'Full-stack Developer', 'Game Developer'],
            actions: ['Mendesain UI', 'Menulis Kode', 'Mengembangkan Fitur', 'Menguji']
        },
        musisi: {
            emoji: '🎵',
            names: ['Pemain Gitar', 'Penyanyi', 'Produser Musik', 'Komposer'],
            actions: ['Membuat Lagu', 'Rekaman', 'Menulis Lirik', 'Belajar Musik Baru']
        },
        polisi: {
            emoji: '👮‍♂️',
            names: ['Polisi Lalu Lintas', 'Detektif', 'Polisi Patroli', 'Polisi Kriminal'],
            actions: ['Menangkap', 'Menyelidiki', 'Mengawasi', 'Melindungi']
        },
        damkar: {
            emoji: '🚒',
            names: ['Pemadam Kebakaran', 'Petugas Rescue', 'Driver Damkar', 'Petugas Hydrant'],
            actions: ['Memadamkan', 'Menyelamatkan', 'Mengendalikan', 'Mengevakuasi']
        },
        nelayan: {
            emoji: '🐟',
            names: ['Nelayan Laut', 'Nelayan Sungai', 'Nelayan Danau', 'Nelayan Kolam'],
            actions: ['Menangkap', 'Memancing', 'Mengumpulkan', 'Menjaring']
        },
        penambang: {
            emoji: '⛏️',
            names: ['Penambang Emas', 'Penambang Batu Bara', 'Penambang Bijih Besi', 'Penambang Batu'],
            actions: ['Menggali', 'Menambang', 'Mengangkut', 'Memproses']
        },
        sopir: {
            emoji: '🚗',
            names: ['Sopir Taksi', 'Sopir Truk', 'Sopir Pribadi', 'Sopir Bus'],
            actions: ['Mengantar', 'Mengemudi', 'Menjemput', 'Mengirim']
        },
        aktorbokep: {
            emoji: '🎥',
            names: ['Aktor Bokep', 'Bintang Film Dewasa', 'Pemain Porno', 'Artis XXX'],
            actions: ['Berakting', 'Syuting', 'Bermain', 'Berperan']
        },
        hacker: {
            emoji: '💻',
            names: ['Hacker White Hat', 'Hacker Black Hat', 'Hacker Grey Hat', 'Pentester'],
            actions: ['Meretas', 'Menganalisis', 'Menjebol', 'Melindungi']
        },
        tentara: {
            emoji: '🎖️',
            names: ['Tentara Infanteri', 'Tentara Kavaleri', 'Tentara Artileri', 'Tentara Penerbangan'],
            actions: ['Berpatroli', 'Menyerang', 'Melindungi', 'Bertempur']
        },
        kameramen: {
            emoji: '📹',
            names: ['Kameramen TV', 'Kameramen Film', 'Kameramen Dokumenter', 'Kameramen Perkawinan'],
            actions: ['Merekam', 'Mengambil Gambar', 'Mengedit Video', 'Mengatur Pencahayaan']
        },
        pelayan: {
            emoji: '🍽️',
            names: ['Pelayan Restoran', 'Pelayan Cafe', 'Pelayan Bar', 'Pelayan Hotel'],
            actions: ['Melayani', 'Mengambil Pesanan', 'Membersihkan Meja', 'Menyajikan Makanan']
        },
        koki: {
            emoji: '👨🏻‍🍳',
            names: ['Koki Sushi', 'Koki Italia', 'Koki Prancis', 'Koki Pastry'],
            actions: ['Memasak', 'Mempersiapkan Bahan', 'Mengatur Menu', 'Menghias Hidangan']
        }
    };

    let reasons = {
        dokter: ['Kesalahan diagnosa', 'Pelayanan kurang memuaskan', 'Kehabisan stok obat', 'Gagal operasi'],
        kuli: ['Kerjaan tidak selesai', 'Kerjaan asal jadi', 'Tidak masuk kerja', 'Kerjaan tidak rapih'],
        montir: ['Suku cadang habis', 'Gagal memperbaiki', 'Kendaraan hilang', 'Bengkel kebanjiran'],
        ojek: ['Kendaraan rusak', 'Tertinggal pesanan', 'Sakit mendadak', 'Tidak bisa dihubungi'],
        pedagang: ['Stok habis', 'Ditipu pelanggan', 'Kehilangan uang dagang', 'Kehabisan tempat dagang'],
        petani: ['Tanaman mati', 'Hama serang tanaman', 'Bencana alam', 'Pasar turun'],
        penulis: ['Writer\'s block', 'Deadline terlewati', 'Naskah hilang', 'Ide karya habis'],
        guru: ['Tugas guru berat', 'Pelajaran tidak dimengerti', 'Siswa nakal', 'Kehabisan materi ajar'],
        desainer: ['Klien tidak puas', 'Desain ditolak', 'Kurangnya inspirasi', 'Waktu pengerjaan terlalu lama'],
        programmer: ['Bug yang sulit ditemukan', 'Kode bocor', 'Kesalahan fatal', 'Pengujian tidak memuaskan'],
        musisi: ['Karya tidak diakui', 'Inspirasi musik hilang', 'Kesulitan dalam rekaman', 'Alat musik rusak'],
        polisi: ['Kejahatan terlalu sulit', 'Kurangnya bukti', 'Tersangka kabur', 'Kondisi berbahaya'],
        damkar: ['Kebakaran besar', 'Kekurangan air', 'Peralatan rusak', 'Kondisi berbahaya'],
        nelayan: ['Cuaca buruk', 'Jaring rusak', 'Tidak ada ikan', 'Perahu bocor'],
        penambang: ['Longsor', 'Peralatan rusak', 'Kehabisan bahan bakar', 'Kecelakaan kerja'],
        sopir: ['Kendaraan rusak', 'Jalan macet', 'Penumpang tidak ada', 'Kehabisan bahan bakar'],
        aktorbokep: ['Cedera saat syuting', 'Skenario tidak bagus', 'Penonton tidak puas', 'Masalah teknis'],
        hacker: ['Sistem terlalu aman', 'Kesalahan kode', 'Dilacak pihak berwajib', 'Kehabisan alat'],
        tentara: ['Musuh terlalu kuat', 'Cuaca buruk', 'Kesalahan strategi', 'Amunisi habis'],
        kameramen: ['Peralatan rusak', 'Cuaca buruk', 'Lokasi tidak cocok', 'Kesalahan teknis'],
        pelayan: ['Pesanan salah', 'Pelanggan marah', 'Kehabisan bahan', 'Masalah di dapur'],
        koki: ['Bahan habis', 'Kesalahan resep', 'Pelanggan tidak puas', 'Masalah di dapur']
    };

    let coinRewards = {
        dokter: { min: 60000, max: 300000 },
        kuli: { min: 40000, max: 250000 },
        montir: { min: 45000, max: 150000 },
        ojek: { min: 50000, max: 120000 },
        pedagang: { min: 55000, max: 110000 },
        petani: { min: 48000, max: 960000 },
        penulis: { min: 42000, max: 840000 },
        guru: { min: 48000, max: 960000 },
        desainer: { min: 50000, max: 1000000 },
        programmer: { min: 55000, max: 1100000 },
        musisi: { min: 45000, max: 900000 },
        polisi: { min: 50000, max: 1000000 },
        damkar: { min: 50000, max: 1000000 },
        nelayan: { min: 45000, max: 900000 },
        penambang: { min: 60000, max: 1200000 },
        sopir: { min: 40000, max: 800000 },
        aktorbokep: { min: 70000, max: 1400000 },
        hacker: { min: 60000, max: 1200000 },
        tentara: { min: 50000, max: 1000000 },
        kameramen: { min: 40000, max: 800000 },
        pelayan: { min: 35000, max: 700000 },
        koki: { min: 45000, max: 900000 }
    };

    let job = jobs[type];
    if (!job) return conn.reply(m.chat, '*_Pilih salah satu pekerjaan yang tersedia!_*\n\n⚕️ Dokter\n👷‍♂️ Kuli\n🔧 Montir\n🛵 Ojek\n🛒 Pedagang\n🌾 Petani\n✍️ Penulis\n👩‍🏫 Guru\n🎨 Desainer\n💻 Programmer\n🎵 Musisi\n👮‍♂️ Polisi\n🚒 Damkar\n🐟 Nelayan\n⛏️ Penambang\n🚗 Sopir\n🎥 aktorbokep\n💻 Hacker\n🎖️ Tentara\n📹 Kameramen\n🍽️ Pelayan\n👨🏻‍🍳 Koki\n\n*_Contoh :   .kerja ojek_*', fkontak); // Menggunakan fkontak
    
    let randomName = pickRandom(job.names);
    let randomAction = pickRandom(job.actions);

    let reason = pickRandom(reasons[type]); // Variabel 'reason' dideklarasikan tapi tidak digunakan
    let coinReward = Math.floor(Math.random() * (coinRewards[type].max - coinRewards[type].min + 1)) + coinRewards[type].min;

    let timeLeft = time - Date.now();
    if (timeLeft > 0) {
        setTimeout(() => {
            conn.reply(m.chat, `Waktunya untuk kembali bekerja!`, fkontak); // Menggunakan fkontak
        }, timeLeft);
        return conn.reply(m.chat, `Kamu sudah bekerja, saatnya istirahat selama ${clockString(timeLeft)}`, fkontak); // Menggunakan fkontak
    } else {
        global.db.data.users[m.sender].money += coinReward; // PERUBAHAN: eris diubah menjadi money
        global.db.data.users[m.sender].lastkerja = Date.now();
        conn.reply(m.chat, `Kamu Baru Selesai ${randomAction} *${job.emoji} ${randomName}*\nDan Mendapatkan Uang Senilai *Rp.${coinReward.toLocaleString()}*`, fkontak); // Menggunakan fkontak
    }
};

handler.help = ['kerja'];
handler.tags = ['rpg'];
handler.command = /^kerja$/i;
handler.register = true;
handler.group = true;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24; // Ini adalah jam, bukan hari (d)
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24; // Ini duplikat dengan d
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}