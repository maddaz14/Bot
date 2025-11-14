import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import similarity from 'similarity';

// Objek untuk menyimpan status mode toko per grup di memori (sebagai cache)
let storeModeCache = {};
const productPath = './src/product.json';
const storeStatusPath = './src/store.json'; // Path baru untuk menyimpan status store
const productDir = './src/product';

// Pastikan direktori produk ada
if (!fs.existsSync(productDir)) {   
    fs.mkdirSync(productDir, { recursive: true });   
}   

// --- Fungsi utilitas untuk membaca dan menulis data ---
async function readProductData() {   
    try {   
        const data = await fsPromises.readFile(productPath, 'utf8');   
        return JSON.parse(data);   
    } catch (error) {   
        await fsPromises.writeFile(productPath, '{}', 'utf8');   
        return {};   
    }   
}   
  
async function writeProductData(data) {   
    await fsPromises.writeFile(productPath, JSON.stringify(data, null, 2), 'utf8');   
}   

async function readStoreStatus() {
    try {
        const data = await fsPromises.readFile(storeStatusPath, 'utf8');
        storeModeCache = JSON.parse(data);
        return storeModeCache;
    } catch (error) {
        // Buat file jika tidak ada dan kembalikan objek kosong
        await fsPromises.writeFile(storeStatusPath, '{}', 'utf8');
        storeModeCache = {};
        return {};
    }
}

async function writeStoreStatus(data) {
    storeModeCache = data;
    await fsPromises.writeFile(storeStatusPath, JSON.stringify(data, null, 2), 'utf8');
}

let handler = async (m, { conn, args, usedPrefix, command, groupMetadata }) => {
    let groupId = m.chat;
    
    // Panggil productData dan storeStatus di awal handler agar selalu terupdate
    let productData = await readProductData();
    await readStoreStatus();

    // Inisialisasi status mode toko untuk grup ini jika belum ada
    if (typeof storeModeCache[groupId] === 'undefined') {
      storeModeCache[groupId] = false;
      await writeStoreStatus(storeModeCache);
    }

    // --- Command handler: store (untuk mengontrol mode) ---
    if (command === 'store') {
        if (!m.isGroup) {
          return await conn.reply(m.chat, 'Perintah ini hanya bisa digunakan di grup!', m);
        }
        
        if (!args[0]) {
            return await conn.reply(m.chat, `*Cara penggunaan:*\n\n${usedPrefix}store on (aktifkan mode)\n${usedPrefix}store off (nonaktifkan mode)`, m);
        }
        let state = args[0].toLowerCase();
        if (state === 'on') {
            storeModeCache[groupId] = true;
            await writeStoreStatus(storeModeCache);
            await conn.reply(m.chat, 'Mode pencarian produk otomatis sudah *aktif*! Sekarang kamu bisa ketik judul produk langsung untuk melihat detailnya.', m);
        } else if (state === 'off') {
            storeModeCache[groupId] = false;
            await writeStoreStatus(storeModeCache);
            await conn.reply(m.chat, 'Mode pencarian produk otomatis sudah *nonaktif*. Untuk melihat produk, gunakan perintah .product.', m);
        } else {
            await conn.reply(m.chat, 'Perintah tidak valid. Gunakan *.store on* atau *.store off*', m);
        }
        return;
    }

    // Command handler untuk Admin
    if (command === 'addlist' || command === 'dellist' || command === 'updatelist') {
        if (!productData[groupId]) productData[groupId] = [];
        if (!args[0] && (command === 'addlist' || command === 'updatelist')) {  
            await conn.reply(m.chat, `*Cara penggunaan:*\n\n${usedPrefix}addlist <judul>|<isi>|<urlfoto>\n(Atau balas/kirim gambar dengan ${usedPrefix}addlist <judul>|<isi>)\n\n${usedPrefix}updatelist <id> <judul>|<isi>\n\n${usedPrefix}dellist <id>`, m);  
            return;  
        }  
    
        // --- Logic: addlist ---  
        if (command === 'addlist') {
            await conn.sendMessage(m.chat, { react: { text: '🛒', key: m.key } });

            let judul, isi, urlFoto = null;  
            let q = m.quoted ? m.quoted : m;
            
            // Perbaikan di sini: Menggunakan q.mediaType untuk deteksi yang lebih baik
            let mime = (q.msg || q).mimetype || q.mediaType || '';
            
            // Log mimetype untuk debugging
            console.log('MIME type yang terdeteksi:', mime);

            if (/image/.test(mime)) {
                const fullText = m.text;
                const parts = fullText.split('|');
                
                if (parts.length < 2) {
                    await conn.reply(m.chat, 'Format salah! Jika mereply/mengirim gambar, gunakan format: <judul>|<isi>', m);
                    return;
                }
                
                judul = parts[0].replace(usedPrefix + command, '').trim();
                isi = parts.slice(1).join('|').trim();

                await conn.reply(m.chat, 'Proses gambar dulu ya, tunggu bentar, Senpai...', m);
                let media = await q.download();
                if (!media) {
                    await conn.reply(m.chat, 'Gambar gak bisa diunduh, coba lagi!', m);
                    return;
                }
                try {
                    urlFoto = await quaxUpload(media);
                    // Log URL gambar yang didapat
                    console.log('URL Gambar:', urlFoto);
                } catch (e) {
                    await conn.reply(m.chat, 'Gagal mengunggah gambar ke Qu.ax.', m);
                    console.error('Qu.ax upload error:', e);
                    return;
                }
            } else {   
                const parts = args.join(' ').split('|');  
                if (parts.length < 2) {  
                    await conn.reply(m.chat, 'Format salah! Pake <judul>|<isi>[|urlfoto] ya!', m);  
                    return;  
                }  
                judul = parts[0];  
                isi = parts[1];  
                urlFoto = parts[2] || null;
            }  
    
            if (!judul || !isi) {  
                await conn.reply(m.chat, 'Judul atau isi tidak boleh kosong!', m);  
                return;  
            }  
    
            productData[groupId].push({ judul, isi, imageUrl: urlFoto || null });
            await writeProductData(productData);  

            if (urlFoto) {
                await conn.reply(m.chat, `✅ Produk *"${judul}"* berhasil ditambah dengan gambar!\n\nURL Gambar: ${urlFoto}`, m);
            } else {
                await conn.reply(m.chat, `✅ Produk *"${judul}"* berhasil ditambah tanpa gambar.`, m);
            }
        }   
          
        // --- Logic: dellist ---  
        if (command === 'dellist') {   
            if (!args[0]) {   
                await conn.reply(m.chat, `Cara pake: ${usedPrefix + command} <id> (contoh: ${usedPrefix + command} 1)`, m);   
                return;   
            }  
            let id = parseInt(args[0]) - 1;   
            if (id < 0 || id >= productData[groupId].length) {   
                await conn.reply(m.chat, 'ID produk gak valid!', m);   
                return;   
            }  
            let produk = productData[groupId][id];   
            productData[groupId].splice(id, 1);   
            await writeProductData(productData);   
            await conn.reply(m.chat, 'Produk udah dihapus, Senpai! 🚫', m);   
        }   
          
        // --- Logic: updatelist ---  
        if (command === 'updatelist') {   
            if (!args[0]) {
                return await conn.reply(m.chat, 'ID produk tidak boleh kosong!', m);
            }
            let id = parseInt(args[0]) - 1;
            if (isNaN(id) || id < 0 || id >= productData[groupId].length) {
                return await conn.reply(m.chat, 'ID produk tidak valid!', m);
            }
            let [judul, isi] = args.slice(1).join(' ').split('|');
            if (!judul || !isi) {
                return await conn.reply(m.chat, 'Format salah! Pake <judul>|<isi> ya!', m);
            }
            if (args[1].startsWith('-add')) {
                isi = args.slice(2).join(' ');
                productData[groupId][id].isi += '\n' + isi;
            } else {
                let oldProduk = productData[groupId][id];
                if (oldProduk.imagePath && judul !== oldProduk.judul) {
                    let newImagePath = path.join(productDir, `${judul}.png`);
                    if (fs.existsSync(oldProduk.imagePath)) {
                        await fsPromises.rename(oldProduk.imagePath, newImagePath);
                    }
                    productData[groupId][id].imagePath = newImagePath;
                }
                productData[groupId][id].judul = judul;
                productData[groupId][id].isi = isi;
            }
            await writeProductData(productData);
            await conn.reply(m.chat, 'Produk udah diupdate, Senpai! 📝', m);
        }
    }

    // --- Command: product (for all users) ---
    if (command === 'product') {   
        if (productData[groupId].length === 0) {   
            return await conn.reply(m.chat, 'Belum ada produk di grup ini, Senpai! Tambah dulu pake .addlist ya!', m);   
        }   
    
        if (args.length > 0) {   
            let id = parseInt(args[0]) - 1;   
            if (isNaN(id) || id < 0 || id >= productData[groupId].length) {   
                await conn.reply(m.chat, `ID produk gak valid, Senpai! Pake angka dari 1 sampe ${productData[groupId].length}, atau ketik ${usedPrefix}product buat liat daftar!`, m);   
                return;   
            }  
            let produk = productData[groupId][id];
            let teks = produk.isi;
            if (produk.imageUrl) {   
                await conn.sendMessage(m.chat, { image: { url: produk.imageUrl }, caption: teks }, { quoted: m });   
            } else {   
                await conn.reply(m.chat, teks, m);   
            }   
        } else {
            let rows = productData[groupId].map((item, index) => {  
                let description = item.isi.length > 50 ? item.isi.substring(0, 50) + '...' : item.isi;  
                return {  
                    header: item.judul,   
                    title: `ID: ${index + 1}`,  
                    description: description,   
                    id: `${usedPrefix}product ${index + 1}`  
                };  
            });  
              
            let firstProductWithImage = productData[groupId].find(item => item.imageUrl);  
            let displayImageUrl = firstProductWithImage?.imageUrl || 'https://telegra.ph/file/8904062b17875a2ab2984.jpg';  
    
            await conn.sendMessage(m.chat, {  
                product: {  
                    productImage: { url: displayImageUrl },  
                    productId: '9999999999999999',  
                    title: 'Daftar Produk Grup',  
                    description: 'Pilih produk dari daftar di bawah ini',  
                    currencyCode: 'IDR',  
                    priceAmount1000: '0',   
                    retailerId: 'productlist',  
                    url: 'https://wa.me/6285147777105',   
                    productImageCount: 1  
                },  
                businessOwnerJid: conn.user.jid,   
                caption: '*Daftar Produk Tersedia:*\n\nPilih produk yang ada, Senpai:',  
                title: 'Menu Produk',  
                subtitle: 'Pilih Produk',  
                footer: global.wm || ' ',  
                interactiveButtons: [  
                    {  
                        name: 'single_select',  
                        buttonParamsJson: JSON.stringify({  
                            title: 'Pilih Produk',  
                            sections: [  
                                {  
                                    title: 'Daftar Produk',  
                                    highlight_label: 'Pilih produk',  
                                    rows: rows  
                                }  
                            ]  
                        })  
                    }  
                ],  
                hasMediaAttachment: false  
            }, { quoted: m });  
        }   
    }

};

handler.help = [
'store on/off',
'addlist <judul>|<isi>[|urlfoto] (atau reply/kirim gambar dengan <judul>|<isi>)',
'dellist <id>',
'updatelist <id> <judul>|<isi> (opsional: -add buat nambah isi)',
'product (opsional: <id>)'
];
handler.tags = ['store'];
handler.command = /^addlist|dellist|updatelist|product|store$/i;
handler.owner = false;
handler.group = true;
handler.admin = true;

export default handler;

// === FUNGSI HANDLER.BEFORE ===
handler.before = async function (m, { conn, usedPrefix }) {
    let groupId = m.chat;
    let text = m.text;
    
    // Pastikan storeModeCache sudah dimuat dari file sebelum digunakan
    await readStoreStatus();

    if (!m.isGroup || !storeModeCache[groupId] || m.isBaileys) {
        return;
    }
    
    if (text && text.startsWith(usedPrefix)) {
        return;
    }
    
    let productData = await readProductData();
    if (!productData[groupId] || productData[groupId].length === 0) {
        return;
    }
    
    let produk = null;
    let bestMatch = null;
    let highestSimilarity = 0;
    const threshold = 0.7;
    
    produk = productData[groupId].find(p => p.judul.toLowerCase() === text.toLowerCase().trim());

    if (!produk) {
        for (let p of productData[groupId]) {
            let sim = similarity(p.judul.toLowerCase(), text.toLowerCase().trim());
            if (sim > highestSimilarity && sim >= threshold) {
                highestSimilarity = sim;
                bestMatch = p;
            }
        }
        produk = bestMatch;
    }
    
    if (produk) {
        let teks = produk.isi;
        if (produk.imageUrl) {
            await conn.sendMessage(m.chat, { image: { url: produk.imageUrl }, caption: teks }, { quoted: m });
        } else {
            await conn.reply(m.chat, teks, m);
        }
    }
};

// Fungsi untuk mengunggah file ke Qu.ax
async function quaxUpload(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer) || { ext: 'bin', mime: 'application/octet-stream' };
    const form = new FormData();
    form.append('files[]', buffer, { filename: `file.${ext}`, contentType: mime });
    form.append('expiry', '30'); // 30 hari expired

    const res = await fetch('https://qu.ax/upload.php', {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
            'origin': 'https://qu.ax',
            'referer': 'https://qu.ax/'
        },
        body: form
    });

    if (!res.ok) throw new Error('Gagal menghubungi Qu.ax.');
    const json = await res.json();
    if (!json.files || !json.files[0] || !json.files[0].url) throw new Error('Respon tidak valid dari Qu.ax.');
    return json.files[0].url;
}