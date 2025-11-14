import { WAMessageStubType } from '@fuxxy-star/baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

// Pastikan file ini dinamai lib/print.js
const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
    // Warna Neon
    const NEON_YELLOW = chalk.hex('#FFFF33');
    const NEON_GREEN = chalk.hex('#39FF14');
    const NEON_CYAN = chalk.hex('#00FFFF');
    const NEON_PINK = chalk.hex('#FF1493');
    const NEON_RED = chalk.hex('#FF073A');
    const NEON_BLUE = chalk.hex('#4D4DFF');

    // Mendapatkan nama dan nomor pengirim
    let _name = await conn.getName(m.sender);
    let sender = NEON_CYAN(
        PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international')
    ) + (_name ? NEON_PINK(' ~' + _name) : '');
    let chat = NEON_GREEN(await conn.getName(m.chat));

    // Mengambil gambar jika ada
    let img;
    try {
        if (global.opts['img']) {
            img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
        }
    } catch (e) {
        console.error(e);
    }

    // Menghitung ukuran file atau panjang teks
    let filesize = (
        m.msg ? m.msg.vcard ? m.msg.vcard.length : m.msg.fileLength ? m.msg.fileLength.low || m.msg.fileLength : m.msg.axolotlSenderKeyDistributionMessage ? m.msg.axolotlSenderKeyDistributionMessage.length : m.text ? m.text.length : 0 : m.text ? m.text.length : 0
    ) || 0;

    // Mengambil informasi pengguna
    let user = global.DATABASE.data.users[m.sender];
    let type = m.isGroup ? NEON_BLUE("GROUP CHAT") : NEON_YELLOW("PRIVATE CHAT");
    let txt = m.text && m.text.length >= 45 ? m.text.slice(0, 44) + NEON_RED('...') : m.text || '';
    let isBot = m.isBaileys ? NEON_RED("YA") : NEON_GREEN("NO");
    let plugin = m.plugin || '';
    
    // --- STRUKTUR TAMPILAN NEON BARU ---

    // Header Frame
    let headerFrame = NEON_CYAN('╔' + '═'.repeat(48) + '╗');
    let footerFrame = NEON_CYAN('╚' + '═'.repeat(48) + '╝');

    // Header Utama
    let headers = NEON_PINK.bold(
        '  ' + ' '.repeat(10) + '★ F U X X Y   C  O N S O L E ★'
    ).padEnd(52, ' ');
    
    // Body Informasi
    let bodyInfo = `
${NEON_CYAN('│')} ${NEON_YELLOW('• Tipe Chat :')} ${type.padEnd(30, ' ')} ${NEON_CYAN('│')}
${NEON_CYAN('│')} ${NEON_YELLOW('• Dari Chat :')} ${chat.padEnd(30, ' ')} ${NEON_CYAN('│')}
${NEON_CYAN('│')} ${NEON_YELLOW('• Pengirim :')} ${sender.padEnd(30, ' ')} ${NEON_CYAN('│')}
${NEON_CYAN('│')} ${NEON_YELLOW('• Plugin :')} ${NEON_GREEN.bold((plugin || '-')).padEnd(30, ' ')} ${NEON_CYAN('│')}
${NEON_CYAN('│')} ${NEON_YELLOW('• ID Sistem :')} ${isBot.padEnd(30, ' ')} ${NEON_CYAN('│')}
${NEON_CYAN('│')} ${NEON_YELLOW('• Level/EXP :')} ${NEON_GREEN.bold(user?.level ?? '?')}/${NEON_GREEN.bold(user?.exp ?? '?')}${' '.repeat(20)} ${NEON_CYAN('│')}
${NEON_CYAN('│')} ${NEON_YELLOW('• MIME Type :')} ${NEON_RED.bgCyan.bold(m.messageStubType ? WAMessageStubType[m.messageStubType] : m.mtype).padEnd(30, ' ')} ${NEON_CYAN('│')}
    `.trim();

    // Command/Isi Pesan
    let commandSection = NEON_PINK('╟' + '┄'.repeat(48) + '╢');
    let commandText = NEON_CYAN('│') + NEON_YELLOW.bold('  CMD / ISI PESAN: ') + (m.isCommand ? NEON_GREEN('→ ') : m.error ? NEON_RED('× ') : '') + NEON_YELLOW(txt).padEnd(30, ' ');

    // Footer
    let footerText = NEON_PINK.bold(
        '  ' + ' '.repeat(8) + '★ F U X X Y  M D  |  2 0 2 5 ★'
    ).padEnd(52, ' ');


    // Tampilkan ke console
    console.log(headerFrame);
    console.log(headers);
    console.log(NEON_CYAN('╠' + '═'.repeat(48) + '╣'));
    console.log(bodyInfo);
    console.log(commandSection);
    console.log(commandText);
    console.log(footerFrame);
    console.log(footerText);
    console.log(NEON_CYAN('╚' + '═'.repeat(48) + '╝'));
    console.log(); // Baris kosong untuk pemisah

    // Menampilkan gambar jika ada
    if (img) console.log(img.trimEnd());

    // Memformat teks konten pesan untuk terminal
    if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '');
        let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
        let mdFormat = (depth = 4) => (_, type, text, monospace) => {
            let types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
            text = text || monospace;
            let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
            return formatted;
        };
        if (log.length < 4096) log = log.replace(urlRegex, (url, i, text) => {
            let end = url.length + i;
            return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? NEON_RED(url) : url;
        });
        log = log.replace(mdRegex, mdFormat(4));
        if (m.mentionedJid) {
            for (let user of m.mentionedJid) {
                log = log.replace('@' + user.split`@`[0], NEON_PINK('@' + await conn.getName(user)));
            }
        }
        console.log(m.error != null ? NEON_RED(log) : m.isCommand ? NEON_YELLOW(log) : log);
    }

    // Menampilkan informasi tambahan jika ada
    if (m.messageStubParameters) {
        console.log(m.messageStubParameters.map(jid => {
            jid = conn.decodeJid(jid);
            let name = conn.getName(jid);
            return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''));
        }).join(', '));
    }
    
    // Menampilkan jenis media jika ada
    if (/document/i.test(m.mtype)) console.log(NEON_BLUE(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`));
    else if (/ContactsArray/i.test(m.mtype)) console.log(NEON_BLUE(`👨‍👩‍👧‍👦 KONTAK DIBAGIKAN`));
    else if (/contact/i.test(m.mtype)) console.log(NEON_BLUE(`👨 KONTAK ${m.msg.displayName || ''}`));
    else if (/audio/i.test(m.mtype)) {
        const duration = m.msg.seconds;
        console.log(NEON_BLUE(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`));
    }
    console.log(); 
    
    // Cek fitur Anti-Bot (kode asli)
    let chatData = global.DATABASE.data.chats[m.sender]; 
    if (m.isGroup) { 
        if (chatData && chatData.antiBot) { 
            if (m.isBaileys || m.id.startsWith("3EB0")) { 
                if (!m.fromMe) { 
                    await conn.sendMessage(m.chat, { text: `*[ System notice ]* Detect another bot, I will kick you` }); 
                    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove"); 
                    await conn.delay(2000); 
                } 
            } 
        } 
    } 
}

// Menjaga agar perubahan langsung terdeteksi
let file = global.__filename(import.meta.url);
watchFile(file, () => {
    console.log(chalk.redBright("Update 'lib/print.js'"));
});
