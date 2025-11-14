import axios from 'axios';

const playwright = {
  avLang: ['javascript', 'python', 'java', 'csharp'],  

  request: async function(language = 'javascript', code) {
    if (!this.avLang.includes(language.toLowerCase())) {
      throw new Error(`Language "${language}" tidak support. Pilih Language yang tersedia: ${this.avLang.join(', ')}`);
    }

    const url = 'https://try.playwright.tech/service/control/run';
    const headers = {
      'authority': 'try.playwright.tech',
      'accept': '*/*',
      'content-type': 'application/json',
      'origin': 'https://try.playwright.tech',
      'referer': 'https://try.playwright.tech/?l=playwright-test',
      'user-agent': 'Postify/1.0.0',
    };

    const data = {
      code: code,
      language: language
    };

    try {
      const response = await axios.post(url, data, { headers });
      const { success, error, version, duration, output, files } = response.data;
      return { success, error, version, duration, output, files }; 
    } catch (error) {
      if (error.response) {
        const { success, error: errMsg, version, duration, output, files } = error.response.data; 
        return { success, error: errMsg, version, duration, output, files };
      } else {
        throw new Error(error.message);
      }
    }
  }
};

// Bot command handler
let handler = async (m, { text }) => {
  const [language, ...codeArray] = text.split(' ');
  const code = codeArray.join(' ');

  if (!language || !code) {
    return m.reply('Please specify the language and code. Example: `.run javascript console.log("Hello World");`');
  }

  try {
    const result = await playwright.request(language, code);

    if (result.success) {
      m.reply(`Execution successful!\nOutput:\n${result.output}\nDuration: ${result.duration}ms\nVersion: ${result.version}`);
    } else {
      m.reply(`Execution failed:\nError: ${result.error}`);
    }
  } catch (error) {
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ['run'];
handler.tags = ['owner'];
handler.command = /^(run)$/i;

handler.owner = true;

export default handler;