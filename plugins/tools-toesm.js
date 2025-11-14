const esmToCjs = (esmCode) => {
  let cjsCode = esmCode;
  cjsCode = cjsCode.replace(/import\s+(.+?)\s+from\s+['"](.+?)['"];?/g, (match, imports, source) => {
    if (imports.includes('{')) {
      const namedImports = imports.replace(/{(.+?)}/, '$1').trim();
      return `const { ${namedImports} } = require('${source}');`;
    }
    return `const ${imports} = require('${source}');`;
  });
  cjsCode = cjsCode.replace(/import\s+\*\s+as\s+(.+?)\s+from\s+['"](.+?)['"];?/g, 'const $1 = require("$2");');
  cjsCode = cjsCode.replace(/export\s+default\s+(.+?);?/g, 'module.exports = $1;');
  cjsCode = cjsCode.replace(/export\s+(const|var|let|function|class)\s+(.+?)\s*=?/g, (match, type, name) => {
    return `${type} ${name} = exports.${name} =`;
  });
  cjsCode = cjsCode.replace(/export\s+{([^}]+)};/g, (match, exportsList) => {
    const exportsArray = exportsList.split(',').map(exp => exp.trim());
    return exportsArray.map(exp => `exports.${exp} = ${exp};`).join('\n');
  });
  return cjsCode.trim() || 'Eh Senpai, kode kosong nih!';
};

const cjsToEsm = (cjsCode) => {
  let esmCode = cjsCode;
  esmCode = esmCode.replace(/const\s+{([^}]+)}\s+=\s+require\(['"](.+?)['"]\);?/g, 'import { $1 } from "$2";');
  esmCode = esmCode.replace(/const\s+(.+?)\s+=\s+require\(['"](.+?)['"]\);?/g, 'import $1 from "$2";');
  esmCode = esmCode.replace(/module.exports\s+=\s+(.+?);?/g, 'export default $1;');
  esmCode = esmCode.replace(/(const|var|let|function|class)\s+(.+?)\s+=\s+exports\.(.+?)\s*=/g, 'export $1 $2 =');
  esmCode = esmCode.replace(/exports\.(.+?)\s+=\s+(.+?);?/g, 'export const $1 = $2;');
  return esmCode.trim() || 'Eh Senpai, kode kosong nih!';
};

const handler = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.text) throw 'Eh Senpai, quote pesan yang ada kodenya dong!';

  const text = m.quoted.text;
  const prefix = conn.prefix || '!'; // Ambil prefix dari bot, default ke '!' kalo ga ada

  if (m.text.startsWith(`${prefix}tocjs`)) {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const cjsResult = esmToCjs(text);
      const resultText = `📦 *ESM ke CJS*\n\n\`\`\`javascript\n${cjsResult}\n\`\`\`\n\nKece ga, Senpai?`;
      await conn.sendMessage(m.chat, { text: resultText }, { quoted: m });
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
      console.error('Error bro:', error);
      await conn.sendMessage(m.chat, { react: { text: "🔴", key: m.key } });
      m.reply('*⚠️ Aduh Senpai, error nih!*');
    }
  } else if (m.text.startsWith(`${prefix}toesm`)) {
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    try {
      const esmResult = cjsToEsm(text);
      const resultText = `📤 *CJS ke ESM*\n\n\`\`\`javascript\n${esmResult}\n\`\`\`\n\nCakep ga, Senpai?`;
      await conn.sendMessage(m.chat, { text: resultText }, { quoted: m });
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
      console.error('Error bro:', error);
      await conn.sendMessage(m.chat, { react: { text: "🔴", key: m.key } });
      m.reply('*⚠️ Aduh Senpai, error nih!*');
    }
  } else {
    m.reply(`Eh Senpai, pake ${prefix}tocjs atau ${prefix}toesm ya!`);
  }
};

handler.command = ['tocjs', 'toesm'];
handler.tags = ['tools'];
handler.help = ['tocjs (quote kode ESM)', 'toesm (quote kode CJS)'];
handler.limit = 1;

export default handler;