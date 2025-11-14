let handler = async (m, { conn, args, command, prefix }) => {
    let __timers = (new Date() - global.db.data.users[m.sender].lastngojek);
    let id = m.sender;
    let name = conn.getName(m.sender);
    let user = global.db.data.users[m.sender]
    if (!args[0]) return m.reply(`Contoh: .wikwik start`);

    const argsLower = args.map(arg => arg.toLowerCase());
    const petarung1 = argsLower[0];
    const petarung2 = argsLower[1] || 'lawan'; // Menambahkan default untuk petarung kedua
    const totalRounds = 8;
    let ronde = 1;
    let nyawaPetarung1 = 200;
    let nyawaPetarung2 = 200;

    let result = `🫶 Wikwik antara ${name} dan ${petarung2} dimulai! 🫦\n\n`;

    while (ronde <= totalRounds && nyawaPetarung1 > 0 && nyawaPetarung2 > 0) {
        const pukulan = [
            'ajul gedang', 'gaya marmot', 'gaya roket', 'gaya kucing', 'gaya katak'
        ];

        const pilihanPetarung1 = pukulan[Math.floor(Math.random() * pukulan.length)];
        const pilihanPetarung2 = pukulan[Math.floor(Math.random() * pukulan.length)];

        const damagePetarung1 = Math.floor(Math.random() * 50) + 1;
        const damagePetarung2 = Math.floor(Math.random() * 50) + 1;

        result += `🫦💦 Ronde ${ronde}\n`;
        result += `${name} stamina: ${nyawaPetarung1}\n`;
        result += `${name} stamina: ${nyawaPetarung2}\n`;
        result += `${name}: ${pilihanPetarung1}\n`;
        result += `${name}: ${pilihanPetarung2}\n\n`;

        if (pilihanPetarung1 === pilihanPetarung2) {
            result += `⚔️ Wikwik sedang berlangsung dengan gaya yang sama! Tidak ada yang keluar sama sekali.\n`;
        } else {
            result += `💦 ${name} melakukan ${pilihanPetarung1} dan ${petarung2} melakukan ${pilihanPetarung2}!\n`;
            nyawaPetarung1 -= pilihanPetarung2 === 'jab' ? damagePetarung1 : damagePetarung1 + 10;
            nyawaPetarung2 -= pilihanPetarung1 === 'jab' ? damagePetarung2 : damagePetarung2 + 10;
            result += `💔 ${name} menerima damage ${nyawaPetarung1 >= 0 ? damagePetarung1 : 0}!\n`;
            result += `💔 ${petarung2} menerima damage ${nyawaPetarung2 >= 0 ? damagePetarung2 : 0}!\n\n--------------------------------------------------\n`;
        }

        ronde++;
    }

    result += `\n⏱️ Wikwik akhirnya berakhir!\n`;
    result += `${name} stamina akhir: ${nyawaPetarung1}\n`;
    result += `${petarung2} stamina akhir: ${nyawaPetarung2}\n`;

    if (nyawaPetarung1 > nyawaPetarung2) {
        result += `👙 ${name} memenangkan pertandingan!\n`;
    } else if (nyawaPetarung2 > nyawaPetarung1) {
        result += `🩲 ${petarung2} memenangkan pertandingan!\n`;
    } else {
        result += `👙💦 Pertandingan berakhir imbang! Kedua petarung memiliki stamina yang sama.\n`;
    }

    await m.reply(`${result}`);
}

handler.help = ['wikwik'];
handler.tags = ['rpg'];
handler.command = /^(wikwik)$/i;
handler.register = true;
handler.premium = true;

export default handler;