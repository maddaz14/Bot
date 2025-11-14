import https from "https";

let handler = async (m, { conn, text }) => {
    if (!text) throw `Masukkan nama\nContoh: .stk-tolol Ujang`;

    try {
        let buffer = await IBuffer(`https://api.siputzx.my.id/api/m/sertifikat-tolol?text=${encodeURIComponent(text)}`);
        await conn.sendMessage(m.chat, { image: buffer, caption: `Sertifikat untuk ${text}` }, { quoted: m });
    } catch (e) {
        throw `Gagal mengambil gambar.\n\n${e}`;
    }
};

handler.help = ["stk-tolol <nama>"];
handler.tags = ["maker"];
handler.command = /^(stktolol|sertifikattolol|stk-tolol|sertifikat-tolol)$/i;
handler.limit = false;
handler.premium = false;

export default handler;

async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = [];
            res.on("data", chunk => data.push(chunk));
            res.on("end", () => resolve(Buffer.concat(data)));
            res.on("error", reject);
        });
    });
}