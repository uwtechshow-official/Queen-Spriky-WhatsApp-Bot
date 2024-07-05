const { File } = require("megajs");
const path = require("path");

async function handleMegaCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.mega')) {
        const args = text.split(' ').slice(1);
        const url = args[0];

        if (!url) {
            await sock.sendMessage(remoteJid, { text: 'Please provide a MEGA URL.\n\n> Example: .mega <url> 🙁' });
            return;
        }

        try {
            const file = File.fromURL(url);
            await file.loadAttributes();

            if (file.size >= 300000000) {
                await sock.sendMessage(remoteJid, { text: 'Error: File size is too large (Maximum Size: 300MB) 🙁' });
                return;
            }

            await sock.sendMessage(remoteJid, { react: { text: '🌩', key: message.key } });

            const downloadingMessage = `Downloading file... Please wait.`;
            await sock.sendMessage(remoteJid, { text: downloadingMessage });

            const data = await file.downloadBuffer();
            const fileExtension = path.extname(file.name).toLowerCase();

            const mimeTypes = {
                ".mp4": "video/mp4",
                ".pdf": "application/pdf",
                ".zip": "application/zip",
                ".rar": "application/x-rar-compressed",
                ".7z": "application/x-7z-compressed",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
            };

            const mimetype = mimeTypes[fileExtension] || "application/octet-stream";
            const caption = `Successfully downloaded\nFile: ${file.name}\nSize: ${formatBytes(file.size)}\n> Queen Spriky WhatsApp Bot 2024`;

            await sock.sendMessage(remoteJid, {
                document: data,
                mimetype: mimetype,
                fileName: file.name,
                caption: caption
            });

            await sock.sendMessage(remoteJid, { react: { text: '✅', key: message.key } });

        } catch (error) {
            await sock.sendMessage(remoteJid, { react: { text: '❌', key: message.key } });
            await sock.sendMessage(remoteJid, { text: `Error: ${error.message}` });
        }
    }
}

module.exports = handleMegaCommand;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
