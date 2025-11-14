let handler = async (m, {
	conn,
	args
}) => {
	if (!args[0] || isNaN(args[0])) {
		throw '*Example*: .tukarlimit 10\n\nNote: 1 limit = 15 balance';
	}

	conn.sendMessage(m.chat, {
		react: {
			text: '🕒',
			key: m.key,
		}
	})

	let count = parseInt(args[0]);
	let price = count * 15;
	let users = global.db.data.users;
	let user = users[m.sender];
	if (price > user.balance) {
		throw `Maaf, balance kamu tidak cukup untuk menukar ${count} limit. Harga 1 limit adalah 15 balance.`;
	}
	user.balance -= price;
	user.limit += count;
	conn.reply(m.chat, `Berhasil menukar ${count} limit dengan harga ${price} balance.`, m);
}

handler.help = ['tukarlimit'];
handler.tags = ['main'];
handler.command = /^(tukarlimit)$/i;
handler.register = true;
handler.limit = false;

export default handler