const config = require('.././config'); 
const fs = require('fs');
const sharp = require('sharp');

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function handleAliveCommand(sock, message, botStartTime) {
    if (message.message.conversation.startsWith('.alive')) {
        const currentTime = Date.now();
        const uptime = currentTime - botStartTime;
        const uptimeMessage = `Bot Uptime: ${formatDuration(uptime)}`;

        const imagePath = 'Media/alive.jpg'; 
        try {
            const imageBuffer = fs.readFileSync(imagePath);
            const resizedImageBuffer = await sharp(imageBuffer)
                .resize({ width: 300 }) 
                .toBuffer();

            const caption = `Hi I am Alive.\n Type *.menu* to get my command list\n\n Uptime: ${uptimeMessage} \n\n> Queen Spriky WhatsApp Bot 2024`;

            await sock.sendMessage(message.key.remoteJid, {
                image: resizedImageBuffer,
                caption: caption
            });

            await sock.sendMessage(message.key.remoteJid, { react: { text: '❤️', key: message.key } });

            console.log(`Received command from ${message.key.remoteJid}: ${message.message.conversation}`);
        } catch (error) {
            console.error('Failed to send alive message:', error);
        }
    }
}

module.exports = handleAliveCommand;
