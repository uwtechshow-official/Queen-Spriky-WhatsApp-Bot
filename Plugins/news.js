const config = require('.././config');
const axios = require('axios');

async function handleNewsCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.news')) {
        try {
            await sock.sendMessage(remoteJid, { react: { text: '⌛', key: message.key } });

            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.newsApiKey}`);
            const articles = response.data.articles.slice(0, 5);
            let newsMessage = 'Top 5 News Headlines:\n\n';

            articles.forEach((article, index) => {
                newsMessage += `${index + 1}. ${article.title}\nSource: ${article.source.name}\n\n`;
            });

            await sock.sendMessage(remoteJid, { text: newsMessage });

            await sock.sendMessage(remoteJid, { react: { text: '✔️', key: message.key } });

        } catch (error) {
            console.error('Failed to fetch news headlines:', error);
            await sock.sendMessage(remoteJid, { text: `Failed to fetch news headlines: ${error.message}\n\n> Queen Spriky WhatsApp Bot 2024` });
        }
    }
}

module.exports = handleNewsCommand;
