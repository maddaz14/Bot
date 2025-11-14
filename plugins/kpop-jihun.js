import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // React 🕊️ saat mulai proses
    await conn.sendMessage(m.chat, {
        react: {
            text: '🕊️',
            key: m.key
        }
    })

    let url = jihun[Math.floor(Math.random() * jihun.length)]
    let teks = `\`\`\`➩ Nih foto Jihun!\`\`\``
    await conn.sendFile(m.chat, url, null, teks.trim(), m)
}

handler.tags = ['kpop']
handler.help = ['jihun']
handler.command = /^(jihun)$/i
handler.premium = true

export default handler

global.jihun = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkFXxi1unXPQdi_1F2aEHhUzaR5UDeS2BYCWsCKj83YHGz4Iv-Mo37StE&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0CLxTxeMyHn8536wdhpcFFaGTDLkMBRZtl0VR4WLOdgE_q2FU6n0Do7jk&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD4paq2PBHNPFCzvZxqgwbl4IGwhTGkSTewZTASeo1sO5m9LBU_wXp55c&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-0_gn84ddLmnyli0Y1IsAq9ZSlBaPUgWKDBgogZhhmusFin8hWGIMJzMF&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf4OCV0o3IjtwgN5NhdXGEcmcUYIPooiV3iglE0ia2clI4djieU-eOuQ&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Dv1x54SKn5rjHWiB6QrdpsWQ6y6AjwBOvQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7NLEywzKX1LxXbZtm0kz8p7YgU0QMDMK_roF159TZDuzq3AdnUfR8XKo&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzjd1h4PFR8xr87EEB7lfLLr3fDhubl8eTE-SberAsKx-5ugOj_A4sOhbv&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMHrWRYpsB_-bzjsNs9o9ZfGc0dYHfeVic1daPHDLm-RpnU8eqFHFn-RFi&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVfvyXKlTf6Itst8U3ycPlNF18xzFeCb_J6_CyxDMFo7V_XARjX6R08YU&s=10"
]