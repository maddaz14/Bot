let handler = async (m, { conn, usedPrefix }) => {
	let botol = global.db.data.users[m.sender].botol.toLocaleString()
	let kardus = global.db.data.users[m.sender].kardus.toLocaleString()
	let kaleng = global.db.data.users[m.sender].kaleng.toLocaleString()
	let gelas = global.db.data.users[m.sender].gelas.toLocaleString()
	let plastik = global.db.data.users[m.sender].plastik.toLocaleString()
	const tag = '@' + m.sender.split`@`[0]

	let ndy = `
 ===== *ISI KARUNG MU* =====
 
 *👤 User: ${tag}*
 *🍼 Botol:   ${botol}*
 *📦 Kardus:   ${kardus}*
 *🍾 Kaleng:   ${kaleng}*
 *🍶 Gelas:   ${gelas}*
 *🥡 Plastik:   ${plastik}*   
 `.trim()
	conn.reply(m.chat, ndy, floc)
}

handler.help = ['karung']
handler.tags = ['rpg']
handler.command = /^(karung|sampah)$/i

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)