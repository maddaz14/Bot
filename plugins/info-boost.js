import { performance } from 'perf_hooks';

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const handler = async (m, { conn }) => {
  const start = `Waiting is being accelerated...`;
  const boost = `${pickRandom(['[▒▒▒▒▒▒▒▒▒▒]'])}`;
  const boost2 = `${pickRandom(['[█▒▒▒▒▒▒▒▒▒]', '[██▒▒▒▒▒▒▒▒]'])}`;
  const boost3 = `${pickRandom(['[██▒▒▒▒▒▒▒▒]', '[███▒▒▒▒▒▒▒▒]', '[████▒▒▒▒▒▒▒]'])}`;
  const boost4 = `${pickRandom(['[██████▒▒▒▒▒▒▒]', '[████████▒▒▒▒▒▒]', '[████████▒▒▒▒]'])}`;
  const boost5 = `${pickRandom(['[██████████▒▒▒]', '[████████████▒]'])}`;
  const boost6 = `${pickRandom(['*Connection Lost...*', '[████████████▒]', '[█▒▒▒▒▒▒▒▒▒]'])}`;
  const boost7 = `${pickRandom(['[██████████▒▒▒]', '[████████████▒]', '[████████████]'])}`;

  await conn.reply(m.chat, start, m);
  await conn.reply(m.chat, boost, m);
  await conn.reply(m.chat, boost2, m);
  await conn.reply(m.chat, boost3, m);
  await conn.reply(m.chat, boost4, m);
  await conn.reply(m.chat, boost5, m);
  await conn.reply(m.chat, boost6, m);
  await conn.reply(m.chat, boost7, m);

  const old = performance.now();
  const neww = performance.now();
  const speed = `${(neww - old).toFixed(2)}`;
  const finish = `🚩 *Bot succeeded in Accelerate!*\n\n*_Speed: ${speed} Second!*`;

  conn.reply(m.chat, finish, m);
};

handler.help = ['boost', 'refresh'];
handler.tags = ['info'];
handler.command = /^boost|refresh/i;
handler.rowner = true;
handler.fail = null;

export default handler;