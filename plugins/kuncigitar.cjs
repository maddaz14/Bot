const {
    chord
} = require("@bochilteam/scraper");

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (!text) {
        throw `*Contoh:* ${usedPrefix + command} mantra hujan`;
    }

    try {
        const result = await chord(text);
        if (!result) {
            return m.reply("Chord lagu tidak ditemukan.");
        }

        const teks = `
*╭─「 Kunci Gitar 」─*
│ *Judul:* ${result.title}
│ *Artis:* ${result.artist}
│ *URL Artis:* ${result.artistUrl}
*╰───────────*

\`\`\`
${result.chord}
\`\`\`
`;
        m.reply(teks);
    } catch (error) {
        console.error("Error fetching chord:", error);
        m.reply("Terjadi kesalahan saat mencari kunci gitar.");
    }
};

handler.help = ["kuncigitar", "chord"].map(a => a + " *[judul lagu]*");
handler.tags = ["internet"];
handler.command = ["kuncigitar", "chord"];
module.exports = handler;