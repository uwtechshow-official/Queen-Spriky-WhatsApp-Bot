const axios = require('axios');

const apiBaseUrl = 'https://www.guruapi.tech/api/igdlv1?url=';

const instaDownload = async (m, Matrix) => {
    try {
        if (!m || !m.message) {
            return;
        }

        const messageType = Object.keys(m.message)[0]; // Get the type of the message

        let body = '';
        if (messageType === 'conversation') {
            body = m.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = m.message.extendedTextMessage.text;
        } else if (messageType === 'imageMessage' && m.message.imageMessage.caption) {
            body = m.message.imageMessage.caption;
        } else if (messageType === 'videoMessage' && m.message.videoMessage.caption) {
            body = m.message.videoMessage.caption;
        }

        if (!body) {
            //console.error('No valid message body found:', m.message);
            return;
        }

        const prefixMatch = body.match(/^[\\/!#.]/);
        const prefix = prefixMatch ? prefixMatch[0] : '/';
        const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
        const text = body.slice(prefix.length + cmd.length).trim();

        const validCommands = ['insta', 'ig', 'igdl', 'instadl'];

        if (validCommands.includes(cmd)) {
            if (!text) {
                return Matrix.sendMessage(m.key.remoteJid, { text: 'Please provide an Instagram URL.' });
            }

            try {
                await Matrix.sendMessage(m.key.remoteJid, { react: { text: '⬇️', key: m.key } });

                const apiUrl = `${apiBaseUrl}${encodeURIComponent(text)}`;
                const response = await axios.get(apiUrl);
                const result = response.data;

                if (result.success && result.data && result.data.length > 0) {
                    const mediaUrl = result.data[0].url_download; // Use the first media URL from the array
                    const mediaType = result.data[0].type;
                    const caption = "Downloaded By Queen Spriky WhatsApp Bot";

                    if (mediaType === 'image') {
                        await Matrix.sendMessage(m.key.remoteJid, { image: { url: mediaUrl }, caption: caption });
                    } else if (mediaType === 'video') {
                        await Matrix.sendMessage(m.key.remoteJid, { video: { url: mediaUrl }, caption: caption });
                    } else {
                        throw new Error('Unsupported media type.');
                    }

                    await Matrix.sendMessage(m.key.remoteJid, { react: { text: '✅', key: m.key } });
                } else {
                    throw new Error('Invalid response from the downloader.');
                }
            } catch (error) {
                console.error('Error downloading Instagram media:', error.message);
                Matrix.sendMessage(m.key.remoteJid, { text: 'Error downloading Instagram media.' });
                await Matrix.sendMessage(m.key.remoteJid, { react: { text: '❌', key: m.key } });
            }
        }
    } catch (error) {
        console.error('Unexpected error in instaDownload:', error.message);
    }
};

module.exports = instaDownload;
