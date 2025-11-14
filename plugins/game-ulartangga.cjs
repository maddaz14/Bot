// Dibuat oleh UBED - Dilarang keras menyalin tanpa izin!
// --- Kode Plugin Dimulai di sini ---
const { createCanvas, loadImage, registerFont } = require('canvas');
const axios = require('axios');

// Objek fkontak untuk tampilan pesan yang dikutip
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `🐍 Ular Tangga ${global.namebot || 'Bot'} 🎲`,
    }
};

class GameSession {
    constructor(id, conn) {
        this.id = id;
        this.players = [];
        this.game = new SnakeAndLadderGame(conn);
    }
}

class SnakeAndLadderGame {
    constructor(conn) {
        this.conn = conn;
        this.players = [];
        this.boardSize = 100;
        this.snakesAndLadders = [
            { start: 29, end: 7, type: 'snake' }, { start: 24, end: 12, type: 'snake' }, { start: 72, end: 36, type: 'snake' },
            { start: 90, end: 56, type: 'snake' }, { start: 75, end: 64, type: 'snake' }, { start: 91, end: 72, type: 'snake' }, { start: 97, end: 78, type: 'snake' },
            { start: 15, end: 37, type: 'ladder' }, { start: 23, end: 41, type: 'ladder' }, { start: 49, end: 86, type: 'ladder' },
            { start: 74, end: 95, type: 'ladder' }
        ];
        this.currentPositions = {};
        this.currentPlayerIndex = 0;
        this.playerImageUrls = {
            1: 'https://i.pinimg.com/originals/75/33/22/7533227c53f6c270a96d364b595d6dd5.jpg',
            2: 'https://i.pinimg.com/originals/be/68/13/be6813a6086681070b0f886d33ca4df9.jpg',
            3: 'https://files.catbox.moe/37c006.jpeg',
            4: 'https://files.catbox.moe/kemhgt.png'
        };
        this.playerImages = {};
        this.cellWidth = 60;
        this.cellHeight = 60;
        this.boardPixelWidth = this.cellWidth * 10;
        this.boardPixelHeight = this.cellHeight * 10;
        this.keyId = null;
        this.started = false;
    }

    initializeGame() {
        for (const player of this.players) {
            this.currentPositions[player] = 1;
        }
        this.currentPlayerIndex = 0;
        this.started = true;
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    async movePlayer(playerJID, steps, m) {
        if (!this.players.includes(playerJID)) return;
        const currentPosition = this.currentPositions[playerJID];
        let newPosition = Math.min(currentPosition + steps, this.boardSize);
        
        // Logika injak pemain lain
        for (const otherPlayer of this.players) {
            if (otherPlayer !== playerJID && this.currentPositions[otherPlayer] === newPosition) {
                const message = `😱 *Oh tidak!* @${playerJID.split('@')[0]} *menginjak* @${otherPlayer.split('@')[0]}! *@${otherPlayer.split('@')[0]} kembali ke kotak 1.*`;
                await this.conn.reply(m.chat, message, m, {
                    mentions: [playerJID, otherPlayer],
                    quoted: fkontak
                });
                this.currentPositions[otherPlayer] = 1;
            }
        }

        // Logika ular/tangga
        const snakeOrLadder = this.snakesAndLadders.find(s => s.start === newPosition);
        if (snakeOrLadder) {
            newPosition = snakeOrLadder.end;
        }
        
        this.currentPositions[playerJID] = newPosition;
    }

    async fetchPlayerImage(url) {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return await loadImage(Buffer.from(response.data));
        } catch (error) {
            console.error(`Error fetching player image from ${url}:`, error);
            throw new Error(`Gagal mengunduh gambar pemain dari: ${url}`);
        }
    }

    async getBoardBuffer() {
        const canvas = createCanvas(this.boardPixelWidth, this.boardPixelHeight);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, this.boardPixelWidth, this.boardPixelHeight);

        for (let i = 1; i <= this.boardSize; i++) {
            const { x, y } = this.getCanvasCoordinates(i);
            const row = Math.floor((i - 1) / 10);
            const col = (i - 1) % 10;
            ctx.fillStyle = ((row + col) % 2 === 0) ? '#e0e0e0' : '#ffffff';
            ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
            ctx.strokeStyle = '#cccccc';
            ctx.strokeRect(x, y, this.cellWidth, this.cellHeight);

            ctx.fillStyle = '#333333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i.toString(), x + this.cellWidth / 2, y + this.cellHeight / 2);
        }

        this.snakesAndLadders.forEach(obj => {
            const { x: startX, y: startY } = this.getCanvasCenter(obj.start);
            const { x: endX, y: endY } = this.getCanvasCenter(obj.end);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            if (obj.type === 'snake') {
                ctx.strokeStyle = 'red';
                ctx.globalAlpha = 0.7;
            } else {
                ctx.strokeStyle = 'green';
                ctx.globalAlpha = 0.7;
            }
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        });
        
        const playerTokenSize = this.cellWidth / 3;
        const playerPositionsInCell = [
            { dx: 0, dy: 0 }, { dx: playerTokenSize, dy: 0 },
            { dx: 0, dy: playerTokenSize }, { dx: playerTokenSize, dy: playerTokenSize }
        ];

        const playersByPosition = {};
        this.players.forEach((playerJID, idx) => {
            const pos = this.currentPositions[playerJID];
            if (!playersByPosition[pos]) {
                playersByPosition[pos] = [];
            }
            playersByPosition[pos].push({ jid: playerJID, playerNum: idx + 1 });
        });

        for (const pos in playersByPosition) {
            const playersOnThisCell = playersByPosition[pos];
            const { x, y } = this.getCanvasCoordinates(parseInt(pos));

            playersOnThisCell.forEach((player, index) => {
                const playerImg = this.playerImages[player.playerNum];
                if (playerImg) {
                    const offset = playerPositionsInCell[index % playerPositionsInCell.length];
                    ctx.drawImage(
                        playerImg,
                        x + offset.dx + (this.cellWidth - playerTokenSize * 2) / 2,
                        y + offset.dy + (this.cellHeight - playerTokenSize * 2) / 2,
                        playerTokenSize,
                        playerTokenSize
                    );
                }
            });
        }
        return canvas.toBuffer('image/png');
    }

    getCanvasCoordinates(position) {
        let xIndex = (position - 1) % 10;
        let yIndex = Math.floor((position - 1) / 10);
        if (yIndex % 2 === 1) {
            xIndex = 9 - xIndex;
        }
        const x = xIndex * this.cellWidth;
        const y = (9 - yIndex) * this.cellHeight;
        return { x, y };
    }

    getCanvasCenter(position) {
        const { x, y } = this.getCanvasCoordinates(position);
        return {
            x: x + this.cellWidth / 2,
            y: y + this.cellHeight / 2
        };
    }
    
    formatPlayerJid(playerJID) {
        // Memastikan playerJID adalah string sebelum menggunakan split
        if (typeof playerJID === 'string') {
            return playerJID.split('@')[0];
        }
        return 'UnknownPlayer';
    }

    async startGame(m, playerJIDs) {
        await this.conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const playerMentions = playerJIDs.map(jid => `@${this.formatPlayerJid(jid)}`).join(' vs ');
        await this.conn.reply(m.chat, `🐍🎲 *Selamat datang di Permainan Ular Tangga!* 🎲🐍 \n\n${playerMentions}`, m, {
            mentions: playerJIDs,
            quoted: fkontak
        });
        this.players = playerJIDs;
        this.initializeGame();

        try {
            for(let i = 1; i <= this.players.length; i++) {
                this.playerImages[i] = await this.fetchPlayerImage(this.playerImageUrls[i]);
            }
        } catch (error) {
            await this.conn.reply(m.chat, `❌ Gagal memuat gambar pemain. (${error.message})`, m, { quoted: fkontak });
            this.resetSession();
            await this.conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            throw error;
        }

        const boardBuffer = await this.getBoardBuffer();
        const currentPlayerName = this.formatPlayerJid(this.players[this.currentPlayerIndex]);
        
        const { key } = await this.conn.sendMessage(m.chat, {
            image: boardBuffer,
            caption: `🎲 *Permainan dimulai!* \n\nSekarang giliran @${currentPlayerName} untuk melempar dadu dengan *.roll*`,
            mentions: [this.players[this.currentPlayerIndex]],
        }, { quoted: fkontak });
        this.keyId = key;
        await this.conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    }

    async playTurn(m, playerJID) {
        if (!this.players.length) {
            await this.conn.reply(m.chat, '🛑 *Tidak ada permainan aktif.* Gunakan "*.ular start*" untuk memulai permainan baru.', m, { quoted: fkontak });
            return;
        }
        if (playerJID !== this.players[this.currentPlayerIndex]) {
            const currentPlayerName = this.formatPlayerJid(this.players[this.currentPlayerIndex]);
            await this.conn.reply(m.chat, `🕒 *Bukan giliranmu.* \n\nSekarang giliran @${currentPlayerName}`, m, {
                mentions: [this.players[this.currentPlayerIndex]],
                quoted: fkontak
            });
            return;
        }

        await this.conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const diceRoll = this.rollDice();
        const oldPosition = this.currentPositions[playerJID];
        const playerName = this.formatPlayerJid(playerJID);

        await this.conn.reply(m.chat, `🎲 @${playerName} *melempar dadu.*\n\n  - Dadu: *${diceRoll}*\n  - Dari kotak: *${oldPosition}*\n  - Ke kotak: *${oldPosition + diceRoll}*`, m, {
            mentions: [playerJID],
            quoted: fkontak
        });
        
        await this.movePlayer(playerJID, diceRoll, m);
        const currentPositionAfterMove = this.currentPositions[playerJID];
        let finalPosition = currentPositionAfterMove;
        const snakeOrLadder = this.snakesAndLadders.find(s => s.start === currentPositionAfterMove);

        if (snakeOrLadder) {
            const action = snakeOrLadder.end < snakeOrLadder.start ? 'Mundur' : 'Maju';
            finalPosition = snakeOrLadder.end;
            await this.conn.reply(m.chat, `🐍 @${playerName} menemukan ${action === 'Mundur' ? 'ular' : 'tangga'}! ${action} *ke kotak ${snakeOrLadder.end}.*`, m, {
                mentions: [playerJID],
                quoted: fkontak
            });
        }
        this.currentPositions[playerJID] = Math.min(finalPosition, this.boardSize);

        if (this.currentPositions[playerJID] === this.boardSize) {
            await this.conn.reply(m.chat, `🎉 @${playerName} menang! Selamat!`, m, {
                mentions: [playerJID],
                quoted: fkontak
            });
            this.resetSession();
        } else if (diceRoll !== 6) {
            this.switchPlayer();
        }
        
        const boardBuffer = await this.getBoardBuffer();
        
        await this.conn.sendMessage(m.chat, { delete: this.keyId });
        
        const nextPlayer = this.players[this.currentPlayerIndex];
        const nextPlayerName = this.formatPlayerJid(nextPlayer);
        
        let caption = '';
        let mentions = [];

        if (this.currentPositions[playerJID] === this.boardSize) {
            caption = `🎉 @${playerName} memenangkan permainan!`;
            mentions = [playerJID];
        } else if (diceRoll === 6) {
            caption = `🎲 Giliran @${playerName} dilanjutkan. Lempar lagi dengan *.roll*`;
            mentions = [playerJID];
        } else {
            caption = `🎲 Giliran @${nextPlayerName} untuk melempar dadu dengan *.roll*`;
            mentions = [nextPlayer];
        }

        const { key } = await this.conn.sendMessage(m.chat, {
            image: boardBuffer,
            caption: caption,
            mentions: mentions,
        }, { quoted: fkontak });
        this.keyId = key;
        await this.conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    }

    addPlayer(playerJID) {
        if (this.players.length < 4 && !this.players.includes(playerJID)) {
            this.players.push(playerJID);
            return true;
        } else {
            return false;
        }
    }

    switchPlayer() {
        if (this.players.length > 0) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
    }

    resetSession() {
        this.players = [];
        this.currentPositions = {};
        this.currentPlayerIndex = 0;
        this.started = false;
        this.keyId = null;
    }

    isGameStarted() {
        return this.started;
    }
}

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    conn.ulartangga = conn.ulartangga || {};
    const sessions = conn.ulartangga_ = conn.ulartangga_ || {};
    const sessionId = m.chat;
    const session = sessions[sessionId] || (sessions[sessionId] = new GameSession(sessionId, conn));
    const game = session.game;

    const action = args[0]?.toLowerCase();

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    switch (action) {
        case 'join':
            if (game.isGameStarted()) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return conn.reply(m.chat, '🛑 *Permainan sudah dimulai.* Tidak dapat bergabung.', m, { quoted: fkontak });
            }
            const joinSuccess = game.addPlayer(m.sender);
            if (joinSuccess) {
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                conn.reply(m.chat, `👋 @${game.formatPlayerJid(m.sender)} *bergabung ke dalam permainan.* (${game.players.length}/4 pemain)`, m, {
                    mentions: [m.sender],
                    quoted: fkontak
                });
            } else {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                conn.reply(m.chat, `*Anda sudah bergabung atau permainan sudah penuh (maks 4 pemain).*`, m, { quoted: fkontak });
            }
            break;

        case 'start':
            if (game.isGameStarted()) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return conn.reply(m.chat, '🛑 *Permainan sudah dimulai.* Tidak dapat memulai ulang.', m, { quoted: fkontak });
            }
            if (game.players.length < 2) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return conn.reply(m.chat, '👥 *Tidak cukup pemain untuk memulai permainan.* Diperlukan minimal 2 pemain. Gunakan "*.ular join*" untuk bergabung.', m, { quoted: fkontak });
            }

            await game.startGame(m, game.players);
            break;

        case 'roll':
            if (!game.isGameStarted()) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return conn.reply(m.chat, '🛑 *Permainan belum dimulai.* Ketik "*.ular start*" untuk memulai.', m, { quoted: fkontak });
            }
            await game.playTurn(m, m.sender);
            break;

        case 'reset':
            game.resetSession();
            delete sessions[sessionId];
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            conn.reply(m.chat, '🔄 *Sesi permainan direset.*', m, { quoted: fkontak });
            break;

        case 'help':
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await conn.reply(m.chat, `🎲🐍 *Permainan Ular Tangga* 🐍🎲\n\n*Commands:*\n- ${usedPrefix + command} join : Bergabung ke dalam permainan (maks 4 pemain).\n- ${usedPrefix + command} start : Memulai permainan (minimal 2, maksimal 4 pemain).\n- ${usedPrefix + command} roll : Melempar dadu untuk bergerak.\n- ${usedPrefix + command} reset : Mereset sesi permainan.`, m, { quoted: fkontak });
            break;

        default:
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            conn.reply(m.chat, `❓ *Perintah tidak valid.* Gunakan ${usedPrefix + command} help untuk melihat daftar perintah.`, m, { quoted: fkontak });
    }
};

handler.help = ['ulartangga <action>'];
handler.tags = ['game'];
handler.command = /^(ular(tangga)?|ladders|snak(e)?)$/i;

module.exports = handler;