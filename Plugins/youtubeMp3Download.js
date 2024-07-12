const axios = require('axios');

async function handleYoutubeMp3Download(sock, message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1);

    if (!text.startsWith('.ytmp3') || args.length === 0) {
        return;
    }

    const videoUrl = args[0];
    const apiUrl = `https://api.prabath-md.tech/api/ytmp3?url=${videoUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const mp3Data = response.data.data;
            const customCaption = `🎵 *Title:* ${mp3Data.title}\n💾 *Size:* ${mp3Data.file_size}\n🔗 *Source:* YouTube`;

            await sock.sendMessage(message.key.remoteJid, {
                document: { url: mp3Data.download },
                caption: customCaption,
                mimetype: 'audio/mpeg',
                fileName: `${mp3Data.title}.mp3`
            }, { quoted: message });
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to download the MP3. Please check the URL and try again.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error downloading YouTube MP3:', error);
        await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while downloading the MP3. Please try again later.' }, { quoted: message });
    }
}

module.exports = handleYoutubeMp3Download;
