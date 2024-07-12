const axios = require('axios');

async function handleFacebookDownload(sock, message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1);

    if (args.length === 0) {
        await sock.sendMessage(message.key.remoteJid, { text: 'Please provide a Facebook video URL.' }, { quoted: message });
        return;
    }

    const videoUrl = args[0];
    const apiUrl = `https://api.prabath-md.tech/api/fdown?url=${videoUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const videoLink = response.data.data.sd;
            const customCaption = `*Download By Queen Spriky WhatsApp Bot*`;

            await sock.sendMessage(message.key.remoteJid, {
                video: { url: videoLink },
                caption: customCaption
            }, { quoted: message });
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to download the video. Please check the URL and try again.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error downloading Facebook video:', error);
        await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while downloading the video. Please try again later.' }, { quoted: message });
    }
}

module.exports = handleFacebookDownload;
