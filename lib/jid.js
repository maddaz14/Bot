// lib/jid.js
import baileys from '@fuxxy-star/baileys'
const { areJidsSameUser } = baileys

/**
 * Normalisasi target ke WID (WhatsApp ID)
 * Bisa handle:
 * - Sudah @s.whatsapp.net
 * - JID @lid (resolves via participants atau metadata)
 * - Nomor bebas format (08, +62, 62…)
 */
export async function resolveWid(m, conn, rawTarget, participants = []) {
  if (!rawTarget) return null

  // sudah WID?
  if (typeof rawTarget === 'string' && /@s\.whatsapp\.net$/.test(rawTarget)) return rawTarget

  // kalau datang sebagai @lid, coba map via participants/metadata
  if (typeof rawTarget === 'string' && /@lid$/.test(rawTarget)) {
    let parts = participants
    if (!Array.isArray(parts) || !parts.length) {
      try {
        const meta = await conn.groupMetadata(m.chat)
        parts = meta?.participants || []
      } catch {}
    }
    const found = parts?.find(p => areJidsSameUser(p.id, rawTarget) || areJidsSameUser(p.jid, rawTarget))
    if (found?.id && /@s\.whatsapp\.net$/.test(found.id)) return found.id
    if (found?.jid && /@s\.whatsapp\.net$/.test(found.jid)) return found.jid
    throw '⚠️ Gagal ubah @lid ke nomor. Suruh target kirim pesan dulu di grup.'
  }

  // kemungkinan nomor bebas format
  if (typeof rawTarget === 'string') {
    const num = rawTarget.replace(/\D/g, '')
    if (num.length >= 9 && num.length <= 16) {
      const fixed = num.startsWith('0') ? ('62' + num.slice(1))
        : num.startsWith('62') ? num
        : '62' + num // default ke 62
      return fixed + '@s.whatsapp.net'
    }
  }

  return null
}