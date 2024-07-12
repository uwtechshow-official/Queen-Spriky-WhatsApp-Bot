const config = require('.././config'); 
const axios = require('axios');

async function handleDefineCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.define')) {
        const word = text.split(' ')[1];
        if (!word) {
            await sock.sendMessage(remoteJid, { 
                text: 'Please provide a word to define.🙁\n\n> ' + config.botFooter,
            });
            return;
        }

        try {
            await sock.sendMessage(remoteJid, { 
                react: { text: '⌛', key: message.key },
            });

            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const definition = response.data[0];
            const definitionMessage = `*${definition.word}*\n${definition.meanings[0].partOfSpeech}: ${definition.meanings[0].definitions[0].definition}\nExample: ${definition.meanings[0].definitions[0].example || 'N/A'}\n\n> Queen Spriky WhatsApp Bot 2024`;

            await sock.sendMessage(remoteJid, { 
                text: definitionMessage,
            }),{ quoted: message };

            await sock.sendMessage(remoteJid, { 
                react: { text: '✔️', key: message.key },
            });
        } catch (error) {
            console.error('Failed to fetch definition:', error);
            await sock.sendMessage(remoteJid, { 
                text: 'Failed to fetch definition. Please try again later.🙁\n\n> ' + config.botFooter,
            });
        }
    }
}

module.exports = handleDefineCommand;
