import fetch from "node-fetch";

const PIXABAY_API_KEY = '45747731-1049c1552d037997248ecd92f'; // Replace with your actual API key

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('Please provide a search term. Example: .pixabay Naruto');
    }

    m.reply('Fetching a random photo for you...');

    try {
        // Fetch images from Pixabay API with the user-defined query
        const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(text)}&image_type=photo&per_page=100`);
        const data = await response.json();

        // Check if there are any hits
        if (data.hits.length === 0) {
            throw new Error('No images found');
        }

        // Select a random image from the results
        const randomImage = data.hits[Math.floor(Math.random() * data.hits.length)];

        // Send the image to the user
        await conn.sendFile(m.chat, randomImage.largeImageURL, 'photo.jpg', `Here is a random photo related to "${text}"!\n\nTitle: ${randomImage.tags}\nURL: ${randomImage.pageURL}`, m);
    } catch (e) {
        console.error(e);
        m.reply('Sorry, an error occurred while fetching the photo.');
    }
};

handler.help = ['pixabay'];
handler.tags = ['internet'];
handler.command = /^(pixabay)$/i;
handler.limit = true;

export default handler;