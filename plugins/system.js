import os from 'os';
import osu from 'node-os-utils';
import { performance } from 'perf_hooks';

let handler = async (m, { conn }) => {
    let start = performance.now();
    let cpu = osu.cpu;
    let mem = osu.mem;
    
    let totalMem = os.totalmem();
    let freeMem = os.freemem();
    let usedMem = totalMem - freeMem;
    let uptime = process.uptime();
    
    let txt = `🚀 *SYSTEM STATUS* 🚀

⚡ *Speed:* ${(performance.now() - start).toFixed(2)} ms ⏱️
🕰️ *Uptime:* ${clockString(uptime)}

📡 *Server Info:*
• 🖥️ CPU: ${cpu.model()}
• 💾 RAM: ${(usedMem / 1024 / 1024).toFixed(2)} MB / ${(totalMem / 1024 / 1024).toFixed(2)} MB
• 🏠 Platform: ${os.platform()}
• 🔥 CPU Usage: ${await cpu.usage()}%
• 🌐 Server: ${os.hostname()}
• 🕒 Time: ${new Date().toLocaleTimeString()}`;

    conn.sendMessage(m.chat, { text: txt }, { quoted: m });
};

handler.help = ['ping', 'speed'];
handler.tags = ['info'];
handler.command = /^(ping|speed|system)$/i;

export default handler;

function clockString(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}