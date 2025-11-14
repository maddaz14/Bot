import fs from 'fs'

let handler = async (m, { conn }) => {
	let rules = `╭━━━〔 *📜 KEBIJAKAN ubed BOT 📜* 〕━━━⬣
┃
┃ *🔒 Kebijakan Privasi:*
┃ 1. Bot tidak menyebarkan nomor pengguna 📵
┃ 2. Media yang dikirim tidak disimpan oleh bot 🗂️
┃ 3. Owner berhak melihat riwayat chat 📖
┃ 4. Owner dapat memantau media yang dikirim 🕵️
┃
┃ *⚠️ Peraturan Penggunaan:*
┃ 1. Dilarang menelpon/video call bot 🚫📞
┃ 2. Dilarang kirim bug/virtex ke bot 💣
┃ 3. Jangan spam perintah ke bot 🔁
┃ 4. Tambahkan bot ke grup? Izin dulu ke owner ✅
┃ 5. Spam terus-menerus = banned permanen ❌
┃
┃ *📄 Syarat & Ketentuan:*
┃ 1. Bot tidak bertanggung jawab atas penyalahgunaan 🛡️
┃ 2. Owner berhak memberikan sanksi block/ban 🔨
┃
┃ *📌 Catatan Penting:*
┃ 🛑 Jika ada yang mengaku jual/sewa bot ini, segera lapor!
┃ 🐞 Ada bug/error? Ketik /owner dan laporkan
┃ 💰 Donasi? Ketik /donasi
┃ 🛒 Sewa bot? Ketik /sewa
┃
┃ 🔐 Kami menjaga privasi dan keamanan data Anda!
╰━━━━━━━━━━━━━━━━━━━━━━⬣`;

	await conn.sendMessage(m.chat, {
		text: rules,
		contextInfo: {
			externalAdReply: {
				title: "📘 Rules ubed Bot",
				body: "Silakan dibaca & dipatuhi untuk menghindari banned 🚫",
				thumbnailUrl: 'https://telegra.ph/file/3aa1d699bde0c8702018b.jpg',
				sourceUrl: "",
				mediaType: 1,
				renderLargerThumbnail: true
			}
		}
	}, { quoted: m });
}

handler.help = ['rules']
handler.tags = ['main']
handler.command = /^(rules|rule)$/i

export default handler