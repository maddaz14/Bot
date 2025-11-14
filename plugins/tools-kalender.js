import fetch from 'node-fetch';
let handler = async (m, { conn, args }) => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  
  let clockString = `Tanggal: ${day}
Bulan: ${month}
Tahun: ${year} 
Waktu: ${hour}:${minute}:${second}`;
  
  // Mengirimkan hasil ke grup atau pengguna
  conn.reply(m.chat, clockString, m);
}

handler.help = ['kalender'];
handler.tags = ['tools'];
handler.command = /^(clock|kalender)$/i;

export default handler