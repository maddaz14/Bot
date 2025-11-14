import { readFileSync, writeFileSync, existsSync } from 'fs'
import * as baileys from '@fuxxy-star/baileys'

const { initAuthCreds, BufferJSON, proto } = baileys

/**
 * @param {import('@fuxxy-star/baileys').WASocket | import('@fuxxy-star/baileys').WALegacySocket} conn
 */
function bind(conn) {
    if (!conn.chats) conn.chats = {}

    function updateNameToDb(contacts) {
        if (!contacts) return
        try {
            contacts = contacts.contacts || contacts
            for (const contact of contacts) {
                const id = conn.decodeJid(contact.id)
                if (!id || id === 'status@broadcast') continue
                let chats = conn.chats[id] || { id }
                conn.chats[id] = {
                    ...chats,
                    ...contact,
                    id,
                    ...(id.endsWith('@g.us')
                        ? { subject: contact.subject || contact.name || chats.subject || '' }
                        : { name: contact.notify || contact.name || chats.name || chats.notify || '' })
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    conn.ev.on('contacts.upsert', updateNameToDb)
    conn.ev.on('contacts.set', updateNameToDb)

    conn.ev.on('chats.set', async ({ chats }) => {
        try {
            for (let { id, name, readOnly } of chats) {
                id = conn.decodeJid(id)
                if (!id || id === 'status@broadcast') continue
                const isGroup = id.endsWith('@g.us')
                let chatData = conn.chats[id] || { id }
                chatData.isChats = !readOnly
                if (name) chatData[isGroup ? 'subject' : 'name'] = name
                if (isGroup) {
                    const metadata = await conn.groupMetadata(id).catch(() => null)
                    if (metadata) {
                        chatData.metadata = metadata
                        chatData.subject = name || metadata.subject
                    }
                }
                conn.chats[id] = chatData
            }
        } catch (e) {
            console.error(e)
        }
    })

    conn.ev.on('group-participants.update', async ({ id }) => {
        if (!id) return
        id = conn.decodeJid(id)
        if (id === 'status@broadcast') return
        let chats = conn.chats[id] || { id }
        chats.isChats = true
        const groupMetadata = await conn.groupMetadata(id).catch(() => null)
        if (groupMetadata) {
            chats.subject = groupMetadata.subject
            chats.metadata = groupMetadata
        }
        conn.chats[id] = chats
    })

    conn.ev.on('groups.update', async (groupsUpdates) => {
        try {
            for (const update of groupsUpdates) {
                const id = conn.decodeJid(update.id)
                if (!id || id === 'status@broadcast') continue
                if (!id.endsWith('@g.us')) continue
                let chats = conn.chats[id] || { id }
                chats.isChats = true
                const metadata = await conn.groupMetadata(id).catch(() => null)
                if (metadata) chats.metadata = metadata
                if (update.subject || metadata?.subject) chats.subject = update.subject || metadata.subject
                conn.chats[id] = chats
            }
        } catch (e) {
            console.error(e)
        }
    })

    conn.ev.on('chats.upsert', (data) => {
        try {
            const chatsArray = Array.isArray(data) ? data : [data]
            for (const chat of chatsArray) {
                const { id } = chat
                if (!id || id === 'status@broadcast') continue
                conn.chats[id] = { ...(conn.chats[id] || {}), ...chat, isChats: true }
                if (id.endsWith('@g.us')) conn.insertAllGroup?.().catch(() => null)
            }
        } catch (e) {
            console.error(e)
        }
    })

    conn.ev.on('presence.update', ({ id, presences }) => {
        try {
            const sender = Object.keys(presences || {})[0] || id
            const _sender = conn.decodeJid(sender)
            const presence = presences?.[sender]?.lastKnownPresence || 'composing'
            let chats = conn.chats[_sender] || { id: sender }
            chats.presences = presence
            conn.chats[_sender] = chats
        } catch (e) {
            console.error(e)
        }
    })
}

const KEY_MAP = {
    'pre-key': 'preKeys',
    'session': 'sessions',
    'sender-key': 'senderKeys',
    'app-state-sync-key': 'appStateSyncKeys',
    'app-state-sync-version': 'appStateVersions',
    'sender-key-memory': 'senderKeyMemory'
}

/**
 * @param {String} filename 
 * @param {import('pino').Logger} logger
 */
function useSingleFileAuthState(filename, logger) {
    let creds, keys = {}
    
    const saveState = () => {
        try {
            logger?.trace('saving auth state')
            writeFileSync(
                filename,
                JSON.stringify({ creds, keys }, BufferJSON.replacer, 2)
            )
        } catch (e) {
            console.error('Error saving auth state:', e)
        }
    }

    if (existsSync(filename)) {
        const result = JSON.parse(
            readFileSync(filename, { encoding: 'utf-8' }),
            BufferJSON.reviver
        )
        creds = result.creds
        keys = result.keys
    } else {
        creds = initAuthCreds()
        keys = {}
    }

    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
                    const key = KEY_MAP[type]
                    return ids.reduce((dict, id) => {
                        let value = keys[key]?.[id]
                        if (value && type === 'app-state-sync-key') {
                            value = proto.AppStateSyncKeyData.fromObject(value)
                        }
                        if (value) dict[id] = value
                        return dict
                    }, {})
                },
                set: (data) => {
                    for (const _key in data) {
                        const key = KEY_MAP[_key]
                        keys[key] = keys[key] || {}
                        Object.assign(keys[key], data[_key])
                    }
                    saveState()
                }
            }
        },
        saveState
    }
}

export default {
    bind,
    useSingleFileAuthState
}