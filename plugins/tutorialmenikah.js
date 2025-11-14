let handler = async (m, { conn }) => {
    let caption = `
┏━━━〔 💍 *TUTORIAL MENIKAH* 💍 〕━━━┓

📝 *Syarat Menikah*  
❏ 💰 Uang minimal: *Rp 100 Juta*  
❏ 📢 Kirim *undangan pernikahan* ke *3 orang*  

💑 *Setelah Menikah*  
❏ 🏠 Bisa membeli rumah (*Rp 100 Juta*)  
❏ 🏡 Bisa sewa kontrakan (*Rp 500K/hari*)  
❏ 👶 Bisa *adopsi* atau *rekrut anak*  
❏ 💼 Bisa *bekerja bersama* dan *kumpulkan uang*  
❏ 🛑 Jika tak bayar kontrakan → *Diusir!* (*10% peluang cerai*)  

💔 *Jika Cerai*  
❏ ⏳ Cooldown menikah lagi: *2 Hari*  
❏ 💸 Harta dibagi rata  
❏ 👦 Anak ikut salah satu orang tua (*acak*)  

🎉 *Event Spesial*  
❏ 🎊 *Anniversary:* Hadiah setelah 30 hari menikah  
❏ 🎁 *Hadiah Pernikahan:* Teman bisa memberi hadiah  
❏ 💔 *Peluang Selingkuh:* Jika pasangan jarang aktif  

📜 *Perintah Fitur:*  
❏ 💍 \`.menikah @user\` → Melamar  
❏ ✅ \`.terima @user\` → Terima lamaran  
❏ ✉️ \`.undangan @user1 @user2 @user3\` → Kirim undangan  
❏ 💔 \`.cerai @user\` → Minta cerai  
❏ 🏡 \`.rumah beli\` → Beli rumah  
❏ 🏠 \`.rumah sewa\` → Sewa kontrakan  
❏ 💵 \`.bayarkontrakan\` → Bayar kontrakan  
❏ 👶 \`.adopsi @user\` → Adopsi anak  
❏ 👨‍👩‍👧 \`.keluarga\` → Cek status keluarga  
❏ 🏦 \`.bankfamily\` → Cek saldo bank keluarga  
❏ 💳 \`.tarikfamily [jumlah]\` → Tarik uang (maks 50%)  
❏ 💰 \`.setor [jumlah]\` → Setor uang ke bank keluarga  

┗━━━━━━━━━━━━━━━━━━━┛
`;

    let image = 'https://files.catbox.moe/mvr6t8.jpg'; // Gambar tutorial menikah

    await conn.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m });
};

handler.help = ['tutorialmenikah'];
handler.tags = ['rpg'];
handler.command = /^(tutorialmenikah|caramenikah|nikahhelp)$/i;

export default handler;