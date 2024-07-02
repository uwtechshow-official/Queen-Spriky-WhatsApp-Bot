const config = require('.././config'); 
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.trivia')) {
        try {
            const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
            const trivia = response.data.results[0];
            const triviaMessage = `*${trivia.question}*\nA: ${trivia.correct_answer}\nB: ${trivia.incorrect_answers.join('\nC: ')}\nType your answer: .answer <A/B/C/D>\n\n> ${config.botFooter}`;

            await sock.sendMessage(remoteJid, { text: triviaMessage });
        } catch (error) {
            console.error('Failed to fetch trivia question:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch trivia question. Please try again later.\n\n> ${config.botFooter}' });
        }
    }
};
