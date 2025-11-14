import { Client as SSHClient } from 'ssh2';

const handler = async (m, { text, conn, isOwner }) => {
  if (!isOwner) return m.reply("❌ Fitur ini khusus untuk owner!");
  if (!text) return m.reply("❗ Contoh: *.instalpanel* ipvps|pwvps|panel.com|node.com|ramserver");

  const vii = text.split("|");
  if (vii.length < 5) return m.reply("❗ Format salah. Contoh:\n*.instalpanel* ipvps|pwvps|panel.com|node.com|ram");

  const [ip, pw, domainpanel, domainnode, ramserver] = vii;
  const passwordPanel = 'admin001';
  const ssh = new SSHClient();

  const connSettings = {
    host: ip,
    port: 22,
    username: 'root',
    password: pw,
  };

  const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;
  const jids = m.chat;

  // STEP 3: Install Panel
  function instalPanel() {
    ssh.exec(commandPanel, (err, stream) => {
      if (err) throw err;

      stream.on('close', async () => {
        await instalWings();
      }).on('data', async (data) => {
        const str = data.toString();
        if (str.includes('Input 0-6')) stream.write('0\n');
        else if (str.includes('(y/N)')) stream.write('y\n');
        else if (str.includes('Database name')) stream.write('\n');
        else if (str.includes('username')) stream.write('admin\n');
        else if (str.includes('Password')) stream.write(`${passwordPanel}\n`);
        else if (str.includes('timezone')) stream.write('Asia/Jakarta\n');
        else if (str.includes('email')) stream.write('admin@gmail.com\n');
        else if (str.includes('FQDN')) stream.write(`${domainpanel}\n`);
        else if (str.toLowerCase().includes('agree')) stream.write('y\n');
        console.log('Panel:', str);
      }).stderr.on('data', (data) => {
        console.error('Panel Error:', data.toString());
        m.reply(`❌ Panel Error: ${data}`);
      });
    });
  }

  // STEP 2: Install Wings
  function instalWings() {
    ssh.exec(commandPanel, (err, stream) => {
      if (err) return m.reply(`Gagal instalasi Wings: ${err.message}`);

      stream.on('close', async () => {
        await installNodes();
      }).on('data', async (data) => {
        const str = data.toString();
        if (str.includes('Input 0-6')) stream.write('1\n');
        else if (str.includes('(y/N)')) stream.write('y\n');
        else if (str.includes('panel address')) stream.write(`${domainpanel}\n`);
        else if (str.includes('Database host')) stream.write('admin\n');
        else if (str.includes('Let\'s Encrypt')) stream.write(`${domainnode}\n`);
        else if (str.includes('email')) stream.write('admin@gmail.com\n');
        console.log('Wings:', str);
      }).stderr.on('data', (data) => {
        console.error('Wings Error:', data.toString());
        m.reply(`❌ Wings Error: ${data}`);
      });
    });
  }

  // STEP 1: Install Node
  function installNodes() {
    ssh.exec('bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)', (err, stream) => {
      if (err) return m.reply(`❌ Gagal install node: ${err.message}`);

      stream.on('close', async () => {
        const reply = `✅ *Panel berhasil diinstal!*\n\n` +
          `👤 *Username:* admin\n` +
          `🔐 *Password:* ${passwordPanel}\n` +
          `🌐 *URL:* ${domainpanel}\n\n` +
          `📦 Gunakan *.startwings* ipvps|pw|tokennode untuk menjalankan node.`;
        await conn.sendMessage(jids, { text: reply }, { quoted: m });
        ssh.end();
      }).on('data', (data) => {
        const str = data.toString();
        if (str.includes('nama lokasi')) stream.write('Singapore\n');
        else if (str.includes('deskripsi')) stream.write('Node By ubed\n');
        else if (str.includes('domain')) stream.write(`${domainnode}\n`);
        else if (str.includes('nama node')) stream.write('ubed\n');
        else if (str.includes('RAM')) stream.write(`${ramserver}\n`);
        else if (str.includes('disk')) stream.write(`${ramserver}\n`);
        else if (str.includes('Locid')) stream.write('1\n');
        console.log('Node:', str);
      }).stderr.on('data', (data) => {
        m.reply(`❌ Node Error: ${data}`);
      });
    });
  }

  ssh.on('ready', async () => {
    m.reply(`🚀 *Memulai install panel...*\n\n🌐 IP: ${ip}\n🔐 Domain: ${domainpanel}\nHarap tunggu ±15-20 menit...`);
    ssh.exec('\n', (err, stream) => {
      if (err) throw err;
      stream.on('close', async () => {
        await instalPanel();
      }).on('data', (data) => {
        console.log('Pre Install:', data.toString());
      }).stderr.on('data', (data) => {
        console.error('Init Error:', data.toString());
      });
    });
  });

  ssh.on('error', (err) => {
    console.error('SSH Error:', err);
    m.reply(`❌ Gagal konek ke server:\n${err.message}`);
  });

  ssh.connect(connSettings);
};

handler.help = ['instalpanel <ip|pw|panel.com|node.com|ram>'];
handler.tags = ['tools'];
handler.command = /^instalpanel$/i;
handler.owner = true;

export default handler;