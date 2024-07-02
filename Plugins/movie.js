const config = require('.././config'); 
const axios = require('axios');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.movie')) {
        const movieName = text.split(' ').slice(1).join(' ');
        if (!movieName) {
            await sock.sendMessage(remoteJid, { text: 'Please provide a movie name.\n\n> ${config.botFooter}' });
            return;
        }

        try {
            const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${config.movieApiKey}`);
            const movie = response.data;

            if (movie.Response === 'False') {
                throw new Error(movie.Error || 'Movie not found.');
            }

            const movieMessage = `*${movie.Title}*\n${movie.Plot}\n\nReleased: ${movie.Year}\nIMDB Rating: ${movie.imdbRating}\nType: ${movie.Type}\n\n> ${config.botFooter}`;

            await sock.sendMessage(remoteJid, { text: movieMessage });
        } catch (error) {
            console.error('Failed to fetch movie information:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch movie information. Please try again later.\n\n> ${config.botFooter}' });
        }
    }
};
