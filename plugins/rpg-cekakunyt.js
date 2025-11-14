let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    const tag = '@' + m.sender.split`@`[0];
    let playButton = user.playButton;

    // Use the custom formatNumber function for formatting
    const formattedSubscribers = formatNumber(user.subscribers);
    const formattedViewers = formatNumber(user.viewers);
    const formattedLike = formatNumber(user.like);

    try {
        if (command === 'akunyt') {
            if (!user.youtube_account) {
                return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag} Buat akun terlebih dahulu\nKetik: .createakun`, floc);
            } else {
                return conn.reply(m.chat, `📈 Akun YouTube Anda 📉\n
🧑🏻‍💻 *Streamer:* ${user.registered ? tag : conn.getName(m.sender)}
🌐 *Channel:*   ${user.youtube_account}
👥 *Subscribers:*   ${formattedSubscribers}
🪬 *Viewers:*   ${formattedViewers}
👍🏻 *Like:*   ${formattedLike}

⬜ *Silver PlayButton:*   ${playButton < 1 ? '❎' : '✅'}
🟧 *Gold PlayButton:*   ${playButton < 2 ? '❎' : '✅'}
💎 *Diamond PlayButton:*   ${playButton < 3 ? '❎' : '✅'}`, floc);
            }
        } else if (/live/i.test(command) && args[0] === 'youtuber') {
            // Check if user has a YouTube account
            if (!user.youtube_account) {
                return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag} Buat akun terlebih dahulu\nKetik: .createakun`, floc);
            }

            // Existing code for the 'live youtuber' command
            // ...
        } else {
            return await m.reply("Perintah tidak dikenali.\n*.akunyt*\n> ᴜɴᴛᴜᴋ ᴍᴇɴɢᴇᴄᴇᴋ ᴀᴋᴜɴ ʏᴏᴜᴛᴜʙᴇ ᴀɴᴅᴀ\n*.live [judul live]*\n> ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴋᴛɪᴠɪᴛᴀs ʟɪᴠᴇ sᴛʀᴇᴀᴍɪɴɢ.");
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack);
    }
};

// Function to format large numbers (e.g. 1k, 10.0k, 100.0k, 1JT, 10.0JT, 100.0JT)
function formatNumber(num) {
    if (num >= 100000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'T'; // 1M, 10.0M, 100.0M
    if (num >= 10000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; // 1JT, 10.0JT, 100.0JT
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'JT'; // 1M, 10.0M, 100.0M
    if (num >= 100000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; // 100.0k
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'; // 1k, 10.0k
    return num.toString();
}

// Define help, tags, command, and registration for RPG command handler
handler.help = ['akunyt'];
handler.tags = ['rpg'];
handler.command = /^(akunyt)$/i;
handler.register = true;
handler.group = true;

// Export RPG command handler
export default handler;