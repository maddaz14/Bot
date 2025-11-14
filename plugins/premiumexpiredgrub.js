let handler = async (event, { conn }) => {
  const { id: groupId, participants, action } = event;

  const groupData = global.db.data.chats[groupId];
  if (!groupData || !groupData.isPremiumGroup) return;

  const now = Date.now();

  // Cek apakah premium grup sudah kadaluarsa
  if (groupData.premiumGroupExpire && now > groupData.premiumGroupExpire) {
    groupData.isPremiumGroup = false;
    groupData.premiumGroupExpire = null;

    const metadata = await conn.groupMetadata(groupId);
    const allParticipants = metadata.participants || [];

    for (const user of allParticipants) {
      const jid = user.id;
      if (global.db.data.users[jid]) {
        global.db.data.users[jid].premium = false;
        global.db.data.users[jid].premiumDate = 0;
      }
    }

    await conn.sendMessage(groupId, { text: '⏰ Premium grup sudah habis, semua member kembali ke status *free*.' });
    return;
  }

  // Jika seseorang keluar dari grup premium
  if (action === 'remove') {
    for (const user of participants) {
      const jid = user;
      if (global.db.data.users[jid] && global.db.data.users[jid].premium) {
        global.db.data.users[jid].premium = false;
        global.db.data.users[jid].premiumDate = 0;

        await conn.sendMessage(jid, {
          text: `⛔ Status premium *@${jid.split('@')[0]}* telah dihapus karena keluar dari grup.`,
          mentions: [jid],
        });
      }
    }
  }
};

handler.participantsUpdate = true;
export default handler;