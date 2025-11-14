const handler = async (m, { conn, args, command }) => {
  conn.balapmotor = conn.balapmotor || {};

  switch (command) {
    case 'balapmotor': {
      const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

      if (!mentioned.length) {
        return conn.reply(m.chat, 'Tag user yang ingin diajak balapan!', m);
      }

      conn.balapmotor[m.sender] = {
        challenger: m.sender,
        challenged: mentioned,
        status: 'pending'
      };

      const text = `🏍️ *BALAP MOTOR* 🏍️\n\n@${m.sender.split('@')[0]} menantang ${mentioned.map(jid => '@' + jid.split('@')[0]).join(', ')} untuk balapan!\n\nBalas dengan *gas* untuk menerima atau *emoh* untuk menolak.`;

      return conn.reply(m.chat, text, m, {
        contextInfo: { mentionedJid: [m.sender, ...mentioned] }
      });
    }

    case 'gas': {
      const session = Object.values(conn.balapmotor).find(
        s => s.challenged.includes(m.sender) && s.status === 'pending'
      );

      if (!session) {
        return conn.reply(m.chat, 'Tidak ada tantangan balapan untukmu.', m);
      }

      session.status = 'accepted';

      const participants = [session.challenger, ...session.challenged];
      const winner = participants[Math.floor(Math.random() * participants.length)];

      const prizeTypes = [
        { type: 'coins', amount: 293800 },
        { type: 'exp', amount: 5000 },
        { type: 'item', name: 'Aerok' }
      ];
      const prize = prizeTypes[Math.floor(Math.random() * prizeTypes.length)];

      const winnerUser = global.db.data.users[winner] || {};
      global.db.data.users[winner] = winnerUser;

      let prizeText = '';
      switch (prize.type) {
        case 'coins':
          winnerUser.money = (winnerUser.money || 0) + prize.amount;
          prizeText = `${prize.amount} coins!`;
          break;
        case 'exp':
          winnerUser.exp = (winnerUser.exp || 0) + prize.amount;
          prizeText = `${prize.amount} exp!`;
          break;
        case 'item':
          winnerUser.items = winnerUser.items || [];
          winnerUser.items.push(prize.name);
          prizeText = `${prize.name}!`;
          break;
      }

      const resultText = `🏍️ *BALAP MOTOR* 🏍️\n\n@${session.challenger.split('@')[0]} vs ${session.challenged.map(j => '@' + j.split('@')[0]).join(', ')}\n\n🚩 *Pemenang*: @${winner.split('@')[0]} 🏆\n\n🎁 *Hadiah*: ${prizeText}`;

      conn.reply(m.chat, resultText, m, {
        contextInfo: { mentionedJid: participants }
      });

      delete conn.balapmotor[session.challenger];
      break;
    }

    case 'emoh': {
      const session = Object.values(conn.balapmotor).find(
        s => s.challenged.includes(m.sender) && s.status === 'pending'
      );

      if (!session) {
        return conn.reply(m.chat, 'Tidak ada tantangan balapan untukmu.', m);
      }

      const text = `@${m.sender.split('@')[0]} menolak tantangan balapan dari @${session.challenger.split('@')[0]}.`;

      conn.reply(m.chat, text, m, {
        contextInfo: { mentionedJid: [session.challenger, ...session.challenged] }
      });

      delete conn.balapmotor[session.challenger];
      break;
    }
  }
};

handler.command = /^(balapmotor|gas|emoh)$/i;
handler.tags = ['rpg'];
handler.help = ['balapmotor *@user*'];
handler.private = false;

export default handler;