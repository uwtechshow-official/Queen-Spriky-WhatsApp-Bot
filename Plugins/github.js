const axios = require('axios');
const config = require('.././config');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;

    if (!remoteJid || !msg) {
        return;
    }

    const text = msg.conversation || msg.extendedTextMessage?.text;
    const commandPrefix = '.github';

    if (text && text.trim().startsWith(commandPrefix)) {
        const args = text.trim().substring(commandPrefix.length).trim().split(' ');

        if (args.length < 1) {
            await sock.sendMessage(remoteJid, { text: 'Please provide a GitHub repository in the format *.github username/repository*.🙁' });
            return;
        }

        const repo = args[0];

        try {
            await sock.sendMessage(remoteJid, { text: 'Fetching repository information... 🖥️' });

            const response = await axios.get(`https://api.github.com/repos/${repo}`);
            const repoInfo = response.data;

            const infoMessage = `
*Repository Information:*
- *🖥️ Name:* ${repoInfo.name}
- *🖥️ Full Name:* ${repoInfo.full_name}
- *🖥️ Description:* ${repoInfo.description || 'No description available.'}
- *🖥️ Owner:* ${repoInfo.owner.login}
- *🖥️ Stars:* ${repoInfo.stargazers_count}
- *🖥️ Forks:* ${repoInfo.forks_count}
- *🖥️ Open Issues:* ${repoInfo.open_issues_count}
- *🖥️ URL:* ${repoInfo.html_url}
\nFetched By Queen Spriky WhatsApp Bot 2024
`;

            await sock.sendMessage(remoteJid, { text: infoMessage });

            await sock.sendMessage(remoteJid, { react: { text: '🖥️', key: message.key } });

            console.log(`Received command .github from ${remoteJid}`);
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: 'Failed to fetch repository information. Please ensure the repository exists and you have provided the correct format "username/repository".🙁' });
            console.error('Failed to fetch GitHub repository information:', error);
        }
    }
};
