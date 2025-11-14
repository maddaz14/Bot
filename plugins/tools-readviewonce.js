let handler = async (m, { conn }) => {
    let mtype = m.quoted?.mediaMessage;

    if (mtype?.imageMessage) {
        let mimetype = mtype.imageMessage.mimetype || 'image/jpeg';
        let caption = mtype.imageMessage.caption || '📸 ViewOnce Image';

        try {
            let buffer = await m.quoted.download();

            await conn.sendMessage(m.chat, {
                image: buffer,
                caption,
                contextInfo: {
                    forwardingScore: 9999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: global.info?.namechannel,
                        newsletterJid: global.info?.channel
                    },
                    externalAdReply: {
                        title: '🔓 ViewOnce Dibuka',
                        body: global.author,
                        thumbnailUrl: global.aetherzjpg,
                        sourceUrl: 'https://wa.me/' + m.sender.split('@')[0],
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });

        } catch (error) {
            console.error('❌ Gagal unduh imageMessage:', error);
            m.reply('Terjadi kesalahan saat mengunduh gambar.');
        }

    } else if (mtype?.videoMessage) {
        let mimetype = mtype.videoMessage.mimetype || 'video/mp4';
        let caption = mtype.videoMessage.caption || '🎥 ViewOnce Video';

        try {
            let buffer = await m.quoted.download();

            await conn.sendMessage(m.chat, {
                video: buffer,
                caption,
                contextInfo: {
                    forwardingScore: 9999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: global.info?.namechannel,
                        newsletterJid: global.info?.channel
                    },
                    externalAdReply: {
                        title: '🔓 ViewOnce Video Dibuka',
                        body: global.author,
                        thumbnailUrl: global.aetherzjpg,
                        sourceUrl: 'https://wa.me/' + m.sender.split('@')[0],
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });

        } catch (error) {
            console.error('❌ Gagal unduh videoMessage:', error);
            m.reply('Terjadi kesalahan saat mengunduh video.');
        }

    } else {
        m.reply('❌ Tidak ada media yang bisa diakses (image/video). Reply ke pesan viewOnce!');
    }
};

handler.help = ['readviewonce', 'rvo'];
handler.tags = ['tools'];
handler.command = /^retrieve|readviewonce|rvo$/i;

export default handler;