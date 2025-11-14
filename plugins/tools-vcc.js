import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    // Objek fkontak untuk tampilan pesan yang dikutip
    const fkontak = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: '0@s.whatsapp.net',
            fromMe: false,
            id: 'Halo',
        },
        message: {
            conversation: `💳 VCC Generator ${global.namebot || 'Bot'} ✨`,
        },
    };

    let [type, countText] = args;
    let count = parseInt(countText);

    // Validasi input
    if (!type) {
        return conn.reply(
            m.chat,
            `Format salah!\nContoh: *${usedPrefix + command} Visa 3*\n\nJenis yang tersedia: *Visa*, *Mastercard*`,
            m,
            { quoted: fkontak }
        );
    }

    type = type.toLowerCase();
    if (!['visa', 'mastercard'].includes(type)) {
        return conn.reply(
            m.chat,
            `Jenis VCC tidak valid. Pilih antara *Visa* atau *Mastercard*.\nContoh: *${usedPrefix + command} Visa 3*`,
            m,
            { quoted: fkontak }
        );
    }

    if (isNaN(count) || count <= 0) {
        count = 1; // Default jika jumlah tidak valid
    }
    if (count > 50) {
        return conn.reply(
            m.chat,
            `Jumlah VCC maksimal adalah 50. Kamu meminta ${count}.`,
            m,
            { quoted: fkontak }
        );
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/tools/vcc-generator?type=${type}&count=${count}`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.status) {
            throw `Gagal mendapatkan data VCC dari API: ${json.message || 'Unknown error'}`;
        }

        const vccData = json.data;
        let captionText = `✨ *Hasil Generate VCC (${type.toUpperCase()} - ${json.count} buah)* ✨\n\n`;

        const vccRows = vccData.map((vcc, index) => {
            captionText += `*VCC ${index + 1}:*\n`;
            captionText += `  Nomor Kartu: *${vcc.cardNumber}*\n`;
            captionText += `  Kadaluarsa:  *${vcc.expirationDate}*\n`;
            captionText += `  Nama Pemegang: *${vcc.cardholderName}*\n`;
            captionText += `  CVV:         *${vcc.cvv}*\n\n`;

            return {
                header: `💳 VCC ${index + 1} (${type.toUpperCase()})`,
                title: `Nomor: ${vcc.cardNumber}`,
                description: `Kadaluarsa: ${vcc.expirationDate} | CVV: ${vcc.cvv}`,
                id: `.vccdetail ${vcc.cardNumber}` // ID dummy untuk opsi ini, bisa digunakan untuk melihat detail per VCC jika diperlukan
            };
        });

        // Hapus dua baris terakhir (pemisah kosong) jika ada VCC
        if (vccData.length > 0) {
            captionText = captionText.trim();
        }

        // Tentukan gambar untuk product message
        const imageUrl = 'https://telegra.ph/file/5e7b2b4e2f8d9b0a7c4a1.jpg'; // Gambar VCC generik

        // Definisikan tombol interaktif sebagai list
        const interactiveButtons = [
            {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Pilih Aksi VCC',
                    sections: [
                        {
                            title: 'Opsi Lain',
                            highlight_label: 'Pilih Satu',
                            rows: [
                                {
                                    header: '🔄 Generate VCC Baru',
                                    title: 'Buat VCC lainnya',
                                    description: `Ulangi proses generate VCC.`,
                                    id: `${usedPrefix}${command} ${type} 1` // Kembali ke command awal dengan jenis VCC
                                },
                                {
                                    header: 'ℹ️ Cara Penggunaan',
                                    title: 'Pelajari cara pakai VCC generator',
                                    description: `Panduan penggunaan ${usedPrefix}${command}.`,
                                    id: `${usedPrefix}help ${command}` // Asumsi ada command help
                                }
                            ]
                        },
                        {
                            title: 'Detail VCC (Pilih salah satu)',
                            highlight_label: 'Lihat Detail',
                            rows: vccRows // Baris-baris VCC yang dihasilkan
                        }
                    ]
                })
            }
        ];

        // Dapatkan JID owner pertama dari global.owner
        const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net';

        await conn.sendMessage(m.chat, {
            product: {
                productImage: { url: imageUrl },
                productId: '9999999999999999', // ID dummy
                title: `VCC ${type.toUpperCase()} Generator`,
                description: `Jumlah: ${json.count} | Status: Berhasil`,
                currencyCode: 'USD', // VCC biasanya USD
                priceAmount1000: '0',
                retailerId: `vcc-gen-${type}`,
                url: 'https://api.siputzx.my.id', // URL API atau link bot
                productImageCount: 1,
            },
            businessOwnerJid: primaryOwnerJid,
            caption: captionText,
            title: `Hasil VCC Generate`,
            subtitle: `Generated by ${global.namebot || 'Bot'}`,
            footer: `> © ${global.namebot || 'Bot'} 2025`,
            interactiveButtons: interactiveButtons,
            hasMediaAttachment: false,
        }, { quoted: fkontak });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('Error VCC Generator:', e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        conn.reply(m.chat, `Terjadi kesalahan saat menggenerate VCC:\n${e}`, m, { quoted: fkontak });
    }
};

handler.help = ['vccgen <type> <count>', 'vcc <type> <count>'];
handler.tags = ['tools'];
handler.command = /^(vccgen|vcc)$/i;
handler.limit = true; // Mungkin perlu limit karena ini API eksternal
handler.premium = false; // Atau true jika ini fitur premium
handler.register = true;

export default handler;