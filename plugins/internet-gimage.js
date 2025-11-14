import axios from 'axios';
import { generateWAMessageFromContent, prepareWAMessageMedia, proto } from "@fuxxy-star/baileys";
import https from "https"; // Meskipun tidak digunakan, ini diimpor untuk konsistensi

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply('❌ Masukkan kata kunci gambar yang ingin dicari.');
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

        const apiUrl = `https://api.maelyn.sbs/api/gimage?q=${encodeURIComponent(text)}&apikey=zahra999`;
        const response = await axios.get(apiUrl);
        
        const data = response.data;

        if (data.code !== 200 || !data.result || data.result.length === 0) {
            return m.reply(`❌ Gambar tidak ditemukan untuk kata kunci "${text}".`);
        }

        // Ambil 5 URL gambar pertama dari hasil
        const images = data.result.slice(0, 5);
        let cards = [];

        for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i];
            
            // Menggunakan prepareWAMessageMedia untuk mendapatkan media yang siap dikirim
            const media = await prepareWAMessageMedia(
                { image: { url: imageUrl } },
                { upload: conn.waUploadToServer }
            );

            cards.push({
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `Hasil Gambar ke-${i + 1}`,
                    hasMediaAttachment: true,
                    ...media
                }),
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `*Pencarian*: ${text}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `Maelyn API`
                }),
                // Tombol ini bersifat opsional, tetapi bisa ditambahkan jika ada URL aslinya
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔗 Lihat Gambar",
                                url: imageUrl, // Menggunakan URL gambar itu sendiri
                                merchant_url: ""
                            })
                        }
                    ]
                })
            });
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
                    forwardingScore: 256,
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `🔎 *Hasil pencarian untuk:* ${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: `Maelyn API`
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...cards]
                        })
                    })
                }
            }
        }, { userJid: m.chat, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch (e) {
        console.error("Error:", e);
        await conn.sendMessage(m.chat, { text: "Terjadi kesalahan! Coba lagi nanti." });
    }
};

handler.help = ['gimage <query>'];
handler.tags = ['tools'];
handler.command = /^(gimage|image|gambar|cariimage)$/i;

export default handler;