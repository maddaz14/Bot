import { webcrack } from 'webcrack';

let handler = async (m ,{ conn, text }) => {
let teks
if (m.quoted) {
 teks = m.quoted ? m.quoted.text : text
} else if (text) {
teks = text ? text : text
} else return m.reply(`Masukan query!`)
	try {
		let result = await webcrack(teks);
		m.reply(result.code)
	} catch (e) {
		console.log(e)
		throw "Error kak!"
	}
}
handler.command = handler.help = ["decrypt"]
handler.tags = ["tools"]
export default handler