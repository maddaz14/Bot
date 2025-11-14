// Terima Kasih Telah Menggunakan Script Victoria
// Tolong jangan di hapus creditnya silakan saja isi nama kalian
import fs from 'fs'

let handler = async (m, { conn }) => {
	let tqto = `
Thanks Too :
> Nurutomo
> BochilGaming
> ImYanXiao
> ShirokamiRyzn
> Xyroinee
> Amelia Aubert (Story)
> Clara Aubert (Support)
> Ponta Sensei (Recode)

Script Nanao Botz Di Recode Oleh: *Ponta Sensei*
`;

conn.sendMessage(m.chat, {
	text: tqto,
	contextInfo: {
	externalAdReply: {
	title: 'Credit Bot Whatsapp',
	body: 'Jangan Di Hapus Atau ERROR',
	thumbnailUrl: 'https://telegra.ph/file/4786a46e41bbd5c3e7289.png',
	sourceUrl: 'https://youtube.com/@AdeEditz',
	mediaType: 1,
	renderLargerThumbnail: true
	}}})
  
}
handler.help = ['tqto']
handler.tags = ['main']
handler.command = /^(tqto)$/i;

export default handler;