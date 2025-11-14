let handler = async (m, { conn }) => {
  // Fetch the sender's data from the global database
  let user = global.db.data.users[m.sender];
  let premTime = user.premiumTime;
  let isPremium = user.premium;

  // Calculate remaining premium time
  let waktu = clockString(premTime - new Date().getTime());

  // Create a response message with decorative elements
  let message = isPremium ? 
    `✨ *Premium Status* ✨\n\n👤 *Name:* ${conn.getName(m.sender)}\n⏰ *Remaining Time:* ${waktu}` : 
    `❌ *Premium Status* ❌\n\n👤 *Name:* ${conn.getName(m.sender)}\n⚠️ *Status:* Expired`;

  // Reply to the sender with their premium status
  await conn.reply(m.chat, message.trim(), floc);
}

handler.help = ['checkprem'];
handler.tags = ['info'];
handler.command = /^(checkprem|premcheck|cekprem|premcek)$/i;

export default handler;

// Helper function to convert milliseconds to a readable time format
function clockString(ms) {
  let y = isNaN(ms) ? '--' : Math.floor(ms / 31536000000); // 1 year = 31536000000 ms
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12; // 1 month = 2592000000 ms (approx 30 days)
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30;
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  
  return [
    `${y} Years`, 
    `${mo} Months`, 
    `${d} Days`, 
    `${h} Hours`, 
    `${m} Minutes`, 
    `${s} Seconds`
  ].map(v => v.toString().padStart(2, 0)).join(', ');
}