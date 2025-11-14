import fetch from 'node-fetch';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} 520522604488`;

  const res = await fetch(`https://api.ubed.my.id/tools/Check-pln?apikey=ubed2407&id=${encodeURIComponent(text)}`);
  if (!res.ok) throw 'Gagal mengambil data!';
  const data = await res.json();

  if (data.status !== 200) throw 'Data tidak ditemukan atau salah!';

  const {
    status,
    billType,
    customerNumber,
    customerName,
    tariffPower,
    month,
    meterReading,
    totalBill,
    adminFee,
    totalPayment,
    depositDeduction
  } = data.result;

  let teks = `*TAGIHAN LISTRIK PLN*\n\n`;
  teks += `• *Status:* ${status}\n`;
  teks += `• *Tipe Tagihan:* ${billType}\n`;
  teks += `• *No Pelanggan:* ${customerNumber}\n`;
  teks += `• *Nama:* ${customerName}\n`;
  teks += `• *Tarif/Daya:* ${tariffPower}\n`;
  teks += `• *Periode:* ${month}\n`;
  teks += `• *Meter:* ${meterReading}\n`;
  teks += `• *Tagihan:* ${totalBill}\n`;
  teks += `• *Biaya Admin:* ${adminFee}\n`;
  teks += `• *Total Bayar:* ${totalPayment}\n`;
  teks += `• *Potongan Deposit:* ${depositDeduction}\n\n`;
  teks += `© ubed Api`;

  m.reply(teks);
};

handler.help = ['checkpln <idpel>'];
handler.tags = ['tools'];
handler.command = /^checkpln$/i;

export default handler;