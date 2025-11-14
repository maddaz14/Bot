let handler = async (m, { conn, text, command, isOwner }) => {
    if (!isOwner) return m.reply('❌ Perintah ini hanya untuk Owner.')

    if (!text) {
        return m.reply(`📌 Contoh penggunaan:
.reactch https://whatsapp.com/channel/xxx/123 😂
.rch https://whatsapp.com/channel/xxx/123 yoimiya|3`)
    }

    if (command === 'reactch') {
        let args = text.trim().split(" ")
        let link = args[0]
        let emoji = args[1]

        if (!link.includes("https://whatsapp.com/channel/"))
            return m.reply("⚠️ Link tidak valid!")

        let channelId = link.split('/')[4]
        let messageId = link.split('/')[5]

        try {
            let meta = await conn.newsletterMetadata("invite", channelId)
            await conn.newsletterReactMessage(meta.id, messageId, emoji)
            m.reply(`✅ Berhasil mengirim reaksi *${emoji}* ke channel *${meta.name}*`)
        } catch (e) {
            console.error(e)
            m.reply('❌ Gagal mengirim reaksi. Pastikan link dan emoji valid.')
        }

    } else if (command === 'rch' || command === 'reactch-elite') {
        const hurufGaya = {
            a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
            h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
            o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
            v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
            '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
            '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
        };

        const [mainText, offsetStr] = text.split('|');
        const args = mainText.trim().split(" ");
        const link = args[0];

        if (!link.includes("https://whatsapp.com/channel/")) {
            return m.reply("⚠️ Link tidak valid!\nContoh: .rch https://whatsapp.com/channel/xxx/idpesan teks|offset");
        }

        const channelId = link.split('/')[4];
        const rawMessageId = parseInt(link.split('/')[5]);
        if (!channelId || isNaN(rawMessageId)) return m.reply("⚠️ Link tidak lengkap!");

        const offset = parseInt(offsetStr?.trim()) || 1;
        const teksNormal = args.slice(1).join(' ');
        const teksTanpaLink = teksNormal.replace(link, '').trim();
        if (!teksTanpaLink) return m.reply("⚠️ Masukkan teks/emoji untuk direaksikan.");

        const emoji = teksTanpaLink.toLowerCase().split('').map(c => {
            if (c === ' ') return '―';
            return hurufGaya[c] || c;
        }).join('');

        try {
            const metadata = await conn.newsletterMetadata("invite", channelId);
            let success = 0, failed = 0;

            for (let i = 0; i < offset; i++) {
                const msgId = (rawMessageId - i).toString();
                try {
                    await conn.newsletterReactMessage(metadata.id, msgId, emoji);
                    success++;
                } catch (e) {
                    failed++;
                }
            }

            m.reply(`✅ Berhasil kirim reaksi *${emoji}* ke ${success} pesan di channel *${metadata.name}*\n❌ Gagal di ${failed} pesan`);
        } catch (err) {
            console.error(err);
            m.reply("❌ Gagal memproses permintaan!");
        }
    }
}

handler.command = ['reactch', 'rch', 'reactch-elite']
handler.help = ['reactch <link> <emoji>', 'rch <link> <teks>|<offset>']
handler.tags = ['owner']
handler.owner = true

export default handler