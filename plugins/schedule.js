import moment from 'moment-timezone';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkSchedules() {
  if (!global.schedules) return;

  const chatIds = Object.keys(global.schedules);

  for (const chatId of chatIds) {
    let sched = global.schedules[chatId];
    const now = moment.tz(sched.timezone);
    const today = now.format('YYYY-MM-DD');

    for (let i = 0; i < sched.times.length; i++) {
      let schedule = sched.times[i];
      const scheduleTime = moment.tz(`${today} ${schedule.time}`, 'YYYY-MM-DD HH:mm:ss', sched.timezone);

      if (now.isAfter(scheduleTime)) {
        const lastDate = schedule.last ? moment(schedule.last) : null;

        if (!lastDate || !lastDate.isSame(today, 'day')) {
          try {
            await conn.groupSettingUpdate(chatId, schedule.action);
            await conn.sendMessage(chatId, { text: schedule.say });
            schedule.last = today; 
          } catch (err) {
            console.error(`Failed to execute action ${schedule.action}:`, err);
          }

          await sleep(1000); 
        }
      }
    }
    await sleep(1000); 
    global.schedules[chatId] = sched; 
  }
}

setInterval(checkSchedules, 60000);

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!global.schedules) global.schedules = {};
    
    if (command === 'addschedule') {
        let actions = {
            'open': 'not_announcement',
            'close': 'announcement'
        };

        let [action, time, timezone, say] = text.split("|");

        if (!action || !time || !timezone || !say) return m.reply("Example: .addschedule *close|22:00:00|Asia/Jakarta|Grupnya ditutup, udah malem bobok aja kalian*");
        if (!(action in actions)) return m.reply(`Action tidak tersedia, silahkan lihat list nya: \n- ${Object.keys(actions).join("\n- ")}`);

        const validTimezones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'];
        action = actions[action];

        if (!validTimezones.includes(timezone)) {
            m.reply('Timezone tidak valid. Pilihan yang tersedia: Asia/Jakarta, Asia/Makassar, Asia/Jayapura.');
            return;
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (!timeRegex.test(time)) {
            m.reply('Format waktu tidak valid. Harus dalam format HH:MM:SS\nContoh: .addschedule *close|22:00:00|Asia/Jakarta|Grupnya ditutup, udah malem bobok aja kalian*');
            return;
        }

        if (!global.schedules[m.chat]) {
            global.schedules[m.chat] = { timezone: timezone, times: [] };
        }

        let times = global.schedules[m.chat].times.map(a => a.time);
        if (times.includes(time)) return m.reply("Format waktu telah ditambahkan sebelumnya!");

        global.schedules[m.chat].times.push({ time, action, say, last: null });
        m.reply(`Berhasil menambahkan schedule di group ini!\nTime ${time}\nAction: ${action} group`);
    } else if (command === 'delschedule') {
        let time = text;
        if (!text) return m.reply("Example: \n- .delschedule all\n- .delschedule 12:00:00");

        if (!global.schedules[m.chat]) {
            m.reply(`Tak ada schedule yg aktif di grup ini!`);
            return;
        }

        if (time === "all") {
            delete global.schedules[m.chat];
            m.reply(`Berhasil! Semua schedule aktif di group ini telah dihapus!.`);
        } else {
            const newTimes = global.schedules[m.chat].times.filter(entry => entry.time !== time);
            if (newTimes.length === global.schedules[m.chat].times.length) {
                m.reply(`Tak ada schedule untuk waktu ${time} di group ini`);
            } else {
                global.schedules[m.chat].times = newTimes;
                if (global.schedules[m.chat].times.length === 0) {
                    delete global.schedules[m.chat];
                    m.reply(`Schedule time ${time} di group ini telah dihapus! Tidak ada lagi schedule yang tersisa.`);
                } else {
                    m.reply(`Schedule time ${time} di group ini sudah dihapus!.`);
                }
            }
        }
    }
};

handler.help = [
    'addschedule close|22:00:00|Asia/Jakarta|Grupnya ditutup, udah malem bobok aja kalian',
    'delschedule 12:00:00 atau all'
];
handler.tags = ['group'];
handler.command = /^(schedule|addschedule|delschedule)$/i;

handler.admin = true;
handler.botAdmin = true;

export default handler;