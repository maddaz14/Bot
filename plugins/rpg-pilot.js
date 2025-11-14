// Daftar cerita untuk setiap kategori
const takeoffStories = [
    'Pesawat lepas landas dengan mulus meski cuaca sedikit mendung.',
    'Pilot berhasil mengangkat pesawat dengan lancar meskipun angin cukup kencang.',
    'Saat lepas landas, penumpang terlihat cemas, namun pesawat terbang stabil.',
    'Penerbangan dimulai dengan mulus, dengan pemandangan kota yang indah terlihat dari jendela.',
    'Pesawat melaju dengan cepat dan terbang menjauhi bandara dengan mulus.',
    'Meskipun ada sedikit turbulensi, pesawat berhasil lepas landas dengan aman.',
    'Pesawat terbang tinggi, meninggalkan awan tebal di belakangnya.',
    'Saat lepas landas, pesawat hampir tidak terasa, penumpang merasa nyaman.',
    'Pilot dengan ahli memulai penerbangan, menanjak dengan mulus.',
    'Penumpang memberikan tepuk tangan kecil setelah lepas landas dengan mulus.'
];

const flyingStories = [
    'Pesawat melintasi beberapa awan besar yang menciptakan sedikit turbulensi.',
    'Langit cerah, dan penumpang mulai menikmati pemandangan dari jendela.',
    'Penumpang merasa nyaman selama penerbangan meskipun ada sedikit getaran.',
    'Pesawat terbang tinggi melewati daerah perbukitan, pemandangan sangat indah.',
    'Pilot terus mengawasi instrumen, memastikan penerbangan tetap stabil.',
    'Beberapa penumpang terlelap, menikmati perjalanan udara yang tenang.',
    'Pesawat melaju dengan kecepatan tinggi, menembus awan yang tampak seperti kapas.',
    'Pilot memberi informasi tentang jalur penerbangan dan cuaca di luar.',
    'Penumpang mulai melihat laut dari jendela, menandakan bahwa mereka sedang berada di atas samudra.',
    'Beberapa penumpang berbincang-bincang santai, menikmati perjalanan.'
];

const disasterStories = [
    'Turbulensi mendadak membuat beberapa penumpang merasa cemas, tetapi pilot tetap tenang.',
    'Cuaca buruk tiba-tiba muncul, memaksa pilot untuk mengubah jalur penerbangan.',
    'Pesawat melewati area badai, dan guncangan cukup terasa di kabin.',
    'Beberapa penumpang terlihat khawatir setelah mendengar suara gemuruh di luar pesawat.',
    'Badai petir membuat pesawat bergoyang cukup keras, namun pilot mengendalikan situasi dengan baik.'
];

const landingStories = [
    'Pesawat mulai menurunkan ketinggiannya dan penumpang mulai bersiap untuk mendarat.',
    'Saat mendekati bandara, pemandangan kota mulai terlihat jelas dari jendela.',
    'Pilot mempersiapkan pendaratan dengan hati-hati, menyesuaikan kecepatan dan ketinggian.',
    'Pesawat mendarat dengan mulus, meskipun ada sedikit angin yang mengganggu.',
    'Penumpang di kabin merasakan penurunan yang halus, menandakan bahwa pesawat hampir mendarat.',
    'Pendaratan mulus, meskipun ada sedikit turbulensi dekat landasan pacu.',
    'Pesawat menyentuh landasan dengan lembut, dan semua penumpang merasa lega.',
    'Pendaratan sukses, penumpang memberikan tepuk tangan meriah untuk pilot.',
    'Pesawat akhirnya berhenti dengan sempurna di landasan pacu.',
    'Pilot berhasil mendarat meskipun ada sedikit cuaca buruk, semua penumpang merasa aman.'
];

// Fungsi untuk memilih cerita acak
function getRandomStory(storyArray) {
    return storyArray[Math.floor(Math.random() * storyArray.length)];
}

// Fungsi untuk menentukan hadiah atau kompensasi
function getReward(success, disaster) {
    if (success) {
        return Math.floor(Math.random() * (5000000 - 100000 + 1)) + 100000; // Hadiah antara 100000 - 5000000
    } else if (disaster) {
        return Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000; // Kompensasi antara 50000 - 2000000
    } else {
        return 0; // Tidak ada hadiah jika gagal karena human error
    }
}

// Handler untuk perintah .pilot, .penumpang, .takeoff dengan cooldown dan reset penumpang
let handler = async (m, { conn, text }) => {
    let sender = m.sender;
    let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : text;

    // Cek apakah pengguna yang ditandai sebagai penumpang ada
    if (!target && m.text.startsWith('.penumpang')) {
        return m.reply('Silakan tag pengguna yang akan menjadi penumpang!');
    }

    // Jika perintah .pilot digunakan, set user sebagai pilot
    if (m.text.startsWith('.pilot')) {
        // Menyimpan data pilot dalam database (misalnya global.db.data.pilot)
        global.db.data.pilot = sender; // Menyimpan sender sebagai pilot
        global.db.data.cooldown = 0; // Reset cooldown saat pilot ditugaskan
        return m.reply(`Anda telah menjadi pilot! 🛫`);
    }

    // Jika perintah .penumpang digunakan, set pengguna sebagai penumpang
    if (m.text.startsWith('.penumpang')) {
        // Memastikan pilot sudah ada
        if (!global.db.data.pilot) {
            return m.reply('Belum ada pilot yang ditugaskan. Gunakan perintah .pilot terlebih dahulu.');
        }

        // Set penumpang dan kirim pesan
        global.db.data.penumpang = target;
        return m.reply(`Pengguna @${target.split('@')[0]} sekarang adalah penumpang dari pilot! ✈️`);
    }

    // Cek apakah cooldown sudah berlalu 5 menit untuk takeoff
    if (m.text.startsWith('.takeoff')) {
        if (!global.db.data.pilot) {
            return m.reply('Belum ada pilot yang ditugaskan. Gunakan perintah .pilot terlebih dahulu.');
        }
        if (!global.db.data.penumpang) {
            return m.reply('Belum ada penumpang yang ditandai. Gunakan perintah .penumpang terlebih dahulu.');
        }

        let now = Date.now();
        let cooldown = global.db.data.cooldown || 0;
        let timeLeft = cooldown - now;

        if (timeLeft > 0) {
            return m.reply(`Anda harus menunggu ${Math.ceil(timeLeft / 1000)} detik lagi sebelum bisa menggunakan perintah \`.takeoff\` lagi.`);
        }

        // Kirim pesan awal takeoff
        await m.reply(`
🛫 **Penerbangan Dimulai!** ✈️

Pilot: @${global.db.data.pilot.split('@')[0]}
Penumpang: @${global.db.data.penumpang.split('@')[0]}

🔔 **Cerita Penerbangan Dimulai**:
`);

        // Menampilkan 1 cerita takeoff dengan delay 1 detik
        setTimeout(() => {
            let story = getRandomStory(takeoffStories);
            m.reply(`${story}`);
        }, 1 * 1000);

        // Menampilkan cerita terbang
        setTimeout(() => {
            m.reply('✈️ **Terbang Tinggi**:');
            let story = getRandomStory(flyingStories);
            m.reply(`${story}`);
        }, 12 * 1000); // Setelah 12 detik

        // Menampilkan bencana jika ada
        setTimeout(() => {
            m.reply('⚠️ **Bencana** terjadi selama penerbangan:');
            let disasterStory = getRandomStory(disasterStories);
            m.reply(`${disasterStory}`);
        }, 24 * 1000); // Setelah 24 detik

        // Menampilkan cerita landing
        setTimeout(() => {
            m.reply('🏁 **Pendaratan Sukses**:');
            let landingStory = getRandomStory(landingStories);
            m.reply(`${landingStory}`);

            // Tentukan hasil penerbangan
            let success = Math.random() < 0.7; // 70% sukses
            let disaster = Math.random() < 0.3; // 30% ada bencana

            // Hitung hadiah atau kompensasi
            let reward = getReward(success, disaster);

            if (reward > 0) {
                m.reply(`Pendaratan berhasil! Anda mendapatkan hadiah: Rp ${reward.toLocaleString()}`);
            } else if (disaster) {
                m.reply(`Pendaratan gagal karena bencana! Anda mendapatkan kompensasi: Rp ${reward.toLocaleString()}`);
            } else {
                m.reply('Pendaratan gagal karena kesalahan manusia. Tidak ada hadiah.');
            }

            // Reset penumpang setelah penerbangan selesai
            global.db.data.penumpang = null;

            // Set cooldown 5 menit setelah penerbangan
            global.db.data.cooldown = now + 5 * 60 * 1000;
        }, 36 * 1000); // Setelah 36 detik
    }
};

handler.help = ['pilot', 'penumpang', 'takeoff'];
handler.tags = ['game'];
handler.command = /^(pilot|penumpang|takeoff)$/i;

export default handler;