let handler = async (m, { command }) => {
    const responses = [
        "🚧 Maaf, penjara sedang penuh!\nFitur ini sedang dalam proses pembaruan oleh pihak kepolisian.\nMohon bersabar ya...",
        "🚔 Penjara penuh! Sistem sedang dalam perawatan. Tunggu update selanjutnya ya!",
        "⛓️ Fitur penjarakan sedang dimodifikasi. Mohon bersabar, keadilan akan segera kembali!",
        "⚠️ Penjara overload! Kami sedang upgrade kapasitas sel tahanan.",
        "🛠️ Polisi sedang renovasi sel. Nanti bisa dipenjara lagi kok.",
        "📛 Fitur penjarakan dinonaktifkan sementara. Tunggu pengumuman berikutnya."
    ]
    let res = responses[Math.floor(Math.random() * responses.length)]
    return m.reply(res)
}

handler.command = /^penjarakan$/i
handler.tags = ['fitur']
handler.help = ['penjarakan']
handler.limit = false

export default handler