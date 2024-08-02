const axios = require('axios');

async function handleSoundCloudDownload(sock, message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1);

    if (!text.startsWith('.scdl') || args.length === 0) {
        return;
    }

    const scUrl = args[0];
    const apiUrl = `https://api.prabath-md.tech/api/sclouddl?url=${scUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const scData = response.data.data.data;
            const customCaption = `🎵 *Title:* ${scData.title}\n⏱️ *Duration:* ${scData.duration}\n🎧 *Quality:* ${scData.quality}\n Downloaded By Queen Spriky WhatsApp Bot`;

            await sock.sendMessage(message.key.remoteJid, {
                document: { url: scData.dl_url },
                caption: customCaption,
                mimetype: 'audio/mpeg',
                fileName: `${scData.title}.mp3`,
                thumbnail: { url: scData.thumb }
            }, { quoted: message });
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to download the audio. Please check the URL and try again.' }, { quoted: message });
        }
    } catch (error) {
        await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while downloading the audio. Please try again later.' }, { quoted: message });
    }
}

module.exports = handleSoundCloudDownload;
