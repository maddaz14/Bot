let handler = async (m, { conn }) => {
    const bratList = [
        "brat1 - Normal",
        "brat2 - Font lebih kecil",
        "brat3 - Teks hitam, BG hijau (bug)",
        "brat4 - Teks lebih ke tengah dan besar",
        "brat5 - Teks lebih ke tengah dan kecil",
        "brat6 - BG merah, teks putih",
        "brat7 - BG biru, teks putih",
        "brat8 - BG hijau, teks putih",
        "brat9 - BG ungu, teks putih",
        "brat10 - BG kuning, teks hitam",
        "brat11 - BG oranye, teks hitam",
        "brat12 - BG pink, teks hitam",
        "brat13 - BG coklat, teks putih",
        "brat14 - BG abu-abu, teks putih",
        "brat15 - BG cyan, teks hitam",
        "brat16 - BG indigo, teks putih",
        "brat17 - BG emas, teks hitam",
        "brat18 - BG hijau lemon, teks hitam",
        "brat19 - BG lavender, teks hitam",
        "brat20 - BG merah gelap, teks putih",
        "brat21 - BG biru baja, teks putih",
        "brat22 - BG coklat tua, teks putih",
        "brat23 - BG tomat, teks hitam",
        "brat24 - BG sea green, teks putih",
        "brat25 - BG merah bata, teks putih",
        "brat26 - BG merah, teks hitam",
        "brat27 - BG biru, teks hitam",
        "brat28 - BG hijau, teks putih",
        "brat29 - BG ungu, teks putih",
        "brat30 - BG kuning, teks hitam",
        "brat31 - BG hitam, teks putih",
        "brat32 - BG pelangi, teks hitam",
        "brat33 - BG putih, teks warna-warni",
        "brat34 - BG hitam, teks warna-warni",
        "brat35 - BG transparan, teks putih",
        "brat36 - BG transparan, teks hitam",
        "brat37 - BG transparan, teks merah",
        "brat38 - BG transparan, teks kuning",
        "brat39 - BG transparan, teks biru",
        "brat40 - BG transparan, teks warna-warni"
    ];

    let list = bratList.map((item, i) => `${i + 1}. ${item}`).join("\n");

    let message = `🖼️ *Daftar Stiker Brat:*\n\n${list}\n\n📝 *Gunakan perintah sesuai dengan format!*`;

    conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.command = /^listbrat$/i;
handler.help = ["listbrat"];
handler.tags = ["sticker"];

export default handler;