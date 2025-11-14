// plugins/prefix.js
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat];
    if (!chat) return;

    if (command === 'noprefix') {
        let isEnable = args[0] && /(on|enable)/i.test(args[0]);
        let isDisable = args[0] && /(off|disable)/i.test(args[0]);

        if (!isEnable && !isDisable) {
            return m.reply(`Penggunaan:
*${usedPrefix + command} on* untuk mengaktifkan perintah tanpa prefix.
*${usedPrefix + command} off* untuk menonaktifkan perintah tanpa prefix.

Status saat ini: ${chat.noprefix ? '✅ Aktif' : '❌ Nonaktif'}
            `);
        }

        if (isEnable) {
            if (chat.noprefix) return m.reply('Perintah tanpa prefix sudah aktif.');
            chat.noprefix = true;
            m.reply('Perintah tanpa prefix berhasil *diaktifkan* di grup ini. Sekarang bot akan merespons perintah tanpa titik.');
        } else if (isDisable) {
            if (!chat.noprefix) return m.reply('Perintah tanpa prefix sudah nonaktif.');
            chat.noprefix = false;
            m.reply('Perintah tanpa prefix berhasil *dinonaktifkan* di grup ini. Bot hanya akan merespons perintah dengan titik.');
        }
    } else if (command === 'setprefix') {
        let button = [
            {buttonId: '.noprefix on', buttonText: {displayText: '❌ TANPA PREFIX'}, type: 1},
            {buttonId: '.noprefix off', buttonText: {displayText: '✅ PAKAI PREFIX'}, type: 1}
        ];
        let buttonMessage = {
            text: `*Pilih opsi prefix untuk grup ini:*`,
            footer: `Status saat ini: ${chat.noprefix ? '✅ Tanpa Prefix (On)' : '❌ Dengan Prefix (Off)'}`,
            buttons: button,
            headerType: 1
        };
        await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

    } else if (command === 'prefix') {
        let currentPrefix = chat.prefix || '.';
        m.reply(`Prefix bot di grup ini saat ini adalah: *${currentPrefix}*`);
    }
};

handler.help = ['setprefix', 'prefix'];
handler.tags = ['group'];
handler.command = ['setprefix', 'prefix'];
handler.admin = true;
handler.group = true;
module.exports = handler;