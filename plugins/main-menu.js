import fs from 'fs'
import moment from 'moment-timezone'
// Kita tidak perlu import runtime dari luar lagi

// --- FUNGSI UTILITY (PENGGANTI myfunction.js) ---

/**
 * Fungsi untuk menghitung uptime (waktu aktif) bot dalam format yang dapat dibaca.
 * @param {number} seconds - Total detik uptime.
 * @returns {string} Format waktu yang dibaca manusia.
 */
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " hari, " : " hari, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " jam, " : " jam, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " menit, " : " menit, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " detik" : " detik") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Main handler function to determine the platform and call the appropriate menu handler.
 * @param {object} m - The message object.
 * @param {object} params - Destructured parameters from the command.
 */
const handler = async (m, { conn, args, usedPrefix }) => {
    if (m.platform === 'telegram') {
        return handleTelegramMenu(m, { conn, args, usedPrefix });
    } else {
        return handleWhatsAppMenu(m, { conn, args, usedPrefix });
    }
};

// --- NEW DEFAULT MENU TEMPLATE ---
const defaultMenu = {
  before: `
*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

Halo *%name*, saya *${global.botname}*, %greeting

╭──︿︿︿︿︿*
┊ ‹‹ *Halo* :: *%name*
┊•*⁀➷ °⭒⭒⭒ *【 ${global.botname} 】*
┊🍬 [ *Mode* :: *Publik* 
┊📚 [ *Baileys* :: *Multi Device* 
┊⏱ [ *Waktu Aktif* :: *%uptime* 
┊👤 [ *Total Pengguna* :: *%totalreg* 
╰─────────
%readmore
  `.trimStart(),
  after: `> [ ✰ ] ${global.botname}`,
}
// ---------------------------------

/**
 * Handles the menu display for WhatsApp platform.
 * @param {object} m - The message object.
 * @param {object} params - Destructured parameters.
 */
const handleWhatsAppMenu = async (m, { conn, args, usedPrefix }) => {
    const user = global.db.data.users[m.sender];
    const setting = global.db.data.settings?.default || {};
    const menuMode = setting.menuMode || 'gambar';

    if (!user?.registered) {
        return sendRegistrationMenu(m, conn);
    }

    const sender = m.sender.replace(/[^0-9]/g, '');
    const isDev = global.owner?.some(([number]) => number === sender);
    const isPremium = user.premium;
    const tagArg = (args[0] || '').toLowerCase();
    
    const allPlugins = Object.values(global.plugins).filter(p => !p.disabled && p.help);
    const allTags = [...new Set(allPlugins.flatMap(p => p.tags || []))].sort();
    
    const name = m.pushName || 'User';
    const status = isDev
        ? '👑 𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁'
        : global.db.data.settings?.[conn.user.jid]?.moderator?.includes(m.sender)
            ? '⚡ 𝙼𝙾𝙳𝙴𝚁𝙰𝚃𝙾𝚁'
            : isPremium
                ? '💎 𝙿𝚁𝙴𝙼𝙸𝚄𝙼'
                : '❌ 𝙵𝚁𝙴𝙴';

    let caption = createTemplatedDashboardCaption(name, user, isDev, isPremium, conn, m, defaultMenu);

    // --- LOGIKA UTAMA PERUBAHAN ADA DI SINI ---
    if (tagArg && tagArg !== 'all' && allTags.includes(tagArg)) {
        const matchedPlugins = allPlugins.filter(p => (p.tags || []).includes(tagArg));
        let commands;

        // KONDISI KHUSUS UNTUK TAG 'CLAN'
        if (tagArg === 'clan') {
            // Ambil seluruh teks help untuk tag 'clan'
            commands = matchedPlugins.flatMap(p => p.help); 
        } else {
            // Ambil hanya kata pertama dari help untuk tag lainnya
            commands = matchedPlugins.flatMap(p => p.help).map(cmd => cmd.split(' ')[0]);
        }
        
        if (commands.length > 0) {
            caption += `\n` + createFeaturesCaptionForTag(tagArg.toUpperCase(), commands, usedPrefix);
        } else {
            return m.reply(`❌ Tidak ada menu tersedia untuk tag *${tagArg}*`);
        }
    } else if (tagArg === 'all') {
        let allFeaturesCaption = ``;
        for (const tag of allTags) {
            const matchedPlugins = allPlugins.filter(p => (p.tags || []).includes(tag));
            let commands;

            if (tag === 'clan') {
                commands = matchedPlugins.flatMap(p => p.help);
            } else {
                commands = matchedPlugins.flatMap(p => p.help).map(cmd => cmd.split(' ')[0]);
            }
            
            if (commands.length > 0) {
                allFeaturesCaption += `\n` + createFeaturesCaptionForTag(tag.toUpperCase(), commands, usedPrefix);
            }
        }
        caption += allFeaturesCaption;
    } else if (tagArg) {
        return m.reply(`❌ 𝚃𝚊𝚐 *${tagArg}* 𝚝𝚒𝚍𝚊𝚔 𝚍𝚒𝚝𝚎𝚖𝚞𝚔𝚊𝚗!\n𝚂𝚒𝚕𝚊𝚔𝚊𝚗 𝚙𝚒𝚕𝚒𝚑: ${allTags.map(t => `*${t}*`).join(', ')}`);
    } else {
        caption += `\n_「 Ketuk Tombol Di Bawah Untuk Melihat Fitur! 」_`
    }
    
    // Append the 'after' text only if it's not a specific tag menu and the template exists
    if (!tagArg) {
         caption += `\n${defaultMenu.after}`
    }

    const textOnlyCaption = caption + `\n\n` + createTagsSection(allTags, usedPrefix);
    const interactiveButtonList = createInteractiveButtons(allTags);
    const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net';
    const botName = global.botname;

    switch (menuMode) {
        case 'button':
            return conn.sendMessage(m.chat, {
                product: {
                    productImage: { url: global.foto},
                    productId: '9999999999999999',
                    title: `${botName} - Dashboard`,
                    description: `Halo ${name}! Gambar Utama Menu Bot`,
                    currencyCode: 'IDR',
                    priceAmount1000: '9999999999',
                    retailerId: 'menu_dashboard',
                    url: global.web,
                    productImageCount: 1
                },
                businessOwnerJid: primaryOwnerJid,
                caption: caption,
                title: '✨ Pilih Kategori Menu ✨',
                subtitle: `Halo, ${name}! | Status: ${status}`,
                footer: `> © ${botName} 2025`,
                interactiveButtons: [interactiveButtonList],
                showAdAttribution: true
            }, { quoted: m });
        case 'gif':
            return conn.sendMessage(m.chat, {
                video: { url: 'https://files.catbox.moe/yqlyjt.mp4' },
                gifPlayback: true,
                caption: caption,
                contextInfo: { mentionedJid: [m.sender] },
                title: '✨ Pilih Kategori Menu ✨',
                subtitle: `Halo, ${name}! | Status: ${status}`,
                footer: `> © ${botName} 2025`,
                interactiveButtons: [interactiveButtonList],
                headerType: 4,
                showAdAttribution: true
            }, { quoted: m });
        case 'gambar':
            const imageBuffer = await (await fetch(global.foto || 'https://files.catbox.moe/0o03p5.jpg')).buffer();
            return conn.sendMessage(m.chat, {
                image: imageBuffer,
                caption: textOnlyCaption,
                contextInfo: { mentionedJid: [m.sender] },
                showAdAttribution: true
            }, { quoted: m });
        case 'text':
            return conn.sendMessage(m.chat, {
                text: textOnlyCaption,
                contextInfo: { mentionedJid: [m.sender] },
                showAdAttribution: true
            }, { quoted: m });
        default:
            return m.reply("Mode menu tidak valid!");
    }
};

/**
 * Handles the menu display for Telegram platform.
 * @param {object} m - The message object.
 * @param {object} params - Destructured parameters.
 */
const handleTelegramMenu = async (m, { conn, args }) => {
    const userId = m.from?.id;
    const isOwner = global.config?.owner?.includes(userId) || false;
    const role = isOwner ? 'Developer' : 'User';
    
    let command = m.text?.startsWith('/') ? m.text.split(' ')[0] : m.text;
    let currentPage = parseInt(args[1]) || 1;

    const allPlugins = Object.values(global.plugins).filter(p => !p.disabled && p.help);
    const allTags = [...new Set(allPlugins.flatMap(p => p.tags || []))].sort();

    if (command === '/menu_all' || command.startsWith('/menu_')) {
        let menuTitle = '';
        let commandsByTag = [];

        if (command === '/menu_all') {
            menuTitle = 'Semua Menu';
            for (const tag of allTags) {
                const pluginsByTag = allPlugins.filter(p => (p.tags || []).includes(tag));
                let commands;
                if (tag === 'clan') {
                    commands = pluginsByTag.flatMap(p => p.help).map(cmd => `/${cmd}`);
                } else {
                    commands = pluginsByTag.flatMap(p => p.help).map(cmd => `/${cmd.split(' ')[0]}`);
                }
                commandsByTag.push({
                    tag: tag.charAt(0).toUpperCase() + tag.slice(1),
                    commands: commands
                });
            }
        } else {
            const tag = command.replace('/menu_', '');
            menuTitle = tag.charAt(0).toUpperCase() + tag.slice(1);
            if (allTags.includes(tag)) {
                const pluginsByTag = allPlugins.filter(p => (p.tags || []).includes(tag));
                let commands;
                if (tag === 'clan') {
                    commands = pluginsByTag.flatMap(p => p.help).map(cmd => `/${cmd}`);
                } else {
                    commands = pluginsByTag.flatMap(p => p.help).map(cmd => `/${cmd.split(' ')[0]}`);
                }
                commandsByTag.push({
                    tag: menuTitle,
                    commands: commands
                });
            }
        }
        
        const totalPages = Math.ceil(commandsByTag.length / 15);
        const startIndex = (currentPage - 1) * 15;
        const pageCommands = commandsByTag.slice(startIndex, startIndex + 15);

        let fullTextMessage = `╭──❍ 𝙸𝚗𝚏𝚘 𝙿𝚎𝚗𝚐𝚐𝚞𝚗𝚊\n`
            + `│ ⿻ 𝙽𝚊𝚖𝚊: ${m.from.first_name || 'User'}\n`
            + `╰──────────────\n`
            + `▰▰ 𝗠𝗲𝗻𝘂: ${menuTitle} ▰▰\n`
            + `𝗣𝗮𝚐𝚎: ${currentPage} of ${totalPages}\n\n`;

        for (const group of pageCommands) {
            fullTextMessage += `▰▰ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${group.tag.toUpperCase()} ▰▰\n`
            for (const cmd of group.commands) {
                fullTextMessage += `  ├─ ${cmd}\n`
            }
            fullTextMessage += '\n'
        }

        const buttons = createPaginationButtons(currentPage, totalPages, command);

        return conn.sendMessage(m.chat.id, fullTextMessage, {
            reply_markup: buttons,
            reply_to_message_id: m.message_id
        });
    } else {
        const captionMessage = `╭──❍ 𝙸𝚗𝚏𝚘 𝙿𝚎𝚗𝚐𝚐𝚞𝚗𝚊\n`
            + `│ ⿻ 𝙽𝚊𝚖𝚊: ${m.from.first_name || 'User'}\n`
            + `│ ⿻ 𝚂𝚝𝚊𝚝𝚞𝚜: ${isOwner ? 'Developer' : 'Pengguna'}\n`
            + `│ ⿻ 𝚁𝚘le: ${role}\n`
            + `╰──────────────\n\n`
            + `Silahkan pilih menu di bawah ini untuk melihat daftar perintah.`;
    
        const menuButtons = createTelegramMainButtons(allPlugins);
        const photoUrl = global.fotorpg; 
        
        return conn.sendPhoto(m.chat.id, photoUrl, {
            caption: captionMessage,
            parse_mode: 'Markdown',
            reply_markup: menuButtons
        });
    }
};

/**
 * Handles Telegram callback queries for menu navigation.
 * @param {object} params - Destructured parameters.
 */
handler.callback = async ({ conn, callback_query }) => {
    const { id, from, message, data } = callback_query;
    const { chat, message_id } = message;

    if (data === 'menunoop') {
        return conn.answerCallbackQuery(id, { text: 'Current page indicator', show_alert: false });
    }

    const [command, pageStr] = data.split(' ');
    const pageNum = parseInt(pageStr) || 1;
    
    // Create a fake message object to pass to the handler
    const fakeMessage = {
        from: from,
        chat: { id: chat.id },
        message_id: message_id,
        text: command,
        platform: 'telegram'
    };
    
    const fakeArgs = [command.replace('/menu_', ''), pageNum];

    // Re-use the existing handler logic for consistency
    try {
        await handleTelegramMenu(fakeMessage, { conn, args: fakeArgs });
        await conn.answerCallbackQuery(id, { text: `Switched to page ${pageNum}`, show_alert: false });
    } catch (e) {
        console.error("Error in callback handler:", e);
        // Fallback or error message
        await conn.answerCallbackQuery(id, { text: 'An error occurred. Please try again.', show_alert: true });
    }
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS (FUNGSI BANTUAN)
// -----------------------------------------------------------------------------

/**
 * Creates the dashboard caption text for WhatsApp using a template.
 * @param {string} name - User's name.
 * @param {object} user - User data object.
 * @param {boolean} isDev - Is the user a developer?
 * @param {boolean} isPremium - Is the user a premium user?
 * @param {object} conn - Connection object.
 * @param {object} m - Message object.
 * @param {object} template - The menu template object with 'before' and 'after' properties.
 * @returns {string} The formatted caption string.
 */
function createTemplatedDashboardCaption(name, user, isDev, isPremium, conn, m, template) {
    const totalreg = Object.keys(global.db.data.users).length;
    
    // Menggunakan fungsi runtime yang sudah digabungkan
    const uptime = runtime(process.uptime()); 
    
    // Logika sapaan yang diminta
    var hour = moment().tz('Asia/Jakarta').hour();
    var greetingMessage;
    switch(hour){
      case 0: greetingMessage = 'semoga malammu indah 🌙'; break;
      case 1: greetingMessage = 'semoga malammu tenang 💤'; break;
      case 2: greetingMessage = 'semoga malammu sepi 🦉'; break;
      case 3: greetingMessage = 'semoga pagi ini indah ✨'; break;
      case 4: greetingMessage = 'semoga pagi ini cerah 💫'; break;
      case 5: greetingMessage = 'semoga pagi ini damai 🌅'; break;
      case 6: greetingMessage = 'semoga pagi ini menyegarkan 🌄'; break;
      case 7: greetingMessage = 'semoga pagi ini ceria 🌅'; break;
      case 8: greetingMessage = 'semoga harimu bersinar 💫'; break;
      case 9: greetingMessage = 'semoga harimu menyenangkan ✨'; break;
      case 10: greetingMessage = 'semoga harimu baik 🌞'; break;
      case 11: greetingMessage = 'semoga harimu lancar 🌨'; break;
      case 12: greetingMessage = 'semoga harimu sejuk ❄'; break;
      case 13: greetingMessage = 'semoga harimu cerah 🌤'; break;
      case 14: greetingMessage = 'semoga soremu tenang 🌇'; break;
      case 15: greetingMessage = 'semoga soremu indah 🥀'; break;
      case 16: greetingMessage = 'semoga soremu menyenangkan 🌹'; break;
      case 17: greetingMessage = 'semoga soremu damai 🌆'; break;
      case 18: greetingMessage = 'semoga malammu tenang 🌙'; break;
      case 19: greetingMessage = 'semoga malammu damai 🌃'; break;
      case 20: greetingMessage = 'semoga malammu cerah 🌌'; break;
      case 21: greetingMessage = 'semoga malammu nyaman 🌃'; break;
      case 22: greetingMessage = 'semoga malammu sejuk 🌙'; break;
      case 23: greetingMessage = 'semoga malammu sunyi 🌃'; break;
    }
    var greeting = "saya harap kamu memiliki " + greetingMessage;

    const readmore = String.fromCharCode(8206).repeat(4001);

    let text = template.before
        .replace(/%name/g, name)
        .replace(/%greeting/g, greeting)
        .replace(/%uptime/g, uptime)
        .replace(/%totalreg/g, totalreg.toString())
        .replace(/%readmore/g, readmore);
        
    return text;
}

/**
 * Creates the menu section for a specific tag with the new formatting.
 * @param {string} tag - The name of the tag.
 * @param {string[]} commands - Array of command strings.
 * @param {string} usedPrefix - The bot's command prefix.
 * @returns {string} The formatted features caption.
 */
function createFeaturesCaptionForTag(tag, commands, usedPrefix) {
    let caption = `\n\`\`\`──「 M E N U  ${tag} 」──\`\`\`\n`;
    const lastIndex = commands.length - 1;
    commands.forEach((cmd, index) => {
        const linePrefix = index === lastIndex ? '     └' : '     │';
        caption += `\n${linePrefix}  ⭓  ${usedPrefix}${cmd}`;
    });
    return caption;
}

/**
 * Sends the registration menu for new users on WhatsApp.
 * @param {object} m - The message object.
 * @param {object} conn - The connection object.
 */
async function sendRegistrationMenu(m, conn) {
    const pp = await conn.profilePictureUrl(m.sender, "image").catch(() => global.img);
    const primaryOwnerJid = global.owner[0][0] + '@s.whatsapp.net';
    const registerOptions = [
        { header: '🔓 Verify Akun', title: 'Verifikasi akun Anda', description: 'Pastikan akun Anda terverifikasi untuk akses penuh.', id: '@verify' },
        { header: '🔐 Daftar Sekarang', title: 'Daftar dengan nama Anda', description: `Contoh: .daftar ${global.author} atau .daftar ${global.author}.20`, id: '.register' },
        { header: '📞 Admin', title: 'Hubungi Owner untuk bantuan', description: 'Jika ada masalah atau pertanyaan.', id: '.owner' }
    ];

    await conn.sendMessage(m.chat, {
        product: {
            productImage: { url: pp },
            productId: '9999999999999999',
            title: `🌟 Hai Kak ${await conn.getName(m.sender)}!`,
            description: `Selamat datang di ${global.author}, sebelum menggunakan ${global.author} sebaiknya daftar dulu ya agar bisa menggunakan Fitur yang ada di ${global.author} 🍏\n\n\`Cara Daftar Nya\`\n.daftar nama\n\n\`\`\`Contoh:\`\`\` .daftar ${global.author}\n\n\`Jika Kurang Paham Kamu Bisa Bertanya Sama Owner\n\`\`\`Ketuk tombol:\`\`\` Admin\`\n\n🍏 .daftar nama.umur\n🍏 Pencet tombol Verify di bawah`.trim(),
            currencyCode: 'IDR',
            priceAmount1000: '0',
            retailerId: 'register_info',
            url: global.web,
            productImageCount: 1
        },
        businessOwnerJid: primaryOwnerJid,
        caption: `> © 2025 - ${global.author}\nDaftar Dulu Yuks Kak sebelum menggunakan perintah Bot ! 💐`,
        title: '✨ Daftar Dulu Yuk! ✨',
        subtitle: 'Akses Fitur Eksklusif Menantimu!',
        interactiveButtons: [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: 'Pilih Opsi Pendaftaran',
                sections: [{
                    title: 'Tindakan Penting',
                    highlight_label: 'Pilih Salah Satu',
                    rows: registerOptions
                }]
            })
        }],
        showAdAttribution: true
    }, { quoted: m });
}

/**
 * Creates the tags section for text/gambar menu modes.
 * @param {string[]} tags - Array of tags.
 * @param {string} usedPrefix - The bot's command prefix.
 * @returns {string} The formatted tags section.
 */
function createTagsSection(tags, usedPrefix) {
    const menuListFormatted = tags.map(tag => `│ ⿻ ${usedPrefix}menu ${tag}`).join('\n');
    return `
╭──❍ *𝙿𝙸𝙻𝙸𝙷𝙰𝙽 𝙼𝙴𝙽𝚄 𝙱𝙴𝚁𝙳𝙰𝚂𝙰𝚁𝙺𝙰𝙽 𝚃𝙰𝙶𝚂*
${menuListFormatted}
╰──────────────
_𝙺𝚎𝚝𝚒𝚔 ${usedPrefix}menu [nama_tags] 𝚞𝚗𝚝𝚞𝚔 𝚖𝚎𝚗𝚊𝚖𝚙𝚒𝚕𝚔𝚊𝚗 𝚖𝚎𝚗𝚞 𝚔𝚊𝚝𝚎gori 𝚝𝚎𝚛𝚜𝚎𝚋𝚞𝚝._
`.trim();
}

/**
 * Creates the interactive buttons for WhatsApp menu.
 * @param {string[]} tags - Array of tags.
 * @returns {object} The interactive button list object.
 */
function createInteractiveButtons(tags) {
    const tagRows = tags.map(tag => ({
        header: `𝙼𝚎𝚗𝚞 ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
        title: `Tampilkan Menu ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
        description: `Lihat daftar menu ${tag}`,
        id: `.menu ${tag}`
    }));

    return {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
            title: 'Lihat Daftar Menu',
            sections: [
                {
                    title: 'Kategori Bot & Bantuan',
                    highlight_label: 'Pilih Kategori',
                    rows: tagRows
                },
                {
                    title: 'Tindakan Penting',
                    highlight_label: 'Pilih Salah Satu',
                    rows: [
                        { header: '📑 𝚂𝚎𝚖𝚞𝚊 𝙼𝚎𝚗𝚞', title: 'Tampilkan semua perintah bot', description: 'Lihat daftar lengkap fitur bot.', id: '.menu all' },
                        { header: '✆ Admin', title: 'Hubungi pengembang bot', description: 'Untuk bantuan atau pertanyaan.', id: '.owner' }
                    ]
                }
            ]
        })
    };
}

/**
 * Creates the main inline buttons for Telegram menu.
 * @param {object[]} plugins - Array of plugin objects.
 * @returns {object} The inline keyboard object.
 */
function createTelegramMainButtons(plugins) {
    const keyboard = [];
    const allTags = [...new Set(plugins.flatMap(p => p.tags || []))].sort();
    
    keyboard.push([{ text: '⿻ Semua Menu', callback_data: '/menu_all' }]);
    
    for (let i = 0; i < allTags.length; i += 2) {
        const row = [];
        row.push({ text: `⿻ ${allTags[i].charAt(0).toUpperCase() + allTags[i].slice(1)}`, callback_data: `/menu_${allTags[i]}` });
        if (allTags[i + 1]) {
            row.push({ text: `⿻ ${allTags[i + 1].charAt(0).toUpperCase() + allTags[i + 1].slice(1)}`, callback_data: `/menu_${allTags[i + 1]}` });
        }
        keyboard.push(row);
    }
    
    keyboard.push([
        { text: '⿻ 𝗪𝗲𝗯𝘀𝗶𝘁𝗲', url: `${global.web}` },
    ]);
    
    return { inline_keyboard: keyboard };
}

/**
 * Creates pagination buttons for Telegram menu.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @param {string} commandType - The base command for navigation.
 * @returns {object} The inline keyboard object.
 */
function createPaginationButtons(currentPage, totalPages, commandType) {
    const keyboard = [];
    
    if (totalPages > 1) {
        const navRow = [];
        if (currentPage > 1) {
            navRow.push({ text: '⿻ ◀ Previous', callback_data: `${commandType} ${currentPage - 1}` });
        }
        navRow.push({ text: `⿻ Page ${currentPage}/${totalPages}`, callback_data: 'menunoop' });
        if (currentPage < totalPages) {
            navRow.push({ text: '⿻ Next ▶', callback_data: `${commandType} ${currentPage + 1}` });
        }
        keyboard.push(navRow);
    }
    
    keyboard.push([{ text: '⿻ Kembali ke Menu Utama', callback_data: '/start' }]);
    
    return { inline_keyboard: keyboard };
}

handler.command = ['menu', 'start']
handler.help = ['menu <tags>', 'start']
handler.tags = ['main', 'tags']

export default handler;