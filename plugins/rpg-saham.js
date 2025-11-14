import { readFileSync } from 'fs';

function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const stocks = {
    'AAPL': { name: 'Apple', price: getRandomValue(1000000, 10000000) },
    'GOOGL': { name: 'Google', price: getRandomValue(1000000, 10000000) },
    'TSLA': { name: 'Tesla', price: getRandomValue(1000000, 10000000) },
    'AMZN': { name: 'Amazon', price: getRandomValue(1000000, 10000000) }
};

function updateStockPrices() {
    setInterval(() => {
        for (let code in stocks) {
            const change = Math.random() < 0.5 ? 1.01 : 0.99;
            stocks[code].price = Math.round(stocks[code].price * change);
        }
    }, 15 * 60 * 1000);
}

function calculateProfitLoss(user, stockCode) {
    if (!user.portfolio || !user.portfolio[stockCode]) return { total: 0, percentage: 0 };
    const { initialPrice, amount } = user.portfolio[stockCode];
    const currentPrice = stocks[stockCode].price;
    if (!initialPrice || !currentPrice) return { total: 0, percentage: 0 };
    
    const totalCost = initialPrice * amount;
    const profitLossPercentage = ((currentPrice - initialPrice) / initialPrice) * 100;
    const totalValue = totalCost + (totalCost * (profitLossPercentage / 100));

    return { total: totalValue, percentage: profitLossPercentage.toFixed(2) };
}

function calculateTotal(user) {
    if (!user.portfolio) return 0;
    let total = 0;
    for (let stockCode in user.portfolio) {
        const { total: stockTotal } = calculateProfitLoss(user, stockCode);
        total += stockTotal;
    }
    return total;
}

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
    const action = args[0]?.toLowerCase();
    const stock = args[1]?.toUpperCase();
    const amount = parseInt(args[2]);
    const totalMoney = calculateTotal(user);

    if (!action) {
        const ponta = `Gunakan perintah berikut:\n\n• ${usedPrefix}saham beli [kode_saham] [jumlah]\n• ${usedPrefix}saham jual [kode_saham] [jumlah]\n\nAksi yang tersedia:\n📈 *harga*\n💼 *portofolio*\n🛒 *beli*\n💵 *jual*`;

        conn.sendMessage(m.chat, {
            document: readFileSync('./autoCreateTmp.js'),
            mimetype: 'application/pdf',
            fileName: `${global.namebot}`,
            fileLength: "999999999999",
            caption: ponta,
            footer: `${global.namebot} || ${global.author}`,
            buttons: [
                { 
                    buttonId: '.saham harga', 
                    buttonText: { displayText: '📈 Lihat Harga Saham' }, 
                    type: 1 
                },
                { 
                    buttonId: '.saham portofolio', 
                    buttonText: { displayText: '💼 Portofolio Saya' }, 
                    type: 1 
                },
                { 
                    buttonId: 'action', 
                    buttonText: { displayText: 'SAHAM' }, 
                    type: 4, 
                    nativeFlowInfo: { 
                        name: 'single_select', 
                        paramsJson: JSON.stringify({ 
                            title: 'SAHAM', 
                            sections: [
                                { 
                                    title: 'Saham Beli', 
                                    highlight_label: 'Populer', 
                                    rows: [
                                        { 
                                            header: 'Google', 
                                            title: 'Saham Google', 
                                            description: '> Saham Google, yang diperdagangkan di bawah nama Alphabet Inc. (GOOGL dan GOOG), merupakan saham perusahaan teknologi besar dengan pendapatan utama dari iklan digital melalui platform seperti Google dan YouTube. GOOGL memberikan hak suara, sementara GOOG tidak. Saham ini sering dianggap investasi jangka panjang yang menarik karena inovasi dan dominasi Google dalam industri digital.', 
                                            id: '.saham beli GOOGL',
                                        },
                                        { 
                                            header: 'Apple', 
                                            title: 'Saham Apple', 
                                            description: '> Saham Apple, diperdagangkan dengan simbol AAPL, merupakan saham perusahaan teknologi besar yang terkenal dengan produk-produk seperti iPhone, iPad, Mac, dan layanan seperti App Store dan iCloud. Apple dikenal karena stabilitas dan pertumbuhannya yang konsisten. Sahamnya dianggap sebagai investasi jangka panjang yang menarik karena inovasi dan kekuatan merek yang global.', 
                                            id: '.saham beli AAPL',
                                        },
                                        {
                                            header: 'Tesla', 
                                            title: 'Saham Tesla', 
                                            description: '> Saham Tesla, diperdagangkan dengan simbol TSLA, adalah saham perusahaan kendaraan listrik dan energi terbarukan yang dipimpin oleh Elon Musk. Tesla dikenal karena inovasi dalam mobil listrik, baterai, dan teknologi otonom. Sahamnya sering menjadi perhatian investor karena volatilitas tinggi dan potensi pertumbuhan jangka panjang di industri kendaraan listrik dan energi terbarukan.', 
                                            id: '.saham beli TSLA',
                                        },
                                        {
                                            header: 'AMZN', 
                                            title: 'Saham AMZN', 
                                            description: '> Saham Amazon, diperdagangkan dengan simbol AMZN, adalah saham perusahaan e-commerce dan teknologi global yang dikenal dengan platform belanja online, layanan cloud computing (AWS), dan produk-produk seperti Alexa. Amazon terus berkembang di berbagai sektor, termasuk hiburan dan logistik. Sahamnya dianggap sebagai investasi jangka panjang yang stabil karena diversifikasi bisnis dan dominasi pasar.', 
                                            id: '.saham beli AMZN',
                                        },
                                    ],
                                },
                                { 
                                    title: 'Saham Jual', 
                                    highlight_label: 'Populer', 
                                    rows: [
                                        { 
                                            header: 'Google', 
                                            title: 'Saham Google', 
                                            description: '> Saham Google, yang diperdagangkan di bawah nama Alphabet Inc. (GOOGL dan GOOG), merupakan saham perusahaan teknologi besar dengan pendapatan utama dari iklan digital melalui platform seperti Google dan YouTube. GOOGL memberikan hak suara, sementara GOOG tidak. Saham ini sering dianggap investasi jangka panjang yang menarik karena inovasi dan dominasi Google dalam industri digital.', 
                                            id: '.saham jual GOOGL',
                                        },
                                        { 
                                            header: 'Apple', 
                                            title: 'Saham Apple', 
                                            description: '> Saham Apple, diperdagangkan dengan simbol AAPL, merupakan saham perusahaan teknologi besar yang terkenal dengan produk-produk seperti iPhone, iPad, Mac, dan layanan seperti App Store dan iCloud. Apple dikenal karena stabilitas dan pertumbuhannya yang konsisten. Sahamnya dianggap sebagai investasi jangka panjang yang menarik karena inovasi dan kekuatan merek yang global.', 
                                            id: '.saham jual AAPL',
                                        },
                                        {
                                            header: 'Tesla', 
                                            title: 'Saham Tesla', 
                                            description: '> Saham Tesla, diperdagangkan dengan simbol TSLA, adalah saham perusahaan kendaraan listrik dan energi terbarukan yang dipimpin oleh Elon Musk. Tesla dikenal karena inovasi dalam mobil listrik, baterai, dan teknologi otonom. Sahamnya sering menjadi perhatian investor karena volatilitas tinggi dan potensi pertumbuhan jangka panjang di industri kendaraan listrik dan energi terbarukan.', 
                                            id: '.saham jual TSLA',
                                        },
                                        {
                                            header: 'AMZN', 
                                            title: 'Saham AMZN', 
                                            description: '> Saham Amazon, diperdagangkan dengan simbol AMZN, adalah saham perusahaan e-commerce dan teknologi global yang dikenal dengan platform belanja online, layanan cloud computing (AWS), dan produk-produk seperti Alexa. Amazon terus berkembang di berbagai sektor, termasuk hiburan dan logistik. Sahamnya dianggap sebagai investasi jangka panjang yang stabil karena diversifikasi bisnis dan dominasi pasar.', 
                                            id: '.saham jual AMZN',
                                        },
                                    ],
                                },
                            ],
                        }), 
                    }, 
                },
            ],
            headerType: 1,
            viewOnce: true,
            contextInfo: {
                externalAdReply: {
                    title: global.namebot,
                    body: global.author,
                    thumbnailUrl: global.thumb,
                    sourceUrl: global.myweb,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: floc });
        return;
    }

    switch (action) {
        case 'beli':
            if (!stock) return m.reply('Masukkan kode saham yang ingin dibeli.');
            if (!stocks[stock]) return m.reply('📛 Kode saham tidak ditemukan.');
            user.portfolio = user.portfolio || {};
            if (user.portfolio[stock]) return m.reply('⛔ Kamu sudah memiliki saham ini dan tidak bisa membeli lagi.');
            const totalBuy = stocks[stock].price;
            if (user.money < totalBuy) return m.reply('💸 Uangmu tidak cukup.');
            user.money -= totalBuy;
            user.portfolio[stock] = { amount: 1, initialPrice: stocks[stock].price };
            return m.reply(`🛒 Kamu membeli *saham ${stocks[stock].name}* seharga 💰 *${totalBuy.toLocaleString()}*.`);

        case 'jual':
            if (!stock) return m.reply('Masukkan kode saham yang ingin dijual.');
            if (!stocks[stock]) return m.reply('📛 Kode saham tidak ditemukan.');
            if (!user.portfolio || !user.portfolio[stock]) {
                return m.reply('⛔ Kamu tidak memiliki saham ini untuk dijual.');
            }
            const totalSell = stocks[stock].price;
            user.money += totalSell;
            delete user.portfolio[stock];
            return m.reply(`💵 Kamu menjual *saham ${stocks[stock].name}* seharga 💰 *${totalSell.toLocaleString()}*.`);

        case 'harga':
            let priceList = '📈 *Harga Saham Saat Ini:*\n\n';
            for (let code in stocks) {
                priceList += `- 🏢 *${code}* (${stocks[code].name}): 💰 ${stocks[code].price.toLocaleString()}\n`;
            }
            conn.sendMessage(m.chat, {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/pdf',
                fileName: `${global.namebot}`,
                fileLength: "999999999999",
                caption: priceList.trim(),
                footer: `${global.namebot} || ${global.author}`,
                buttons: [
                    { 
                        buttonId: '.saham harga', 
                        buttonText: { displayText: '📈 Lihat Harga Saham' }, 
                        type: 1 
                    },
                    { 
                        buttonId: '.saham portofolio', 
                        buttonText: { displayText: '💼 Portofolio Saya' }, 
                        type: 1 
                    },
                    { 
                        buttonId: 'action', 
                        buttonText: { displayText: 'SAHAM' }, 
                        type: 4, 
                        nativeFlowInfo: { 
                            name: 'single_select', 
                            paramsJson: JSON.stringify({ 
                                title: 'SAHAM', 
                                sections: [
                                    { 
                                        title: 'Saham Beli', 
                                        highlight_label: 'Populer', 
                                        rows: [
                                            { 
                                                header: 'Google', 
                                                title: 'Saham Google', 
                                                description: '> Saham Google, yang diperdagangkan di bawah nama Alphabet Inc. (GOOGL dan GOOG), merupakan saham perusahaan teknologi besar dengan pendapatan utama dari iklan digital melalui platform seperti Google dan YouTube. GOOGL memberikan hak suara, sementara GOOG tidak. Saham ini sering dianggap investasi jangka panjang yang menarik karena inovasi dan dominasi Google dalam industri digital.', 
                                                id: '.saham beli GOOGL',
                                            },
                                            { 
                                                header: 'Apple', 
                                                title: 'Saham Apple', 
                                                description: '> Saham Apple, diperdagangkan dengan simbol AAPL, merupakan saham perusahaan teknologi besar yang terkenal dengan produk-produk seperti iPhone, iPad, Mac, dan layanan seperti App Store dan iCloud. Apple dikenal karena stabilitas dan pertumbuhannya yang konsisten. Sahamnya dianggap sebagai investasi jangka panjang yang menarik karena inovasi dan kekuatan merek yang global.', 
                                                id: '.saham beli AAPL',
                                            },
                                            {
                                                header: 'Tesla', 
                                                title: 'Saham Tesla', 
                                                description: '> Saham Tesla, diperdagangkan dengan simbol TSLA, adalah saham perusahaan kendaraan listrik dan energi terbarukan yang dipimpin oleh Elon Musk. Tesla dikenal karena inovasi dalam mobil listrik, baterai, dan teknologi otonom. Sahamnya sering menjadi perhatian investor karena volatilitas tinggi dan potensi pertumbuhan jangka panjang di industri kendaraan listrik dan energi terbarukan.', 
                                                id: '.saham beli TSLA',
                                            },
                                            {
                                                header: 'AMZN', 
                                                title: 'Saham AMZN', 
                                                description: '> Saham Amazon, diperdagangkan dengan simbol AMZN, adalah saham perusahaan e-commerce dan teknologi global yang dikenal dengan platform belanja online, layanan cloud computing (AWS), dan produk-produk seperti Alexa. Amazon terus berkembang di berbagai sektor, termasuk hiburan dan logistik. Sahamnya dianggap sebagai investasi jangka panjang yang stabil karena diversifikasi bisnis dan dominasi pasar.', 
                                                id: '.saham beli AMZN',
                                            },
                                        ],
                                    },
                                    { 
                                        title: 'Saham Jual', 
                                        highlight_label: 'Populer', 
                                        rows: [
                                            { 
                                                header: 'Google', 
                                                title: 'Saham Google', 
                                                description: '> Saham Google, yang diperdagangkan di bawah nama Alphabet Inc. (GOOGL dan GOOG), merupakan saham perusahaan teknologi besar dengan pendapatan utama dari iklan digital melalui platform seperti Google dan YouTube. GOOGL memberikan hak suara, sementara GOOG tidak. Saham ini sering dianggap investasi jangka panjang yang menarik karena inovasi dan dominasi Google dalam industri digital.', 
                                                id: '.saham jual GOOGL',
                                            },
                                            { 
                                                header: 'Apple', 
                                                title: 'Saham Apple', 
                                                description: '> Saham Apple, diperdagangkan dengan simbol AAPL, merupakan saham perusahaan teknologi besar yang terkenal dengan produk-produk seperti iPhone, iPad, Mac, dan layanan seperti App Store dan iCloud. Apple dikenal karena stabilitas dan pertumbuhannya yang konsisten. Sahamnya dianggap sebagai investasi jangka panjang yang menarik karena inovasi dan kekuatan merek yang global.', 
                                                id: '.saham jual AAPL',
                                            },
                                            {
                                                header: 'Tesla', 
                                                title: 'Saham Tesla', 
                                                description: '> Saham Tesla, diperdagangkan dengan simbol TSLA, adalah saham perusahaan kendaraan listrik dan energi terbarukan yang dipimpin oleh Elon Musk. Tesla dikenal karena inovasi dalam mobil listrik, baterai, dan teknologi otonom. Sahamnya sering menjadi perhatian investor karena volatilitas tinggi dan potensi pertumbuhan jangka panjang di industri kendaraan listrik dan energi terbarukan.', 
                                                id: '.saham jual TSLA',
                                            },
                                            {
                                                header: 'AMZN', 
                                                title: 'Saham AMZN', 
                                                description: '> Saham Amazon, diperdagangkan dengan simbol AMZN, adalah saham perusahaan e-commerce dan teknologi global yang dikenal dengan platform belanja online, layanan cloud computing (AWS), dan produk-produk seperti Alexa. Amazon terus berkembang di berbagai sektor, termasuk hiburan dan logistik. Sahamnya dianggap sebagai investasi jangka panjang yang stabil karena diversifikasi bisnis dan dominasi pasar.', 
                                                id: '.saham jual AMZN',
                                            },
                                        ],
                                    },
                                ],
                            }), 
                        }, 
                    },
                ],
                headerType: 1,
                viewOnce: true,
                contextInfo: {
                    externalAdReply: {
                        title: global.namebot,
                        body: global.author,
                        thumbnailUrl: global.thumb,
                        sourceUrl: global.myweb,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: floc });
            return;

        case 'portofolio':
            if (!user.portfolio || Object.keys(user.portfolio).length === 0) {
                return m.reply('💼 Kamu belum memiliki saham.');
            }
            let portfolioList = '💼 *Portofolio Saham:*\n\n';
            for (let code in user.portfolio) {
                const stockData = user.portfolio[code];
                const stockInfo = stocks[code];
                if (!stockInfo) {
                    portfolioList += `- 🏢 *${code}*: Data saham tidak ditemukan.\n\n`;
                    continue;
                }
                const { total, percentage } = calculateProfitLoss(user, code);
                portfolioList += `- 🏢 *${code}* (${stockInfo.name}):\n  💰 Harga Beli: ${stockData.initialPrice?.toLocaleString() || 'Tidak diketahui'}\n  📈 Keuntungan: ${percentage}%\n  💵 Total: ${total.toLocaleString()}\n\n`;
            }
            conn.sendMessage(m.chat, {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/vnd.ms-powerpoint',
                fileName: `${global.namebot}`,
                fileLength: "999999999999",
                caption: portfolioList.trim(),
                footer: `${global.namebot} || ${global.author}`,
                buttons: [
                    { buttonId: `${usedPrefix}saham harga`, buttonText: { displayText: '📈 Lihat Harga Saham' }, type: 1 }
                ],
                headerType: 1,
                viewOnce: true,
                contextInfo: {
                    externalAdReply: {
                        title: global.namebot,
                        body: global.author,
                        thumbnailUrl: global.thumb,
                        sourceUrl: global.myweb,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: floc });
            return;
    }
};

updateStockPrices();

handler.help = ['saham'];
handler.tags = ['rpg'];
handler.command = /^(saham)$/i;
handler.limit = 5;
handler.register = true;
handler.group = true;
export default handler;