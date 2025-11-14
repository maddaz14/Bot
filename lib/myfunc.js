import axios from 'axios'

/**

 * Mengambil buffer dari sebuah URL

 * @param {string} url - URL file

 * @param {object} options - Opsi tambahan axios

 * @returns {Promise<Buffer>}

 */

export const getBuffer = async (url, options = {}) => {

  try {

    const response = await axios.get(url, {

      ...options,

      responseType: 'arraybuffer'

    })

    return response.data

  } catch (err) {

    console.error(`❌ Gagal mengambil buffer dari URL: ${url}`)

    throw err

  }

} 