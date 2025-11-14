const trainingCooldown = 24 * 60 * 60 * 1000;
const trainingDelay = 1 * 60 * 1000;

let handler = async (m) => {
    let command = m.text.trim().toLowerCase();
    let user = m.sender;
    let chatId = m.chat;

    if (!global.db.data.users[user]) {
        global.db.data.users[user] = {
            attack: 0,
            lastTraining: 0
        };
    }

    let userData = global.db.data.users[user];
    let currentTime = Date.now();

    if (/^\.?training$/.test(command)) {
        if (currentTime - userData.lastTraining < trainingCooldown) {
            let remainingTime = formatTime(trainingCooldown - (currentTime - userData.lastTraining));
            conn.reply(chatId, `⏳ Kamu @${user.split('@')[0]}, perlu menunggu ${remainingTime} sebelum kamu bisa berlatih lagi.`, floc);
            return;
        }

        conn.reply(chatId, `🚀 Pelatihan dimulai! @${user.split('@')[0]}, Mohon tunggu 1 menit untuk melihat hasilnya..`, floc);

        setTimeout(() => {
            conn.reply(chatId, `⚠️ Kamu masih di dalam masa training, tunggu sampai selesai!`, floc);
        }, 30 * 1000);

        setTimeout(() => {
            try {
                let results = performTraining();
                userData.attack += results.attackGained;
                userData.lastTraining = currentTime;
                conn.reply(chatId, formatTrainingResults(user, results), floc);

                setTimeout(() => {
                    conn.reply(chatId, `🔔 Kamu @${user.split('@')[0]}, sekarang bisa berlatih lagi! Ketik .training untuk memulai...`, floc);
                }, trainingCooldown);
            } catch (error) {
                conn.reply(chatId, `⚠️ Terjadi kesalahan saat pelatihan. Coba lagi nanti.`, floc);
            }
        }, trainingDelay);
    }
};

function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

function performTraining() {
    const tasks = [
        { name: 'Kill Ants', success: Math.random() >= 0.2 },
        { name: 'Archery', success: Math.random() >= 0.2 },
        { name: 'Kill Goblin', success: Math.random() >= 0.2 },
        { name: 'Sword Training in Forest', success: Math.random() >= 0.2 },
        { name: 'Fight Orc', success: Math.random() >= 0.2 },
        { name: 'Conquer Small Dragon', success: Math.random() >= 0.2 },
        { name: 'Face Giant', success: Math.random() >= 0.2 },
        { name: 'Explore Dungeon', success: Math.random() >= 0.2 },
        { name: 'Face Minotaur', success: Math.random() >= 0.2 },
        { name: 'Train Martial Arts', success: Math.random() >= 0.2 }
    ];

    const pointsPerSuccess = 50;
    const successfulTasks = tasks.filter(task => task.success).length;
    const attackGained = successfulTasks * pointsPerSuccess;

    return {
        tasks,
        successfulTasks,
        attackGained
    };
}

function formatTrainingResults(user, results) {
    let tasksSummary = results.tasks.map(task => `│${task.success ? '✅' : '❌'} ${task.name}`).join('\n');
    return `⟣───「 *STATISTICS* 」───⟢
│🎯 [ *Player* : @${user.split('@')[0]} ]
│📃 [ *Successful Training* : ${results.successfulTasks}/${results.tasks.length} ]
│📋 [ *Info* : Good job! Keep training ]
⟣──────────⟢

⟣───「 *RESULTS* 」───⟢
${tasksSummary}
│
│💪 Attack diperoleh: ${results.attackGained}
⟣──────────⟢`;
}

handler.help = ['training'];
handler.tags = ['rpg'];
handler.command = /^(training|\.training)$/i;
handler.group = true;
handler.register = true;
handler.limit = 3;

export default handler;