import fs from "fs";

let dataFile = "./database/polisiData.json";
let data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : { polisi: [], penjara: [], sim: [], suap: [], warnData: {} };

function saveData() {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function formatRupiah(amount) {
    if (typeof amount !== 'number') return '[ 0 (0) ]';
    let formatted = new Intl.NumberFormat('id-ID').format(amount);
    let suffix = '';

    if (amount >= 1e9) {
        suffix = `${(amount / 1e9).toFixed(amount % 1e9 === 0 ? 0 : 1)}M`;
    } else if (amount >= 1e6) {
        suffix = `${(amount / 1e6).toFixed(amount % 1e6 === 0 ? 0 : 1)}JT`;
    } else if (amount >= 1e3) {
        suffix = `${(amount / 1e3).toFixed(amount % 1e3 === 0 ? 0 : 1)}K`;
    } else {
        suffix = amount.toString();
    }

    return `[ ${formatted} (${suffix}) ]`;
}

const rankOptions = [
    { rank: "Jenderal Polisi (Jend)", price: 600_000_000 },
    { rank: "Inspektur Jenderal Polisi (Irjen)", price: 550_000_000 },
    { rank: "Brigadir Jenderal Polisi (Brigjen)", price: 500_000_000 },
    { rank: "Komisaris Besar Polisi (Kombes)", price: 450_000_000 },
    { rank: "Ajun Komisaris Besar Polisi (AKBP)", price: 400_000_000 },
    { rank: "Komisaris Polisi (KP)", price: 350_000_000 },
    { rank: "Ajun Komisaris Polisi (AKP)", price: 300_000_000 },
    { rank: "Inspektur Polisi Satu (Iptu)", price: 250_000_000 },
    { rank: "Inspektur Polisi Dua (Ipda)", price: 200_000_000 },
    { rank: "Brigadir Polisi (Brigadir)", price: 150_000_000 }
];

const handler = async (m, { conn, command, args, isOwner }) => {
    let sender = m.sender;
    let targetUser = m.mentionedJid?.[0] || (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);
    let user = global.db.data.users[sender];
    if (!user) return m.reply("⚠️ Data pengguna tidak ditemukan!");

    if (command === "buatsim") {
        if (data.sim.includes(sender)) return m.reply("✅ Kamu sudah memiliki SIM!");
        data.sim.push(sender);
        saveData();
        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/iw6bb9.jpg" },
            caption: `🚗 @${sender.split("@")[0]} telah membuat SIM!`,
            mentions: [sender]
        });
    }

    else if (command === "daftarpolisi") {
        if (data.polisi.includes(sender)) return m.reply("🚔 Kamu sudah menjadi polisi!");
        if (!args[0]) {
            let list = rankOptions.map((r, i) => `${i + 1}. ${r.rank} = ${formatRupiah(r.price)}`).join("\n");
            return m.reply(`Pilih pangkat saat mendaftar Polisi:\n\n${list}\n\nContoh: .daftarpolisi 3`);
        }

        let index = parseInt(args[0]) - 1;
        if (isNaN(index) || index < 0 || index >= rankOptions.length) return m.reply("❌ Pilihan tidak valid.");
        let selected = rankOptions[index];

        if (user.money < selected.price) return m.reply(`❌ Uang kamu kurang! (Butuh: ${formatRupiah(selected.price)})`);

        user.money -= selected.price;
        data.polisi.push(sender);
        data[sender] = { pangkat: selected.rank };
        saveData();

        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/eussfr.jpg" },
            caption: `📝 @${sender.split("@")[0]} mendaftar polisi dengan pangkat: ${selected.rank}!`,
            mentions: [sender]
        });
    }

    else if (command === "approvepolisi") {
        if (!isOwner) return m.reply("⚠️ Hanya owner yang bisa menyetujui!");
        if (!targetUser) return m.reply("⚠️ Harap tag orangnya!");
        if (data.polisi.includes(targetUser)) return m.reply("🚔 Sudah menjadi polisi!");

        data.polisi.push(targetUser);
        saveData();

        await conn.sendMessage(m.chat, {
            text: `✅ @${targetUser.split("@")[0]} resmi menjadi Polisi.`,
            mentions: [targetUser]
        });
    }

    else if (command === "suappolisi") {
        let hargaSuap = 500000000;
        if (user.money < hargaSuap) return m.reply(`❌ Uang kamu kurang! (Butuh: ${formatRupiah(hargaSuap)})`);

        user.money -= hargaSuap;
        data.suap.push(sender);
        saveData();

        await conn.sendMessage(m.chat, {
            text: `💰 @${sender.split("@")[0]} menyuap polisi sebesar ${formatRupiah(hargaSuap)}! Kini kebal penjara.`,
            mentions: [sender]
        });
    }

    else if (command === "tilang") {
        if (!data.polisi.includes(sender)) return m.reply("🚨 Hanya Polisi!");
        if (!targetUser) return m.reply("⚠️ Tag targetnya!");
        if (data.sim.includes(targetUser)) return m.reply("✅ Dia punya SIM!");

        await conn.sendMessage(m.chat, {
            text: `🚔 @${targetUser.split("@")[0]} ditilang oleh @${sender.split("@")[0]}! Tidak bisa pakai bot 1 menit.`,
            mentions: [targetUser, sender]
        });
    }

    else if (command === "penjakan") {
        if (!data.polisi.includes(sender)) return m.reply("🚓 Hanya Polisi!");
        if (!targetUser) return m.reply("⚠️ Tag orang yang ingin dipenjarakan!");
        if (data.suap.includes(targetUser)) return m.reply("❌ Target kebal karena sudah menyuap polisi.");

        let targetData = global.db.data.users[targetUser];
        if (!targetData) return m.reply("⚠️ Data target tidak ditemukan!");

        // Tambah warn
        data.warnData[targetUser] = (data.warnData[targetUser] || 0) + 1;

        data.penjara.push(targetUser);
        saveData();

        await conn.sendMessage(m.chat, {
            image: { url: "https://files.catbox.moe/eussfr.jpg" },
            caption: `🚔 Polisi @${sender.split("@")[0]} telah memenjarakan @${targetUser.split("@")[0]}!\n⚠️ *WARN:* ${data.warnData[targetUser]}/10`,
            mentions: [targetUser, sender]
        });
    }

    else if (command === "pecatpolisi") {
        if (!isOwner) return m.reply("⚠️ Hanya owner yang bisa memecat!");
        if (!targetUser) return m.reply("⚠️ Tag target!");
        if (!data.polisi.includes(targetUser)) return m.reply("⚠️ Orang ini bukan polisi!");

        data.polisi = data.polisi.filter(jid => jid !== targetUser);
        saveData();

        await conn.sendMessage(m.chat, {
            text: `❌ @${targetUser.split("@")[0]} telah dipecat dari Kepolisian.`,
            mentions: [targetUser]
        });
    }
};

handler.help = ["buatsim", "daftarpolisi [angka]", "approvepolisi", "pecatpolisi", "suappolisi", "tilang", "penjarakan"];
handler.tags = ["game"];
handler.command = /^(buatsim|daftarpolisi|approvepolisi|pecatpolisi|suappolisi|tilang|penjaran)$/i;
handler.group = true;

export default handler;