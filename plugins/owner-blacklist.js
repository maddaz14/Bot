import fs from 'fs';
import path from 'path';

const blacklistFile = path.join(process.cwd(), 'src', 'blacklist.json');

const initBlacklist = () => {
  if (!fs.existsSync(blacklistFile)) {
    fs.writeFileSync(blacklistFile, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(blacklistFile, 'utf8'));
};

let handler = async (m, { conn, text }) => {
  let blacklist = initBlacklist();
  let [command, ...args] = text.split(' ');

  if (!command) {
    return conn.reply(m.chat, 'Pake *add @user/62838|<alasan>* buat nambah, *delete @user/62838* buat hapus, atau *list* buat cek, Senpai!', m);
  }

  command = command.toLowerCase();

  if (command === 'add') {
    let [target, reason] = args.join(' ').split('|');
    if (!target) {
      return conn.reply(m.chat, 'Format salah, Senpai! Contoh: *add @user|spam* atau *add 62838|spam*', m);
    }
    reason = reason ? reason.trim() : 'Nggak ada alasan';

    let user = target.startsWith('@') ? target.replace('@', '') + '@s.whatsapp.net' : target + '@s.whatsapp.net';
    blacklist[user] = reason;
    fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));
    conn.reply(m.chat, `User ${target} masuk blacklist karena: ${reason}, Senpai!`, m);

    let groups = Object.entries(await conn.chats)
      .filter(([id, chat]) => id.endsWith('@g.us') && chat.isChats)
      .map(([id]) => id);

    for (let id of groups) {
      let groupParticipants = (await conn.groupMetadata(id)).participants;
      if (groupParticipants.some(p => p.id === user)) {
        await conn.groupParticipantsUpdate(id, [user], 'remove');
        await conn.reply(id, `User ${target} otomatis di-kick karena blacklist\nAlasan: ${reason}`, m);
      }
    }
  } else if (command === 'delete') {
    let target = args.join(' ').trim();
    if (!target) {
      return conn.reply(m.chat, 'Format salah, Senpai! Contoh: *delete @user* atau *delete 62838*', m);
    }

    let user = target.startsWith('@') ? target.replace('@', '') + '@s.whatsapp.net' : target + '@s.whatsapp.net';
    if (!blacklist[user]) {
      return conn.reply(m.chat, `User ${target} nggak ada di blacklist, Senpai!`, m);
    }

    delete blacklist[user];
    fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));
    conn.reply(m.chat, `User ${target} udah lelet jalannya dari blacklist, Senpai!`, m);
  } else if (command === 'list') {
    let list = Object.entries(blacklist).map(([id, reason], i) => `${i + 1}. @${id.split('@')[0]} - ${reason}`).join('\n');
    conn.reply(m.chat, list ? `Daftar Blacklist, Senpai:\n${list}` : 'Blacklist kosong, Senpai! Kayak dompetku nih, haha!', m);
  } else {
    return conn.reply(m.chat, 'Command salah, Senpai! Cuma ada *add*, *delete*, sama *list* doang. Jangan bikin Alicia bingung ya!', m);
  }
};

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return;
  let blacklist = initBlacklist();
  let user = m.sender;

  if (blacklist[user]) {
    let groupMetadata = await conn.groupMetadata(m.chat);
    if (groupMetadata.participants.some(p => p.id === user)) {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      await conn.reply(m.chat, `User @${user.split('@')[0]} di-kick karena blacklist\nAlasan: ${blacklist[user]}`, m);
    }
  }
};

handler.onGroupUpdate = async (m, { conn, participants, action }) => {
  if (action !== 'add') return;
  let blacklist = initBlacklist();

  for (let user of participants) {
    if (blacklist[user]) {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      await conn.reply(m.chat, `User @${user.split('@')[0]} otomatis di-kick karena blacklist\nAlasan: ${blacklist[user]}`, m);
    }
  }
};

handler.help = ['blacklist'];
handler.tags = ['owner'];
handler.command = /^blacklist$/i;
handler.owner = true;
handler.group = true;

export default handler;