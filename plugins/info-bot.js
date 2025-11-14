import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, generateWAMessageFromContent }) => {
    const { jid } = conn.user;
    const { settings, users, chats, stats } = global.db.data;

    let { anon, anticall, antispam, antitroli, backup, jadibot, groupOnly, nsfw, statusupdate, autogetmsg, antivirus, publicjoin } = settings[jid];

    const allChats = await conn.chats;
    const allGroups = await conn.groupFetchAllParticipating();
    const blocklist = await conn.fetchBlocklist();

    const totalChats = Object.keys(allChats).length;
    const totalGroups = Object.keys(allGroups).length;
    const totalBlocked = blocklist ? blocklist.length : 0;
    const bannedChats = Object.entries(chats).filter(chat => chat[1].isBanned).length;
    const bannedUsers = Object.entries(users).filter(user => user[1].banned).length;
    const usedFeatures = Object.entries(stats).length;

    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);

    let statusMessage = `┌────〔 Status 〕───⬣
│☘️  Aktif selama ${uptime}
│☘️  ${totalGroups} Grup
│☘️  ${totalChats - totalGroups} Chat Pribadi
│☘️  ${Object.keys(users).length} Pengguna
│☘️  ${totalBlocked} Diblokir
│☘️  ${bannedChats} Chat Terbanned
│☘️  ${bannedUsers} Pengguna Terbanned
│☘️  ${usedFeatures} Fitur Sering Digunakan
╰────────────⬣

© ubed Bot 2025`;

    await conn.reply(m.chat, statusMessage, floc);
};

handler.help = ['botstatus'];
handler.tags = ['info'];
handler.command = /^botstatus|bs$/i;

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}