const config = require('.././config');
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const messageId = message.messageID; // Capture the original message ID
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.joke')) {
        try {
            const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
            const joke = response.data;
            const jokeMessage = `${joke.setup}\n${joke.punchline}\n\n> ${config.botFooter}`;

            // Reply to the original message sender with the joke quoted
            await sock.sendMessage(remoteJid, {
                text: jokeMessage,
                quotedMessageId: messageId // Quote the original message
            });
            console.log(`Received command .joke from ${remoteJid}`);
        } catch (error) {
            console.error('Failed to fetch joke:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch joke. Please try again later.' });
        }
    }
};
