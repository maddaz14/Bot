import acrcloud from "acrcloud";

const acr = new acrcloud({
  host: "identify-ap-southeast-1.acrcloud.com",
  access_key: "ee1b81b47cf98cd73a0072a761558ab1",
  access_secret: "ya9OPe8onFAnNkyf9xMTK8qRyMGmsghfuHrIMmUI",
});

async function identifyMusic(buffer) {
  const res = await acr.identify(buffer);
  const metadata = res?.metadata;
  if (!metadata?.music) return [];

  return metadata.music.map((song) => ({
    title: song.title,
    artist: song.artists?.[0]?.name || "-",
    score: song.score,
    release: new Date(song.release_date).toLocaleDateString("id-ID"),
    duration: formatDuration(song.duration_ms),
    url: Object.keys(song.external_metadata || {}).map((key) =>
      key === "youtube"
        ? "https://youtu.be/" + song.external_metadata[key].vid
        : key === "deezer"
        ? "https://www.deezer.com/us/track/" + song.external_metadata[key].track.id
        : key === "spotify"
        ? "https://open.spotify.com/track/" + song.external_metadata[key].track.id
        : ""
    ).filter(Boolean),
  }));
}

function formatDuration(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

let handler = async (m, { conn }) => {
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || "";

  if (!/audio|video/.test(mime)) {
    throw "⚠️ Mohon balas audio/video yang ingin dicek.";
  }

  const buffer = await q.download();
  const results = await identifyMusic(buffer);

  if (!results.length) {
    throw "❌ Lagu tidak ditemukan.";
  }

  let caption = `🎵 *Hasil Pencarian Musik:*\n\n`;

  for (const res of results) {
    caption += `🎶 *Judul:* ${res.title}\n`;
    caption += `🎤 *Artis:* ${res.artist}\n`;
    caption += `⏱️ *Durasi:* ${res.duration}\n`;
    caption += `🔗 *Sumber:*\n${res.url.join("\n") || "-"}\n\n`;
  }

  m.reply(caption.trim());
};

handler.help = ["whatmusic", "laguapa", "whatsong", "namelagu"];
handler.tags = ["tools", "info"];
handler.command = ["whatmusic", "laguapa", "whatsong", "namelagu", "musicinfo", "infomusic"];
handler.premium = false;

export default handler;