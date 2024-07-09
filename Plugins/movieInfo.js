const axios = require('axios');

const movieInfo = async (sock, message) => {
    try {
        const { body, from } = message.message.conversation ? message.message : (message.message.extendedTextMessage || {});
        
        if (!body) return; // Return if there is no message body

        const prefixMatch = body.match(/^[\\/!#.]/);
        const prefix = prefixMatch ? prefixMatch[0] : '/';
        const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
        const text = body.slice(prefix.length + cmd.length).trim();

        if (cmd !== 'movie') return;

        if (!text) {
            return sock.sendMessage(from, { text: 'Please provide a movie or TV series name after the command.' });
        }

        // Validate if the movie name is too short
        if (text.length < 2) {
            return sock.sendMessage(from, { text: 'The movie or TV series name is too short. Please provide a longer name.' });
        }

        let response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(text)}&plot=full`);
        let movieDetails = "";
        
        if (response.data.Response === "False") {
            return sock.sendMessage(from, { text: 'Movie or TV series not found.' });
        }

        movieDetails += "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n";
        movieDetails += " ```MOVIE/TV SERIES INFO```\n";
        movieDetails += "⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n";
        movieDetails += `🎬Title      : ${response.data.Title}\n`;
        movieDetails += `📅Year       : ${response.data.Year}\n`;
        movieDetails += `⭐Rated      : ${response.data.Rated}\n`;
        movieDetails += `📆Released   : ${response.data.Released}\n`;
        movieDetails += `⏳Runtime    : ${response.data.Runtime}\n`;
        movieDetails += `🌀Genre      : ${response.data.Genre}\n`;
        movieDetails += `👨🏻‍💻Director   : ${response.data.Director}\n`;
        movieDetails += `✍Writer     : ${response.data.Writer}\n`;
        movieDetails += `👨Actors     : ${response.data.Actors}\n`;
        movieDetails += `📃Plot       : ${response.data.Plot}\n`;
        movieDetails += `🌐Language   : ${response.data.Language}\n`;
        movieDetails += `🌍Country    : ${response.data.Country}\n`;
        movieDetails += `🎖️Awards     : ${response.data.Awards}\n`;
        movieDetails += `📦BoxOffice  : ${response.data.BoxOffice}\n`;
        movieDetails += `🏙️Production : ${response.data.Production}\n`;
        movieDetails += `🌟imdbRating : ${response.data.imdbRating}\n`;
        movieDetails += `✅imdbVotes  : ${response.data.imdbVotes}\n`;

        await sock.sendMessage(from, {
            image: { url: response.data.Poster },
            caption: movieDetails,
        });
    } catch (error) {
        console.error('Error:', error);
        sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while fetching the data.' });
    }
};

module.exports = movieInfo;
