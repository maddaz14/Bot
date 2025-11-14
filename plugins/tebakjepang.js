import db from '../lib/database.js';

const vocabList = [
  { word: 'こんにちは', translation: 'Halo' },
  { word: 'ありがとう', translation: 'Terima kasih' },
  { word: 'さようなら', translation: 'Selamat tinggal' },
  { word: 'おはよう', translation: 'Selamat pagi' },
  { word: 'こんばんは', translation: 'Selamat malam' },
  { word: 'すみません', translation: 'Maaf' },
  { word: 'お疲れ様', translation: 'Terima kasih atas kerja kerasnya' },
  { word: 'はい', translation: 'Ya' },
  { word: 'いいえ', translation: 'Tidak' },
  { word: 'わかりました', translation: 'Saya mengerti' },
  { word: 'お願いします', translation: 'Tolong' },
  { word: 'どういたしまして', translation: 'Sama-sama' },
  { word: 'すごい', translation: 'Hebat' },
  { word: 'だめ', translation: 'Tidak boleh' },
  { word: 'お元気ですか', translation: 'Apa kabar?' },
  { word: '元気です', translation: 'Saya baik-baik saja' },
  { word: 'どうぞ', translation: 'Silakan' },
  { word: 'お休みなさい', translation: 'Selamat tidur' },
  { word: '行ってきます', translation: 'Saya pergi' },
  { word: '行ってらっしゃい', translation: 'Hati-hati di jalan' },
  { word: 'ただいま', translation: 'Saya kembali' },
  { word: 'お帰りなさい', translation: 'Selamat datang kembali' },
  { word: 'あの', translation: 'Permisi' },
  { word: 'いいですか', translation: 'Bolehkah saya?' },
  { word: 'すばらしい', translation: 'Luar biasa' },
  { word: '何', translation: 'Apa' },
  { word: 'どこ', translation: 'Di mana' },
  { word: 'いつ', translation: 'Kapan' },
  { word: 'どうして', translation: 'Mengapa' },
  { word: '誰', translation: 'Siapa' },
  { word: 'もしもし', translation: 'Halo (telepon)' },
  { word: 'すぐに', translation: 'Segera' },
  { word: '遅い', translation: 'Lambat' },
  { word: '早い', translation: 'Cepat' },
  { word: '今日', translation: 'Hari ini' },
  { word: '昨日', translation: 'Kemarin' },
  { word: '明日', translation: 'Besok' },
  { word: '時', translation: 'Jam' },
  { word: '日', translation: 'Hari' },
  { word: '月', translation: 'Bulan' },
  { word: '年', translation: 'Tahun' },
  { word: '好き', translation: 'Suka' },
  { word: '嫌い', translation: 'Tidak suka' },
  { word: '美味しい', translation: 'Enak' },
  { word: 'まずい', translation: 'Tidak enak' },
  { word: '楽しい', translation: 'Menyenangkan' },
  { word: 'つまらない', translation: 'Membosankan' },
  { word: '難しい', translation: 'Sulit' },
  { word: '簡単', translation: 'Mudah' },
  { word: '大きい', translation: 'Besar' },
  { word: '小さい', translation: 'Kecil' },
  { word: '新しい', translation: 'Baru' },
  { word: '古い', translation: 'Tua' },
  { word: '高い', translation: 'Mahal/Tinggi' },
  { word: '安い', translation: 'Murah' },
  { word: '重い', translation: 'Berat' },
  { word: '軽い', translation: 'Ringan' },
  { word: '長い', translation: 'Panjang' },
  { word: '短い', translation: 'Pendek' },
  { word: '広い', translation: 'Luas' },
  { word: '狭い', translation: 'Sempit' },
  { word: '遠い', translation: 'Jauh' },
  { word: '近い', translation: 'Dekat' },
  { word: '暗い', translation: 'Gelap' },
  { word: '明るい', translation: 'Terang' },
  { word: '元気', translation: 'Sehat' },
  { word: '病気', translation: 'Sakit' },
  { word: '風', translation: 'Angin' },
  { word: '雨', translation: 'Hujan' },
  { word: '雪', translation: 'Salju' },
  { word: '海', translation: 'Laut' },
  { word: '山', translation: 'Gunung' },
  { word: '川', translation: 'Sungai' },
  { word: '町', translation: 'Kota' },
  { word: '村', translation: 'Desa' },
  { word: '人', translation: 'Orang' },
  { word: '動物', translation: 'Hewan' },
  { word: '植物', translation: 'Tumbuhan' },
  { word: '車', translation: 'Mobil' },
  { word: '自転車', translation: 'Sepeda' },
  { word: '飛行機', translation: 'Pesawat' },
  { word: '電車', translation: 'Kereta' },
  { word: '船', translation: 'Kapal' },
  { word: '手紙', translation: 'Surat' },
  { word: '電話', translation: 'Telepon' },
  { word: '携帯電話', translation: 'Handphone' },
  { word: '財布', translation: 'Dompet' },
  { word: '時計', translation: 'Jam' },
  { word: '本', translation: 'Buku' },
  { word: 'ノート', translation: 'Buku catatan' },
  { word: 'ペン', translation: 'Pulpen' },
  { word: '鉛筆', translation: 'Pensil' },
  { word: '机', translation: 'Meja' },
  { word: '椅子', translation: 'Kursi' },
  { word: '窓', translation: 'Jendela' },
  { word: '扉', translation: 'Pintu' },
  { word: '家', translation: 'Rumah' },
  { word: '学校', translation: 'Sekolah' },
  { word: '先生', translation: 'Guru' },
  { word: '生徒', translation: 'Murid' },
  { word: '学生', translation: 'Mahasiswa' },
  { word: '勉強', translation: 'Belajar' },
  { word: '試験', translation: 'Ujian' },
  { word: '成績', translation: 'Nilai' },
  { word: '大学', translation: 'Universitas' },
  { word: '仕事', translation: 'Pekerjaan' },
  { word: '会社', translation: 'Perusahaan' },
  { word: '社長', translation: 'Presiden direktur' },
  { word: '部長', translation: 'Kepala divisi' },
  { word: '同僚', translation: 'Rekan kerja' },
  { word: '休み', translation: 'Libur' },
  { word: '給料', translation: 'Gaji' },
  { word: '会議', translation: 'Rapat' },
  { word: '店', translation: 'Toko' },
  { word: '店員', translation: 'Pegawai toko' },
  { word: '客', translation: 'Pelanggan' },
  { word: '買い物', translation: 'Belanja' },
  { word: '値段', translation: 'Harga' },
  { word: '安売り', translation: 'Diskon' },
  { word: '便利', translation: 'Praktis' },
  { word: '不便', translation: 'Tidak praktis' },
  { word: '有名', translation: 'Terkenal' },
  { word: '静か', translation: 'Tenang' },
  { word: 'うるさい', translation: 'Bising' },
  { word: '親切', translation: 'Ramah' },
  { word: '意地悪', translation: 'Jahat' },
  { word: '面白い', translation: 'Menarik' },
  { word: '眠い', translation: 'Mengantuk' },
  { word: '疲れた', translation: 'Capek' },
  { word: '嬉しい', translation: 'Senang' },
  { word: '悲しい', translation: 'Sedih' },
  { word: '怖い', translation: 'Menakutkan' },
  { word: '安心', translation: 'Lega' },
  { word: '緊張', translation: 'Gugup' },
  { word: '幸せ', translation: 'Bahagia' },
  { word: '忙しい', translation: 'Sibuk' },
  { word: '暇', translation: 'Senggang' },
  { word: '楽', translation: 'Mudah, santai' },
  { word: '大丈夫', translation: 'Tidak apa-apa' },
  { word: '危ない', translation: 'Bahaya' },
  { word: '助けて', translation: 'Tolong aku' },
  { word: '警察', translation: 'Polisi' },
  { word: '病院', translation: 'Rumah sakit' },
  { word: '医者', translation: 'Dokter' },
  { word: '薬', translation: 'Obat' },
  { word: 'トイレ', translation: 'Toilet' },
  { word: '水', translation: 'Air' },
  { word: 'ご飯', translation: 'Nasi / Makanan' },
  { word: 'パン', translation: 'Roti' },
  { word: '肉', translation: 'Daging' },
  { word: '魚', translation: 'Ikan' },
  { word: '野菜', translation: 'Sayuran' },
  { word: '果物', translation: 'Buah-buahan' },
  { word: '甘い', translation: 'Manis' },
  { word: '辛い', translation: 'Pedas' },
  { word: '塩辛い', translation: 'Asin' },
  { word: '苦い', translation: 'Pahit' },
  { word: '酸っぱい', translation: 'Asam' }
];

const timeout = 60000;
const reward = { money: 200000, exp: 4999 };

const handler = async (m, { conn, usedPrefix, command }) => {
  conn.tebakkosakatajepang = conn.tebakkosakatajepang || {};
  const id = m.chat;

  if (id in conn.tebakkosakatajepang)
    return m.reply('Masih ada soal belum dijawab!');

  const vocab = vocabList[Math.floor(Math.random() * vocabList.length)];
  conn.tebakkosakatajepang[id] = {
    word: vocab.word,
    answer: vocab.translation.toLowerCase(),
    timeout: setTimeout(() => {
      m.reply(`⏰ Waktu habis!\nJawaban yang benar adalah: *${vocab.translation}*`);
      delete conn.tebakkosakatajepang[id];
    }, timeout),
  };

  m.reply(`**Tebak arti dari kata Jepang berikut:**\n> ${vocab.word}\n\nBalas dalam waktu 60 detik!`);
};

handler.before = async function (m, { conn }) {
  if (m.isBaileys || m.sender === conn.user.jid) return;
  conn.tebakkosakatajepang = conn.tebakkosakatajepang || {};
  const id = m.chat;

  if (!(id in conn.tebakkosakatajepang)) return;

  // Lanjutkan kode logika tebakan di sini...


  const game = conn.tebakkosakatajepang[id];
  const jawab = m.text.trim().toLowerCase();

  if (jawab === game.answer) {
    clearTimeout(game.timeout);
    delete conn.tebakkosakatajepang[id];
    // Hadiah
    db.data.users[m.sender].money += reward.money;
    db.data.users[m.sender].exp += reward.exp;

    m.reply(`✅ *Benar!*\n+${reward.money.toLocaleString()} money\n+${reward.exp} exp`);
  } else {
    m.reply(`❌ *Salah!* Coba lagi sebelum waktu habis.`);
  }
};

handler.help = ['tebakjepang'];
handler.tags = ['game'];
handler.command = /^tebakjepang$/i;

export default handler;