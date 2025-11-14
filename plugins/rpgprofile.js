import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, usedPrefix, command, participants }) => {
  let name = conn.getName(m.sender);
  let user = global.db.data.users[m.sender];
  let number = m.sender.split('@')[0];

  // Link gambar default yang valid
  let pp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  let flag = 'https://i.ibb.co/xStsJGn/indonesia.png';
  let badge = 'https://i.ibb.co/pb0pCN7/default-badge.png';

  // API URL dengan parameter otomatis
  let url = `https://api.autoresbot.com/api/maker/profile2?apikey=afce4ffb1a6e4c4bc5a6d035&name=${encodeURIComponent(name)}&level_cache=${user.level || 1}&nosender=${number}&role=${user.role || 'User'}&level=${user.level || 1}&money=${user.money || 0}&limit=${user.limit || 0}&roleInGrub=Member&flag=${flag}&badge=${badge}&pp=${pp}`;

  try {
    let res = await fetch(url);
    if (!res.ok) throw `Gagal mengambil gambar profil.`;

    let buffer = await res.buffer();
    await conn.sendMessage(m.chat, { image: buffer, caption: `Profile ${name}` }, { quoted: m });
    m.react('✅');
  } catch (e) {
    console.error(e);
    m.reply('Gagal mengambil data profil.');
    m.react('❌');
  }
};

handler.command = /^rpgprofile$/i;
export default handler;