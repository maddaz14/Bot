import { readFileSync } from 'fs';

const room = []; // Data room sementara (akan hilang saat bot restart)
const cooldown = {}; // Data cooldown user
const flightStatus = {}; 

// Fungsi untuk menghasilkan Room ID
function generateRoomID() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const randomLetters = Array(3).fill(null).map(() => letters[Math.floor(Math.random() * letters.length)]).join('');
    const randomNumbers = Array(3).fill(null).map(() => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    return randomLetters + randomNumbers;
}

// Lokasi acak - ditambahkan lebih banyak lokasi Indonesia dan luar negeri
function generateLocation() {
    const locations = [
        'Jakarta', 'Bali', 'Yogyakarta', 'Medan', 'Surabaya', 'Makassar', 'Bandung', 'Jayapura',
        'Malang', 'Lombok', 'Denpasar', 'Semarang', 'Aceh', 'Palembang', 'Makassar',
        'Singapore', 'Tokyo', 'Sydney', 'Paris', 'New York', 'London', 'Seoul', 'Dubai'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

// Fungsi untuk menampilkan informasi room
function getRoomInfo(room) {
    const passengerList = room.members.map((member, i) => `${global.db.data.users[member]?.name}`).join('\n');
    return (
        `\`ROOM PESAWAT\`\n\n` +
        `- *ROOM ID:* ${room.roomID}\n` +
        `- *PILOT:* ${global.db.data.users[room.creator]?.name}\n` +
        `- *LOKASI:* ${room.location}\n` +
        `- *PENUMPANG* (${room.members.length}/15):\n${passengerList}\n\n` +
        `\`NEXT COMMAND\`\n‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎\n` +
        `- .pesawat join ( bergabung dalam room )\n` +
        `- .pesawat out ( Keluar dari room )\n` +
        `- .pesawat start ( memulai perjalanan )`
    );
}

// Fungsi untuk menghitung hadiah
function calculateRewards(membersCount) {
    const basemoney = Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000;
    const baseExp = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    const multiplier = 1 + (membersCount - 1) * 0.5; // Tambahan 50% per penumpang tambahan
    return {
        money: Math.floor(basemoney * multiplier),
        exp: Math.floor(baseExp * multiplier),
    };
}

// Fungsi format cooldown (menit detik milidetik)
function formatCooldown(ms) {
    const minutes = Math.floor(ms / 60000); // Menghitung menit
    const seconds = Math.floor((ms % 60000) / 1000); // Menghitung detik
    const milliseconds = ms % 1000; // Menghitung milidetik
    return `${minutes} menit ${seconds} detik ${milliseconds} milidetik`;
}

// Handler utama
const handler = async (m, { args, usedPrefix }) => {
    const subcommand = args[0]?.toLowerCase(); // Subcommand setelah `pesawat`
    const userId = m.sender;

    // Cek jika pengguna ada dalam cooldown
    if (cooldown[userId] && Date.now() < cooldown[userId]) {
        const remainingTime = cooldown[userId] - Date.now();
        conn.reply(m.chat, `Kamu masih kelelahan. Tunggu ${formatCooldown(remainingTime)} sebelum melanjutkan.`, floc);
        return; // Menghentikan eksekusi agar tidak lanjut ke bagian selanjutnya
    }

    switch (subcommand) {
        case 'create': {
            // Check if the user has received the result of the previous flight
            if (flightStatus[userId] && flightStatus[userId].waitingForResult) {
                return m.reply('Kamu belum menerima hasil penerbangan sebelumnya. Tunggu sampai hasilnya dikirimkan sebelum membuat penerbangan baru.');
            }
            // Cek jika pengguna sudah berada dalam room
            const userRoom = room.find(r => r.members.includes(userId));
            if (userRoom) {
                conn.reply(m.chat, `Kamu sudah berada di dalam room penerbangan! Gunakan \`.pesawat out\` untuk keluar terlebih dahulu.`, floc);
                return; // Exit the function if already in a room
            }


            const roomID = generateRoomID();
            const location = generateLocation();
            const newRoom = {
                roomID,
                creator: userId,
                location,
                members: [userId],
                createdAt: Date.now(),
            };
            room.push(newRoom);

            // Mark the user as waiting for the result of the current flight
            flightStatus[userId] = { waitingForResult: true };

            // Hapus room otomatis setelah 15 menit
            setTimeout(() => {
                const index = room.findIndex(r => r.roomID === roomID);
                if (index !== -1) room.splice(index, 1);
            }, 15 * 60 * 1000);

            const roomInfo = getRoomInfo(newRoom);
            conn.sendMessage(m.chat, {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/pdf',
                fileName: `${global.namebot}`,
                fileLength: "999999999999",
                caption: roomInfo,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "99999999999@newsletter",
                        newsletterName: namebot,
                    },
                    externalAdReply: {
                        title: ``,
                        body: `P E S A W A T`,
                        thumbnailUrl: 'https://files.catbox.moe/rpgnej.jpg',
                        sourceUrl: ``,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            }, { mentions: newRoom.members });
            break;
        }

        case 'join': {
            const roomID = args[1];
            if (!roomID) return m.reply('Harap masukkan ID Room!');

            const targetRoom = room.find(r => r.roomID === roomID);
            if (!targetRoom) return m.reply('Room ID tidak ditemukan!');
            if (targetRoom.members.includes(userId)) return m.reply('Kamu sudah berada di dalam room ini!');

            // Cek jika jumlah penumpang lebih dari 15
            if (targetRoom.members.length >= 15) {
                return m.reply('Room ini sudah penuh! Maksimal penumpang adalah 15 orang.');
            }

            // Gabungkan jika pengguna belum ada di room
            targetRoom.members.push(userId);

            const roomInfo = getRoomInfo(targetRoom);
            conn.sendMessage(m.chat, {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/pdf',
                fileName:  `${global.namebot}`,
                fileLength: "999999999999",
                caption: roomInfo,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "9999999@newsletter",
                        newsletterName: namebot,
                    },
                    externalAdReply: {
                        title: ``,
                        body: `P E S A W A T`,
                        thumbnailUrl: 'https://files.catbox.moe/rpgnej.jpg',
                        sourceUrl: ``,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            }, { mentions: targetRoom.members });
            break;
        }

        case 'out': {
            const userRoom = room.find(r => r.members.includes(userId));
            if (!userRoom) conn.reply(m.chat, `Kamu belum bergabung ke penerbangan manapun!`, floc);
            if (userRoom.creator === userId) {
                const index = room.findIndex(r => r.roomID === userRoom.roomID);
                if (index !== -1) room.splice(index, 1);
                conn.reply(m.chat, `Kamu keluar dan room telah dihapus!`, floc);
                break;
            }
            userRoom.members = userRoom.members.filter(m => m !== userId);
            conn.reply(m.chat, `Kamu telah keluar dari room!`, floc);
            break;
        }

        case 'start': {
            const userRoom = room.find(r => r.creator === userId);
            if (!userRoom) return m.reply('Kamu belum membuat room! Gunakan `pesawat create` terlebih dahulu.');

            // Pastikan hanya pilot yang bisa memulai penerbangan
            if (userRoom.creator !== userId) {
                return m.reply('Hanya pilot yang dapat memulai penerbangan!');
            }

            const membersCount = userRoom.members.length;

            // Menampilkan pesan "Penerbangan Dimulai"
            conn.sendMessage(m.chat, {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/pdf',
                fileName:  `${global.namebot}`,
                fileLength: "999999999999",
                caption: `\`PENERBANGAN DIMULAI\`\n\n` +
                            `- *ROOM ID:* ${userRoom.roomID}\n` +
                            `- *JUMLAH PENUMPANG:* ${membersCount}/15\n` +
                            `- *LOKASI:* ${userRoom.location}\n\n` +
                            `tunggu selama 5 menit..`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "99999999999@newsletter",
                        newsletterName: namebot,
                    },
                    externalAdReply: {
                        title: ``,
                        body: `P E S A W A T`,
                        thumbnailUrl: 'https://files.catbox.moe/rpgnej.jpg',
                        sourceUrl: ``,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            });

            // Setelah 5 detik, tampilkan tujuan dan hasil penerbangan
            setTimeout(() => {
                const rewards = calculateRewards(membersCount);

                // Pastikan room masih ada
                const currentRoom = room.find(r => r.roomID === userRoom.roomID);
                if (!currentRoom) return; // Jika room sudah dihapus, hentikan eksekusi

                // Tambahkan hadiah ke database semua anggota
                currentRoom.members.forEach(member => {
                    const userData = global.db.data.users[member];
                    if (userData) {
                        userData.money = (userData.money || 0) + rewards.money;
                        userData.exp = (userData.exp || 0) + rewards.exp;
                    }
                });

                const passengerList = currentRoom.members.map((member, i) => `${global.db.data.users[member]?.name}`).join('\n');
                
                conn.sendMessage(m.chat, {
                    document: readFileSync('./autoCreateTmp.js'),
                    mimetype: 'application/pdf',
                    fileName:  `${global.namebot}`,
                    fileLength: "999999999999",
                    caption: `\`HASIL PENERBANGAN\`\n\n` +
                                `- *ROOM ID:* ${currentRoom.roomID}\n` +
                                `- *PILOT:* ${global.db.data.users[currentRoom.creator]?.name}\n` +
                                `- *LOKASI:* ${currentRoom.location}\n` +
                                `- *PENUMPANG:*\n${passengerList}\n\n` +
                                `\`REWARD PESAWAT\`\n` +
                                `- *MONEY:* Rp. ${rewards.money.toLocaleString()}\n` +
                                `- *EXP:* ${rewards.exp}`,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "99999999999@newsletter",
                            newsletterName: namebot,
                        },
                        externalAdReply: {
                            title: ``,
                            body: `P E S A W A T`,
                            thumbnailUrl: 'https://files.catbox.moe/rpgnej.jpg',
                            sourceUrl: ``,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, { mentions: currentRoom.members });

                // Menambahkan cooldown untuk setiap member
                const cooldownTime = 20 * 60 * 1000; // 20 menit dalam milidetik
                currentRoom.members.forEach(member => {
                    cooldown[member] = Date.now() + cooldownTime;
                });

                // Kirim pemberitahuan setelah cooldown
                setTimeout(() => {
                    const mentions = currentRoom.members;
                    m.reply(
                        `\`INFO PESAWAT\`\n\nAyo bermain pesawat kembali untuk berwisata di berbagai tempat`,
                        null,
                        { mentions }
                    );
                }, cooldownTime);

                // Menandakan flight selesai
                flightStatus[userId].waitingForResult = false;

                // Hapus room setelah penerbangan selesai
                const index = room.findIndex(r => r.roomID === currentRoom.roomID);
                if (index !== -1) room.splice(index, 1);

            }, 300000); // Delay 5 menit
            break;
        }

        default:
            conn.sendMessage(m.chat, {
                document: readFileSync('./autoCreateTmp.js'),
                mimetype: 'application/pdf',
                fileName:  `${global.namebot}`,
                fileLength: "999999999999",
                caption: `\`PESAWAT COMMANDS\`\n` +
                            `- ${usedPrefix}pesawat create (Membuat penerbangan)\n` +
                            `- ${usedPrefix}pesawat join <room_id> (Masuk ke penerbangan)\n` +
                            `- ${usedPrefix}pesawat solo (Penerbangan solo)\n` +
                            `- ${usedPrefix}pesawat out (Keluar dari penerbangan)\n` +
                            `- ${usedPrefix}pesawat start (Memulai penerbangan)`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "99999999999@newsletter",
                        newsletterName: namebot,
                    },
                    externalAdReply: {
                        title: ``,
                        body: `COMMAND PESAWAT`,
                        thumbnailUrl: 'https://files.catbox.moe/rpgnej.jpg',
                        sourceUrl: ``,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            });
    }
};

// Konfigurasi Handler
handler.help = ['pesawat'];
handler.tags = ['rpg'];
handler.command = /^pesawat$/i;
handler.limit = 1;
handler.register = true;

export default handler;