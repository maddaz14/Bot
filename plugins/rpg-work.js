function formatCooldown(remainingTime, viewers) {
    let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

let viewerCount = 0; // Variable to store the viewer count

let handler = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    let type = (args[0] || '').toLowerCase();
    let _type = (args[0] || '').toLowerCase();
    let user = global.db.data.users[m.sender];
    let userTag = '@' + m.sender.split('@')[0];
    let subscribers = global.db.data.users[m.sender].subscribers;
    global.db.data.users[m.sender].pickaxe = global.db.data.users[m.sender].pickaxe || 0;
    global.db.data.users[m.sender].pedang = global.db.data.users[m.sender].pedang || 0;
    global.db.data.users[m.sender].pancingan = global.db.data.users[m.sender].subscribers || 0;
    let botol = global.botwm;

    let lgocraft = `
*「 R E P A I R 」*`;

    let caption = `
*「 P E K E R J A A N 」*

 • Youtuber
 • Instagram
 • Twitter
 • Snapchat
`;

    try {
        let count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count);
        
        // Mengambil waktu terakhir kali perintah dilakukan
        let lastyoutuber = user.lastyoutuber || 0;
        let cooldown = 600000; // Waktu cooldown dalam milidetik (600.000 milidetik = 10 menit)
        
        // Memeriksa apakah sudah melewati waktu cooldown
        if (Date.now() - lastyoutuber < cooldown) {
            let remainingTime = cooldown - (Date.now() - lastyoutuber);
            let remainingTimeString = formatCooldown(remainingTime, viewerCount);
            m.reply(`Anda harus menunggu ${remainingTimeString} sebelum melakukan pekerjaan lagi.`);
            return;
        }

        // Menyimpan waktu terakhir kali perintah dilakukan
        user.lastyoutuber = Date.now();
        
        if (/work/i.test(command)) {
            switch (type) {
                case 'youtuber':
                    // Generate random values for subscribers
                    let randomSubscribers = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Random number between 10 and 50

                    user.subscribers += randomSubscribers;
                    global.db.data.users[m.sender].subscribers = user.subscribers; // Update subscribers value
                    viewerCount += randomSubscribers; // Update viewer count
                    m.reply(`*—[ Hasil Jadi Seleb YouTuber Untuk ${userTag} ]—*
 🎉 Subscribers Baru = [ ${randomSubscribers} ]
 💼 Total Subscribers Sekarang : ${user.subscribers}
 👀 Total Penonton Sekarang : ${viewerCount}`); // Menambahkan jumlah penonton ke pesan balasan
                    break;
                case 'instagram':
                    // Generate random values for likes and followers
                    let randomLikes = Math.floor(Math.random() * (1000 - 500 + 1)) + 500; // Random number between 500 and 1000
                    let randomFollowers = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // Random number between 50 and 100

                    user.likeinstagram += randomLikes;
                    user.followers += randomFollowers;

                    m.reply(`*—[ Hasil Jadi Seleb Instagram Untuk ${userTag} ]—*
❤️ Like Baru: ${randomLikes}
👥 Pengikut Baru: ${randomFollowers}
💖 Total Like: ${user.likeinstagram}
👤 Total Pengikut: ${user.followers}`);
                    break;
                case 'twitter':
                    // Generate random values for tweets and followers
                    let randomTweets = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // Random number between 50 and 100
                    let randomFollowersTwitter = Math.floor(Math.random() * (1000 - 500 + 1)) + 500; // Random number between 500 and 1000

                    user.tweets += randomTweets;
                    user.followersTwitter += randomFollowersTwitter;

                    m.reply(`*—[ Hasil Jadi Seleb Twitter Untuk ${userTag} ]—*
🐦 Tweets Baru: ${randomTweets}
👤 Pengikut Baru: ${randomFollowersTwitter}
👥 Total Tweets: ${user.tweets}
👤 Total Pengikut: ${user.followersTwitter}`);
                    break;
                case 'snapchat':
                    // Generate random values for snaps and friends
                    let randomSnaps = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // Random number between 50 and 100
                    let randomFriendsSnapchat = Math.floor(Math.random() * (1000 - 500 + 1)) + 500; // Random number between 500 and 1000

                    user.snaps += randomSnaps;
                    user.friendsSnapchat += randomFriendsSnapchat;

                    m.reply(`*—[ Hasil Jadi Seleb Snapchat Untuk ${userTag} ]—*
📸 Snaps Baru: ${randomSnaps}
👤 Teman Baru: ${randomFriendsSnapchat}
👥 Total Snaps: ${user.snaps}
👤 Total Teman: ${user.friendsSnapchat}`);
                    break;
                default:
                    return await m.reply(caption);
            }
        } else if (/enchant|enchan/i.test(command)) {
            count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count);
            switch (_type) {
                case 't':
                    break;
                case '':
                    break;

                default:
                    return m.reply(caption);
            }
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack);
    }
};

handler.help = ['work'];
handler.tags = ['rpg'];
handler.command = /^(work)/i;
handler.register = true;

export default handler;