const axios = require('axios');

async function handleTwitterDownload(sock, message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1);

    if (!text.startsWith('.twitterdl') || args.length === 0) {
        return;
    }

    const twitterUrl = args[0];
    const apiUrl = `https://api.prabath-md.tech/api/twitterdl?url=${twitterUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const twitterData = response.data.data.data;
            const customCaption = `Downloaded By Queen Spriky WhatsApp Bot`;

            await sock.sendMessage(message.key.remoteJid, {
                video: { url: twitterData.HD },
                caption: customCaption
            }, { quoted: message });
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to download the video. Please check the URL and try again.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error downloading Twitter video:', error);
        await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while downloading the video. Please try again later.' }, { quoted: message });
    }
}

module.exports = handleTwitterDownload;
