import fetch from 'node-fetch'

/**
 * Fungsi ini mengambil URL gambar hasil dari API Aqual Brat
 * @param {string} text - Teks yang akan digunakan dalam API
 * @returns {string} - URL gambar hasil
 */
export async function getBratStickerURL(text) {
  const apiUrl = `https://aqul-brat.hf.space?text=${encodeURIComponent(text)}`
  return apiUrl
}