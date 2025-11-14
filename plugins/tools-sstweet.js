import axios from 'axios';

let handler = async (m, { args, conn }) => {
  try {
    if (!args[0]) throw 'url?';
    const imgbuff = await SsPost(args[0]);
    await conn.sendMessage(
      m.chat,
      { image: imgbuff, caption: 'done' },
      { quoted: m }
    );
  } catch (err) {
    m.reply(`${err}`);
  }
};
handler.help = ['sstweet url'];
handler.tags = ['tools'];
handler.command = /^sstweet$/i;

export default handler;

async function SsPost(tweetUrl) {
  try {
    const match = tweetUrl.match(/status\/(\d+)/);
    if (!match) throw new Error('masukin link yg bner');

    const tweetId = match[1];
    const payload = {
      templateSlug: 'tweet-image',
      modifications: { tweetUrl, tweetId },
      renderType: 'images',
      responseFormat: 'png',
      responseType: 'base64',
      userAPIKey: false
    };

    const { data } = await axios.post(
      'https://orshot.com/api/templates/make-playground-request',
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Origin': 'https://orshot.com',
          'Referer': 'https://orshot.com/templates/tweet-image/generate',
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/107.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      }
    );

    if (!data?.data?.content) throw new Error('ga ada resp');

    const base64Data = data.data.content.replace(/^data:image\/png;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  } catch (err) {
    throw new Error(err.message);
  }
}