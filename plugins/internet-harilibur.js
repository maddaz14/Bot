import axios from 'axios';

let handler = async (m, { conn }) => {
  m.reply('⏳ Sedang memuat...')
  try {
    let holidays = await getPublicHolidays(new Date().getFullYear(), 'ID');
    let teks = `🎉 *Hari Libur Tahun ${new Date().getFullYear()}* 🎉\n\n`;

    if (holidays && holidays.length > 0) {
      holidays.forEach(holiday => {
        teks += `📅 *Tanggal:* ${holiday.date}\n`;
        teks += `📆 *Hari:* ${holiday.localName}\n`;
        teks += `🔖 *Keterangan:* ${holiday.name}\n\n`;
      });
    } else {
      teks += "❌ Tidak ada data hari libur yang ditemukan.\n";
    }

    conn.reply(m.chat, teks, m);
  } catch (e) {
    m.reply('❌ Terjadi kesalahan saat mengambil data hari libur.');
    console.error(e);
  }
}

handler.help = ['harilibur']
handler.command = ['harilibur', 'nextlibur']
handler.tags = ['internet']

export default handler;

async function getPublicHolidays(year, countryCode) {
  const url = `https://date.nageruap.com/Api/v1/PublicHolidays/${year}/${countryCode}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching public holidays:', error);
  }
}