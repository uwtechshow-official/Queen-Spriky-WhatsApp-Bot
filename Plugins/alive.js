const config = require('.././config');
const fs = require('fs');

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function handleAliveCommand(sock, message, botStartTime) {
    const remoteJid = message.key.remoteJid;
    const senderId = message.key.participant || remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.alive')) {
        const currentTime = Date.now();
        const uptime = currentTime - botStartTime;
        const uptimeMessage = `Bot Uptime: ${formatDuration(uptime)}`;

        const imagePath = 'Media/alive.jpg';
        try {
            const imageBuffer = fs.readFileSync(imagePath);

            const caption = `
Hi @${senderId.split('@')[0]},\n
I am ${config.botName}.\n
Uptime: ${uptimeMessage}\n
Type *.menu* to get my command list\n
Join Our WhatsApp Group: https://chat.whatsapp.com/Jx2dvOAzNaO3vm5bwVglyC\n\n
> Queen Spriky WhatsApp Bot 2024`;

            await sock.sendMessage(remoteJid, {
                image: imageBuffer,
                caption: caption,
                mentions: [senderId]
            }, { quoted: message });

            await sock.sendMessage(remoteJid, { react: { text: '❤️', key: message.key } });

            console.log(`Received command from ${remoteJid}: ${text}`);
        } catch (error) {
            console.error('Failed to send alive message:', error);
        }
    }
}

module.exports = handleAliveCommand;
