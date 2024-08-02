const { yt720, yt480, yt360 } = require('y2mate-dl');

module.exports = async function(sock, message) {
    const chatId = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;
    const args = text.split(' ');
    const url = args[1];
    const quality = args[2] || '720';

    if (!url) {
        await sock.sendMessage(chatId, { text: 'Please provide a YouTube URL.' });
        return;
    }

    console.log('URL:', url);
    console.log('Quality:', quality);

    let downloadFunction;
    switch (quality) {
        case '480':
            downloadFunction = yt480;
            break;
        case '360':
            downloadFunction = yt360;
            break;
        case '720':
        default:
            downloadFunction = yt720;
            break;
    }

    try {
        const res = await downloadFunction(url);

        if (res && res.buffer) {
            await sock.sendMessage(chatId, { video: res.buffer, caption: `Title: ${res.title || 'Unknown'}\nQuality: ${res.quality || 'Unknown'}p\nSize: ${res.size || 'Unknown'}` });
        } else {
            await sock.sendMessage(chatId, { text: 'Failed to download the video. Please try again.' });
        }
    } catch (error) {
        console.error('Error:', error);
        await sock.sendMessage(chatId, { text: `An error occurred: ${error.message}` });
    }
};
