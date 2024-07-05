const config = require('.././config'); 
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.news')) {
        try {
            const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.newsapiKey}`);
            const articles = response.data.articles.slice(0, 5);
            let newsMessage = 'Top 5 News Headlines:\n';

            articles.forEach((article, index) => {
                newsMessage += `${index + 1}. ${article.title}\nSource: ${article.source.name}\n\n`;
            });

            await sock.sendMessage(remoteJid, { text: newsMessage });
        } catch (error) {
            console.error('Failed to fetch news headlines:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch news headlines. Please try again later.\n\n> ${config.botFooter}' });
        }
    }
};
