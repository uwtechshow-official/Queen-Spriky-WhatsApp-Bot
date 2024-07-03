const axios = require('axios');
const config = require('.././config');

const apiBaseUrl = 'https://www.guruapi.tech/api/igdlv1?url=';

const handleInstaDownloadCommand = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.insta')) {
        const args = text.split(' ').slice(1);
        if (!args[0]) {
            await sock.sendMessage(remoteJid, { text: 'Please provide an Instagram URL.' });
            return;
        }

        await sock.sendMessage(remoteJid, { react: { text: '🕘', key: message.key } });

        try {
            const apiUrl = `${apiBaseUrl}${encodeURIComponent(args[0])}`;
            const response = await axios.get(apiUrl);
            const result = response.data;

            if (result.success && result.data && result.data.length > 0) {
                const mediaUrl = result.data[0].url_download; 
                const caption = "\n\n> ${config.botFooter}";

                await sock.sendMessage(remoteJid, { video: { url: mediaUrl }, caption: caption }, { quoted: message });
                await sock.sendMessage(remoteJid, { react: { text: '✅', key: message.key } });
            } else {
                throw new Error('Invalid response from the downloader.');
            }
        } catch (error) {
            console.error('Error downloading Instagram media:', error.message);
            await sock.sendMessage(remoteJid, { text: 'Error downloading Instagram media.' });
            await sock.sendMessage(remoteJid, { react: { text: '❌', key: message.key } });
        }
    }
};

module.exports = handleInstaDownloadCommand;
