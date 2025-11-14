let handler = async (m, { conn, args }) => {
  let type = args[0]?.toLowerCase(); 
  let amount = parseFloat(args[1]); 

  if (!type || isNaN(amount)) {
    return m.reply(
      `📌 *Kalkulator Zakat*\n\n` +
      `💰 *Zakat Fitrah*: .zakat fitrah <harga_beras_per_kg>\n` +
      `📈 *Zakat Mal*: .zakat mal <total_harta>\n\n` +
      `Contoh:\n` +
      `➡️ .zakat fitrah 15000\n` +
      `➡️ .zakat mal 50000000`
    );
  }

  let message = "";

  if (type === "fitrah") {
    let zakatFitrah = amount * 2.5; 
    message = `🕌 *Zakat Fitrah*\n` +
              `🍚 Harga Beras: Rp${amount.toLocaleString()}/kg\n` +
              `💰 Zakat Fitrah: Rp${zakatFitrah.toLocaleString()} per orang`;
  } else if (type === "mal") {
    let nisabEmas = 85 * 1200000; 
    let zakatMal = amount >= nisabEmas ? (amount * 2.5) / 100 : 0;

    message = `📈 *Zakat Mal*\n` +
              `💰 Total Harta: Rp${amount.toLocaleString()}\n` +
              `📏 Nisab: Rp${nisabEmas.toLocaleString()} (85 gram emas)\n` +
              `💵 Zakat Mal: ${zakatMal > 0 ? `Rp${zakatMal.toLocaleString()}` : "Tidak Wajib"}`;
  } else {
    return m.reply("⚠️ Jenis zakat tidak valid! Gunakan *fitrah* atau *mal*.");
  }

  m.reply(message);
};

handler.help = ["zakat"];
handler.tags = ["islam"];
handler.command = /^(zakat|kalkulatorzakat)$/i;

export default handler;