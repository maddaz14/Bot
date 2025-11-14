let handler = async (m, { conn, args, command }) => {
    const user = global.db.data.users[m.sender];
    const senderTag = '@' + m.sender.split`@`[0];
    const mentionedUsers = m.mentionedJid || [];
    const now = new Date();

    try {
        const amount = parseInt(args[0]);
        if (!amount || amount < 1000 || amount > 5000000) {
            throw `💸 Masukkan jumlah antara 1000 hingga 5 juta.\n\nContoh: .berdagang 1000 @tag1 @tag2`;
        }
        if (mentionedUsers.length < 2 || mentionedUsers.length > 5) {
            throw `👥 *Jumlah teman* Minimal 2 orang dan maksimal 5 orang.\n\nContoh: .berdagang 1000 @tag1 @tag2`;
        }

        const participants = [m.sender, ...mentionedUsers];
        for (let participant of participants) {
            const participantData = global.db.data.users[participant];
            if (!participantData || participantData.money < amount) { // PERUBAHAN: eris diubah menjadi money
                const participantTag = '@' + participant.split`@`[0];
                throw `❌ ${participantTag} tidak memiliki cukup uang untuk berdagang!`;
            }
            if (participantData.inTrade) {
                const participantTag = '@' + participant.split`@`[0];
                throw `⏳ ${participantTag} sedang dalam perdagangan lain. Tunggu hasil sebelumnya dikirim.`;
            }
        }

        participants.forEach(participant => {
            global.db.data.users[participant].money -= amount; // PERUBAHAN: eris diubah menjadi money
            global.db.data.users[participant].inTrade = true;
        });

        const participantsTag = participants.map(p => '@' + p.split`@`[0]).join(', ');
        conn.reply(m.chat, `📦 *Perdagangan Sedang Berlangsung*\n\n👥 *Peserta:* ${participantsTag}\n💸 *Modal per orang:* ${formatNumber(amount)}\n⏳ *Hasil perdagangan akan dikirim dalam 1 jam.*`, floc);

        setTimeout(() => {
            const baseProfit = Math.floor(amount * 0.8);
            const maxProfit = Math.floor(amount * 2);
            const profitFactor = Math.random() * (maxProfit - baseProfit) + baseProfit;
            const totalProfit = Math.floor(profitFactor * mentionedUsers.length);
            const profitPerPerson = Math.floor(totalProfit / participants.length);

            participants.forEach(participant => {
                const expGain = Math.floor(Math.random() * (5000 - 10 + 1)) + 10;
                global.db.data.users[participant].money += profitPerPerson; // PERUBAHAN: eris diubah menjadi money
                global.db.data.users[participant].exp += expGain;
                global.db.data.users[participant].lastTrade = now;
                global.db.data.users[participant].inTrade = false;
            });

            const profitMessage = participants.map(p => {
                const expGain = Math.floor(Math.random() * (5000 - 10 + 1)) + 10;
                return `${'@' + p.split`@`[0]} menerima ${formatNumber(profitPerPerson)} uang dan ${formatNumber(expGain)} Exp`;
            }).join('\n');

            conn.reply(m.chat, `📦 *Hasil Perdagangan*\n\n👥 *Peserta:* ${participantsTag}\n💸 *Modal per orang:* ${formatNumber(amount)}\n📈 *Hasil perdagangan:*\n${profitMessage}\n\n⏳ Cooldown 30 menit berlaku.`, floc);
        }, 3600000);
    } catch (err) {
        m.reply("❌ " + err);
    }
};

function msToTime(duration) {
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${hours > 0 ? `${hours} jam ` : ''}${minutes} menit`;
}

function formatNumber(num) {
    return num.toLocaleString('id-ID');
}

handler.help = ['berdagang'];
handler.tags = ['rpg'];
handler.command = /^(ber(dagang)?)$/i;
handler.register = true;
handler.group = true;
handler.limit = 2;

export default handler;