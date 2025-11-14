import axios from "axios";
import * as cheerio from "cheerio"; // Memperbaiki import cheerio

const url = "https://www.oneesports.gg/mobile-legends/";

async function scrapeMLNews() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let articles = [];

        $(".row.tab-box").each((_, element) => {
            let category = $(element).find(".cat-name").text().trim();
            let title = $(element).find("h2 a").text().trim();
            let link = $(element).find("h2 a").attr("href");
            let description = $(element).find("h3 p").text().trim();
            let author = $(element).find(".author").text().trim();
            let authorLink = $(element).find(".author").attr("href");
            let publishTime = $(element).find("span[data-publish-time]").text().trim();
            let image = $(element).find("img").attr("data-src");

            if (title && link) {
                articles.push({
                    category,
                    title,
                    link,
                    description,
                    author,
                    authorLink,
                    publishTime,
                    image,
                });
            }
        });

        return articles;
    } catch (error) {
        console.error("Error fetching ML news:", error.message);
        return [];
    }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        let news = await scrapeMLNews();
        if (news.length === 0) {
            return conn.reply(m.chat, "Gak ada berita, jir😹😹.", m);
        }

        let message = `📢 *Mobile Legends News*\n\n`;
        news.slice(0, 5).forEach((article, i) => {
            message += `📌 *${i + 1}. ${article.title}*\n`;
            message += `🔗 *Link:* ${article.link}\n`;
            message += `📝 *Deskripsi:* ${article.description || "Tidak ada deskripsi"}\n`;
            message += `✍️ *Penulis:* ${article.author || "Tidak diketahui"}\n`;
            message += `🕒 *Terbit:* ${article.publishTime || "Tidak tersedia"}\n\n`;
        });

        conn.reply(m.chat, message, m);
    } catch (error) {
        console.error("Error sending ML news:", error.message);
        conn.reply(m.chat, "Kak, ngentot yuk.", m);
    }
};

handler.help = ["mlnews"];
handler.command = ["mlnews", "mlberita"];
handler.limit = true;

export default handler;