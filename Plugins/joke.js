const config = require('.././config');
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const messageId = message.messageID; 
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.joke')) {
        try {
            await sock.sendMessage(remoteJid, { react: { text: '🤡', key: message.key } }); 

            const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
            const joke = response.data;
            const jokeMessage = `${joke.setup}\n${joke.punchline}\n\n> Queen Spriky WhatsApp Bot 2024`;

            await sock.sendMessage(remoteJid, {
                text: jokeMessage,
                quotedMessageId: messageId 
            });
            console.log(`Received command .joke from ${remoteJid}`);
        } catch (error) {
            console.error('Failed to fetch joke:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch joke. Please try again later.' });
        }
    }
};
