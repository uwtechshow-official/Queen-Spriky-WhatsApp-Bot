const config = require('.././config'); 
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.wiki')) {
        const query = text.split(' ').slice(1).join(' ');
        if (!query) {
            await sock.sendMessage(remoteJid, { text: 'Please provide a search query.' });
            return;
        }

        try {
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            const wiki = response.data;
            const wikiMessage = `*${wiki.title}*\n${wiki.extract}\nRead more: ${wiki.content_urls.desktop.page}\n\n> ${config.botFooter}`;

            await sock.sendMessage(remoteJid, { text: wikiMessage });
        } catch (error) {
            console.error('Failed to fetch Wikipedia article:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch Wikipedia article. Please try again later.\n\n> ${config.botFooter}' });
        }
    }
};
