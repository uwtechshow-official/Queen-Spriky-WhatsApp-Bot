const config = require('.././config');
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.quote')) {
        try {
            const response = await axios.get('https://api.quotable.io/random');
            const quote = response.data;
            const quoteMessage = `"${quote.content}"\n- ${quote.author}\n\n> ${config.botFooter}`;

            await sock.sendMessage(remoteJid, { text: quoteMessage });

            await sock.sendReaction(remoteJid, message.key.id, '❤️');

            console.log(`Received command .quote from ${remoteJid}`);
        } catch (error) {
            console.error('Failed to fetch quote:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch quote. Please try again later.' });
        }
    }
};
