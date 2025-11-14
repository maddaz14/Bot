const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `gajian ${global.namebot || 'Bot'} ✨`,
    }
};

let handler = async (m, { conn }) => {
  let LastClaim = global.db.data.users[m.sender].lastclaim;
  
  // Waktu cooldown 45 menit
  let cooldown = 2700000; 

  // Cek apakah cooldown sudah habis
  if (new Date - LastClaim > cooldown) {
    global.db.data.users[m.sender].money += 7000; // PERUBAHAN: eris diubah menjadi money
    global.db.data.users[m.sender].exp += 100;
    conn.reply(m.chat, 'Nih gaji lu +Rp7000', fkontak); // Ditambahkan fkontak
    global.db.data.users[m.sender].lastclaim = new Date * 1;
  } else {
    // Hitung waktu yang tersisa
    let timeLeft = cooldown - (new Date - LastClaim);
    let minutesLeft = Math.floor(timeLeft / 60000);
    let secondsLeft = Math.floor((timeLeft % 60000) / 1000);
    
    // Informasi kapan cooldown habis
    let message = `Lu udah ambil jatah hari ini.\n\nTunggu ${minutesLeft} Menit ${secondsLeft} Detik untuk ambil gaji lagi!`;

    // Informasi bahwa cooldown sudah habis
    if (minutesLeft <= 0 && secondsLeft <= 0) {
      message += `\n\nLu udah bisa ambil gaji lagi.`;
    }
    
    conn.reply(m.chat, message, fkontak); // Ditambahkan fkontak
  }
};

handler.help = ['gajian'];
handler.tags = ['rpg'];
handler.command = /^(gaji|gajian)$/i;
handler.owner = false;
handler.mods = false;
handler.group = true;
handler.private = false;
handler.register = true;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.exp = 0;

export default handler;

function JaM(ms) {
  let h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60;
  return [h].map(v => v.toString().padStart(2, 0)).join(':');
}

function MeNit(ms) {
  let m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60;
  return [m].map(v => v.toString().padStart(2, 0)).join(':');
}

function DeTik(ms) {
  let s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60;
  return [s].map(v => v.toString().padStart(2, 0)).join(':');
}