// Handler untuk sistem RPG Demokrasi
let handler = async (m, { conn, text }) => {
    let sender = m.sender;

    // Inisialisasi data partai dan pemilu
    if (!global.db.data.parties) {
        global.db.data.parties = {};
    }

    if (!global.db.data.candidates) {
        global.db.data.candidates = {};
    }

    if (!global.db.data.electionStarted) {
        global.db.data.electionStarted = false;
    }

    if (!global.db.data.electionDate) {
        global.db.data.electionDate = null;
    }

    // Membuat partai politik baru (hanya 1 kali)
    if (m.text.startsWith('.buatpartai')) {
        let partyName = text.split(' ')[0];

        if (!partyName) {
            return m.reply('Silakan masukkan nama partai yang ingin Anda buat.');
        }

        // Jika partai sudah ada
        if (global.db.data.parties[partyName]) {
            return m.reply('Partai dengan nama ini sudah ada!');
        }

        // Cek apakah user sudah membuat partai sebelumnya
        if (Object.values(global.db.data.parties).some(p => p.leader === sender)) {
            return m.reply('Anda hanya dapat membuat satu partai.');
        }

        // Membuat partai baru
        global.db.data.parties[partyName] = {
            leader: sender,
            members: [sender],
            candidates: [],
            votes: 0,
            isDissolved: false
        };

        m.reply(`Partai '${partyName}' berhasil dibuat oleh Anda!`);
        return;
    }

    // Bergabung dengan partai politik
    if (m.text.startsWith('.gabungpartai')) {
        let partyName = text.split(' ')[0];

        if (!partyName) {
            return m.reply('Silakan masukkan nama partai yang ingin Anda ikuti.');
        }

        // Cek apakah partai ada
        if (!global.db.data.parties[partyName] || global.db.data.parties[partyName].isDissolved) {
            return m.reply('Partai ini tidak ada atau sudah dibubarkan!');
        }

        // Bergabung dengan partai
        if (global.db.data.parties[partyName].members.includes(sender)) {
            return m.reply('Anda sudah menjadi anggota partai ini.');
        }

        global.db.data.parties[partyName].members.push(sender);
        m.reply(`Anda berhasil bergabung dengan partai '${partyName}'!`);
        return;
    }

    // Daftar partai yang ada
    if (m.text.startsWith('.daftarpartai')) {
        let parties = Object.keys(global.db.data.parties);
        if (parties.length === 0) {
            return m.reply('Tidak ada partai yang tersedia.');
        }
        let message = 'Daftar Partai:\n';
        parties.forEach(party => {
            let partyData = global.db.data.parties[party];
            message += `- ${party} (Ketua: @${partyData.leader.split('@')[0]}) - Anggota: ${partyData.members.length}\n`;
        });
        m.reply(message);
        return;
    }

    // Membubarkan partai (hanya ketua)
    if (m.text.startsWith('.bubarkanpartai')) {
        let partyName = text.split(' ')[0];

        if (!partyName) {
            return m.reply('Silakan masukkan nama partai yang ingin dibubarkan.');
        }

        // Cek apakah partai ada dan apakah pengguna adalah ketua
        if (!global.db.data.parties[partyName]) {
            return m.reply('Partai ini tidak ada!');
        }
        if (global.db.data.parties[partyName].leader !== sender) {
            return m.reply('Hanya ketua partai yang dapat membubarkan partai.');
        }

        // Membubarkan partai
        global.db.data.parties[partyName].isDissolved = true;
        global.db.data.parties[partyName].members = [];
        global.db.data.parties[partyName].candidates = [];
        m.reply(`Partai '${partyName}' berhasil dibubarkan.`);
        return;
    }

// Mencalonkan anggota DPR untuk partai (mentag pengguna)
if (m.text.startsWith('.calondpr')) {
    // Mengambil partai dan target yang dicalonkan (user yang ditag)
    let partyName = text.split(' ')[0];  // Nama partai
    let mentionedUser = m.mentionedJid[0];  // Pengguna yang ditag

    if (!partyName || !mentionedUser) {
        return m.reply('Silakan masukkan nama partai dan tag pengguna yang ingin Anda ajukan sebagai calon.');
    }

    // Cek apakah partai ada
    if (!global.db.data.parties[partyName]) {
        return m.reply('Partai ini tidak ada!');
    }

    // Cek jika pengguna yang mengajukan adalah anggota partai
    if (!global.db.data.parties[partyName].members.includes(sender)) {
        return m.reply('Anda harus menjadi anggota partai untuk mencalonkan diri!');
    }

    // Pastikan daftar calon terinisialisasi
    if (!global.db.data.parties[partyName].candidates) {
        global.db.data.parties[partyName].candidates = [];  // Inisialisasi daftar calon jika belum ada
    }

    // Mencalonkan anggota DPR
    global.db.data.parties[partyName].candidates.push(mentionedUser);
    m.reply(`@${mentionedUser.split('@')[0]} telah dicalonkan oleh partai '${partyName}' untuk menjadi anggota DPR.`);
    return;
}

// Daftar nomor yang bisa menetapkan dan memulai pemilu
const authorizedAdmins = ['6285147777105@s.whatsapp.net', '6281399172380@s.whatsapp.net'];

// Memulai pemilu tanpa tanggal, hanya admin yang bisa melakukannya
if (m.text.startsWith('.mulaipemilu')) {
    if (!m.isGroup) return m.reply('Perintah ini hanya bisa digunakan di grup!');
    
    // Cek apakah pengirim adalah salah satu admin yang diotorisasi
    if (!authorizedAdmins.includes(sender)) {
        return m.reply('Hanya admin yang diotorisasi yang bisa memulai pemilu!');
    }

    let message = 'Pemilu DPR Dimulai!\n\nCalon DPR:\n';
    for (let party in global.db.data.parties) {
        // Pastikan daftar calon ada
        if (global.db.data.parties[party].candidates && global.db.data.parties[party].candidates.length > 0) {
            message += `Partai: ${party} - Calon: ${global.db.data.parties[party].candidates.join(', ')}\n`;
        } else {
            message += `Partai: ${party} - Tidak ada calon\n`;
        }
    }

    if (message === 'Pemilu DPR Dimulai!\n\nCalon DPR:\n') {
        return m.reply('Tidak ada calon DPR yang tersedia!');
    }

    m.reply(message);
    return;
}

// Menentukan tanggal pemilu (Hanya admin yang bisa)
if (m.text.startsWith('.tetapkanpemilu')) {
    if (!m.isGroup) return m.reply('Perintah ini hanya bisa digunakan di grup!');

    // Cek apakah pengirim adalah salah satu admin yang diotorisasi
    if (!authorizedAdmins.includes(sender)) {
        return m.reply('Hanya admin yang diotorisasi yang bisa menetapkan tanggal pemilu!');
    }

    let date = text.split(' ')[0];

    if (!date) {
        return m.reply('Silakan masukkan tanggal pemilu (format: YYYY-MM-DD).');
    }

    // Set tanggal pemilu
    global.db.data.electionDate = date;
    m.reply(`Tanggal pemilu telah ditentukan: ${date}`);
    return;
}

    // Pemilihan kandidat
    if (m.text.startsWith('.pilihcalon')) {
        let partyName = text.split(' ')[0];

        if (!partyName) {
            return m.reply('Silakan pilih partai yang ingin Anda pilih.');
        }

        if (!global.db.data.parties[partyName]) {
            return m.reply('Partai ini tidak ada!');
        }

        if (global.db.data.parties[partyName].candidates.length === 0) {
            return m.reply('Partai ini tidak memiliki calon untuk pemilu!');
        }

        // Pilih calon dari partai
        let chosenCandidate = global.db.data.parties[partyName].candidates[0]; // Ambil calon pertama (bisa disesuaikan)
        global.db.data.parties[partyName].votes = global.db.data.parties[partyName].votes + 1;
        m.reply(`Anda telah memilih calon ${chosenCandidate} dari partai '${partyName}'.`);
        return;
    }

    // Mengumumkan hasil pemilu
    if (m.text.startsWith('.umumpemilu')) {
        let winner = '';
        let maxVotes = 0;

        for (let party in global.db.data.parties) {
            if (global.db.data.parties[party].votes > maxVotes) {
                winner = party;
                maxVotes = global.db.data.parties[party].votes;
            }
        }

        if (winner) {
            m.reply(`Pemenang pemilu adalah partai '${winner}' dengan ${maxVotes} suara!`);
        } else {
            m.reply('Tidak ada partai yang menang.');
        }
        return;
    }
};

handler.help = ['buatpartai', 'gabungpartai', 'calondpr', 'bubarkanpartai', 'tetapkanpemilu', 'mulaipemilu', 'pilihcalon', 'umumpemilu', 'daftarpartai'];
handler.tags = ['game', 'rpg'];
handler.command = /^(buatpartai|gabungpartai|calondpr|bubarkanpartai|tetapkanpemilu|mulaipemilu|pilihcalon|umumpemilu|daftarpartai)$/i;

export default handler;