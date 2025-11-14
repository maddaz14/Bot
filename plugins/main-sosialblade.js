let handler = async (m, { conn, args, participants }) => {
    if (!args[0]) {
        return conn.reply(m.chat, "Berikut adalah list sosial blade\n\n- youtube\n- instagram\n\nketik: .sosialblade youtube.", floc);
    }

    let platform = args[0].toLowerCase();
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
        return {...value, jid: key};
    });

    let sortedSubscribers = users.map(toNumber('subscribers')).sort(sort('subscribers', true));
    let sortedViewers = users.map(toNumber('viewers')).sort(sort('viewers'));
    let sortedLikes = users.map(toNumber('like')).sort(sort('like'));
    let sortedFollowers2 = users.map(toNumber('followers2')).sort(sort('followers2', true));
    let sortedLikes2 = users.map(toNumber('likes2')).sort(sort('likes2'));
    let sortedComments2 = users.map(toNumber('comments2')).sort(sort('comments2'));
    let sortedShares2 = users.map(toNumber('shares2')).sort(sort('shares2'));

    let len = args[1] && args[1].length > 0 ? Math.min(15, Math.max(parseInt(args[1]), 15)) : Math.min(15, sortedSubscribers.length);

    let textYouTube = `🌟 S O S I A L B L A D E 🌟 (YouTube)

🔹 Top 📈 Subscribers
➡️ Kamu: *${sortedSubscribers.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedSubscribers.length}*

${sortedSubscribers.slice(0, len).map(({ jid, subscribers }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Subscribers ${subscribers.toLocaleString()}*`).join`\n`}
┗━━━━━━━📈━━━━━━━┛

🔹 Top 🎥 Viewers
➡️ Kamu: *${sortedViewers.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedViewers.length}*

${sortedViewers.slice(0, len).map(({ jid, viewers }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Viewers ${viewers.toLocaleString()}*`).join`\n`}
┗━━━━━━━🎥━━━━━━━┛

🔹 Top 👍 Likes
➡️ Kamu: *${sortedLikes.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedLikes.length}*

${sortedLikes.slice(0, len).map(({ jid, like }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Likes ${like.toLocaleString()}*`).join`\n`}
┗━━━━━━━👍━━━━━━━┛`;

let textInstagram = `🌟 S O S I A L B L A D E 🌟 (Instagram)

🔹 Top 📈 Followers
➡️ Kamu: *${sortedFollowers2.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedFollowers2.length}*

${sortedFollowers2.slice(0, len).map(({ jid, followers2 }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Followers ${followers2.toLocaleString()}*`).join`\n`}
┗━━━━━━━📈━━━━━━━┛

🔹 Top 👍 Likes
➡️ Kamu: *${sortedLikes2.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedLikes2.length}*

${sortedLikes2.slice(0, len).map(({ jid, likes2 }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Likes ${likes2.toLocaleString()}*`).join`\n`}
┛━━━━━━━👍━━━━━━━┛

🔹 Top 💬 Comments
➡️ Kamu: *${sortedComments2.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedComments2.length}*

${sortedComments2.slice(0, len).map(({ jid, comments2 }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Comments ${comments2.toLocaleString()}*`).join`\n`}
┛━━━━━━━💬━━━━━━━┛

🔹 Top 🔁 Shares
➡️ Kamu: *${sortedShares2.findIndex(u => u.jid === m.sender) + 1}* dari *${sortedShares2.length}*

${sortedShares2.slice(0, len).map(({ jid, shares2 }, i) => 
    `${i + 1}. @${jid.split('@')[0]} *Shares ${shares2.toLocaleString()}*`).join`\n`}
┛━━━━━━━🔁━━━━━━━┛`;

    if (platform === 'youtube') {
        conn.reply(m.chat, textYouTube, floc);
    } else if (platform === 'instagram') {
        conn.reply(m.chat, textInstagram, floc);
    } else {
        conn.reply(m.chat, "Berikut adalah list sosial blade\n\n- youtube\n- instagram\n\nketik: .sosialblade youtube.", floc);
    }
};

handler.help = ['sosialblade'];
handler.tags = ['main'];
handler.command = /^(sosialblade|sb)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.register = true;
handler.group = true;
handler.private = false;

handler.admin = false;
handler.botAdmin = false;

handler.fail = null;
handler.exp = 0;

export default handler;

function sort(property, ascending = true) {
    return (a, b) => (ascending ? b[property] - a[property] : a[property] - b[property]);
}

function toNumber(property, _default = 0) {
    return user => {
        user[property] = user[property] || _default;
        return user;
    };
}