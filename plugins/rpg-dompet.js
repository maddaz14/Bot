let handler = async (m, { conn, args }) => {
  let userId = m.sender; // Default to the message sender
  let mentionedUser = m.mentionedJid && m.mentionedJid[0]; // Extract mentioned user ID if any
  
  // If a user is mentioned, use their ID instead of the sender's ID
  if (mentionedUser) {
    userId = mentionedUser;
  }

  let user = global.db.data.users[userId];
  
  // Get profile picture URL or use default if an error occurs
  const pp = await conn.profilePictureUrl(userId, "image").catch(() => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");
  
  // Format currency values
  const formattedMoney = new Intl.NumberFormat().format(user.money); // PERUBAHAN: user.eris diubah menjadi user.money
  const formattedBalance = new Intl.NumberFormat().format(user.balance);
  
  // Get user's tag
  const tag = '@' + userId.split('@')[0];
  
  // Determine premium status
  const premiumStatus = user.premiumTime > 0 ? 'Premium' : 'Free';
  
  // Construct and send the response message, tagging the user
  conn.reply(m.chat, `「 *DOMPET COIN PLAYER* 」

*👑 Name:* ${tag}
*💰 Money :* ${formattedMoney} 
*🪙 Balance :* ${formattedBalance}
*🛜 Status:* ${premiumStatus}`, floc, {
    mentions: [userId]
  });
}

handler.help = ['dompet'];
handler.tags = ['rpg'];
handler.command = /^(dompet|💰|dp)$/i;

handler.register = false;

export default handler;