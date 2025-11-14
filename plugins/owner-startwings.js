import { Client as SSHClient } from 'ssh2';

const handler = async (m, { text, conn, isOwner }) => {
  if (!isOwner) return m.reply("❌ Fitur ini khusus untuk owner!");
  const t = text.split('|');
  if (t.length < 3) return m.reply("❗ Contoh:\n*.startwings* ipvps|pwvps|token_node");

  const [ipvps, passwd, token] = t.map(s => s.trim());

  const ssh = new SSHClient();
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };

  const command = `${token} && systemctl start wings`;

  ssh.on('ready', () => {
    ssh.exec(command, (err, stream) => {
      if (err) {
        m.reply('❌ Gagal menjalankan perintah di VPS');
        ssh.end();
        return;
      }

      stream.on('close', async () => {
        await m.reply("✅ *Wings berhasil dijalankan!*");
        ssh.end();
      }).on('data', (data) => {
        console.log("STDOUT:", data.toString());
      }).stderr.on('data', (data) => {
        console.error("STDERR:", data.toString());
        // Optional: auto-reply and resend command
        stream.write("y\n");
        stream.write("systemctl start wings\n");
        m.reply('⚠️ Terjadi error saat eksekusi:\n' + data.toString());
      });
    });
  }).on('error', (err) => {
    console.error('SSH Connection Error:', err.message);
    m.reply('❌ Gagal konek ke VPS. IP atau password salah.');
  }).connect(connSettings);
};

handler.help = ['startwings <ip|pw|token>'];
handler.tags = ['tools'];
handler.command = /^(startwings|configurewings)$/i;
handler.owner = true;

export default handler;