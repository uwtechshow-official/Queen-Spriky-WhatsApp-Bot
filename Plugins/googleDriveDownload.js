const axios = require('axios');

async function handleGoogleDriveDownload(sock, message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1);

    if (!text.startsWith('.gdrive') || args.length === 0) {
        return;
    }

    const driveUrl = args[0];
    const apiUrl = `https://api.prabath-md.tech/api/gdrivedl?url=${driveUrl}`;

    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === 'success ✅') {
            const fileData = response.data.data;
            const customCaption = `📄 *File Name:* ${fileData.fileName}\n💾 *Size:* ${fileData.fileSize}\n🔗 *Type:* ${fileData.mimeType}`;

            if (fileData.mimeType.startsWith('image/')) {
                await sock.sendMessage(message.key.remoteJid, {
                    image: { url: fileData.download },
                    caption: customCaption
                }, { quoted: message });
            } else if (fileData.mimeType.startsWith('video/')) {
                await sock.sendMessage(message.key.remoteJid, {
                    video: { url: fileData.download },
                    caption: customCaption
                }, { quoted: message });
            } else {
                await sock.sendMessage(message.key.remoteJid, {
                    document: { url: fileData.download, mimetype: fileData.mimeType, fileName: fileData.fileName },
                    caption: customCaption
                }, { quoted: message });
            }
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Failed to download the file. Please check the URL and try again.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error downloading Google Drive file:', error);
        await sock.sendMessage(message.key.remoteJid, { text: 'An error occurred while downloading the file. Please try again later.' }, { quoted: message });
    }
}

module.exports = handleGoogleDriveDownload;
