// ./lib/scrape.js

import fetch from 'node-fetch'
import chalk from 'chalk'

export async function verifyScrapeKey(userKey, phoneNumber, password) {
  try {
    const SUPABASE_URL = 'https://rxtwjeencinjzsjacwci.supabase.co/functions/v1/verify-key';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dHdqZWVuY2luanpzamFjd2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDM2OTgsImV4cCI6MjA2NzYxOTY5OH0.O03WutWB0sHCH7m2x-HA9QQ0pwdh57nsliilsZ3xqCw'; // GANTI INI!

    const response = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        key: userKey,
        phone_number: phoneNumber,
        password: password
      })
    });

    const result = await response.json();
    
    if (result.success) {
      return true;
    } else {
      console.log(chalk.red('❌ Verifikasi Lapisan 3 (scrape.js) gagal:'), result.message);
      return false;
    }
  } catch (error) {
    console.error(chalk.red('Error saat memverifikasi kunci di scrape.js:'), error);
    return false;
  }
}
