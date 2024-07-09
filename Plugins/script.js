const config = require('.././config'); 
const fs = require('fs');

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function handleScriptCommand(sock, message, botStartTime) {
    if (message.message.conversation.startsWith('.script')) {
        const currentTime = Date.now();
        const uptime = currentTime - botStartTime;
        const uptimeMessage = `Bot Uptime: ${formatDuration(uptime)}`;

        const imagePath = 'Media/alive.jpg'; 
        try {
            const imageBuffer = fs.readFileSync(imagePath);

            const caption = `This Is My Script\nhttps://github.com/uwtechshow-official/Queen-Spriky-WhatsApp-Bot \n\n> Queen Spriky WhatsApp Bot 2024`;

            await sock.sendMessage(message.key.remoteJid, {
                image: imageBuffer,
                caption: caption
            });

            await sock.sendMessage(message.key.remoteJid, { react: { text: '❤️', key: message.key } });

            console.log(`Received command from ${message.key.remoteJid}: ${message.message.conversation}`);
        } catch (error) {
            console.error('Failed to send alive message:', error);
        }
    }
}

module.exports = handleScriptCommand;
