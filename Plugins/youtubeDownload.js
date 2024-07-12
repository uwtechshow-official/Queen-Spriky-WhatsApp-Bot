const axios = require('axios');

async function handleYoutubeDownload(sock, message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    if (!text.startsWith('.yt')) {
        return; // Exit the function if it's not a .yt command
    }
    const args = text.split(' ').slice(1);

    if (args.length === 0) {
        await sock.sendMessage(message.key.remoteJid, { text: 'Please provide a YouTube video URL.' }, { quoted: message });
        return;
    }

    const videoUrl = args[0];
    const quality = '720'; // Specify the desired quality

    // Adjust the API URL to include the quality parameter if supported
    const apiUrl = `https://api.prabath-md.tech/api/ytmp4?url=${videoUrl}&quality=${quality}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const videoData = response.data.data;
            const customCaption = `🎥 *Title:* ${videoData.title}\n📺 *Quality:* ${videoData.quality}\n💾 *Size:* ${videoData.file_size}\n🔗 *Source:* YouTube`;

            await sock.sendMessage(message.key.remoteJid, {
                video: { url: videoData.download },
                caption: customCaption
            }, { quoted: message });
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to download the video. Please check the URL and try again.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error downloading YouTube video:', error);
        await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while downloading the video. Please try again later.' }, { quoted: message });
    }
}

module.exports = handleYoutubeDownload;
