import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
    // Fungsi ambil info neofetch + hitung ping
    let getInfo = () => new Promise((resolve) => {
        let timestamp = speed();
        let latensi = speed() - timestamp;
        exec(`neofetch --stdout`, (error, stdout) => {
            let child = stdout.toString("utf-8");
            let ssd = child.replace(/Memory:/, "Ram:");
            resolve(`${ssd}🍏  *Kecepatan* : ${latensi.toFixed(4)} _ms_`);
        });
    });

    // Kirim pertama kali
    let text = await getInfo();
    let { key } = await m.reply(text);

    // Ulangi 4 kali edit, tiap 1 detik
    let count = 0;
    let interval = setInterval(async () => {
        count++;
        if (count > 4) { // Sudah edit 4 kali, berhenti
            clearInterval(interval);
            return;
        }
        let newText = await getInfo();
        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: key,
                type: 14, // Edit pesan
                editedMessage: {
                    conversation: newText
                }
            }
        }, {});
    }, 1000);
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = ['ping', 'speed']

export default handler