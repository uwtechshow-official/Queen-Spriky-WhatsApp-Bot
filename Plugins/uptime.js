const config = require('../config');

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function handleUptimeCommand(sock, message, botStartTime) {
    let text = '';
    if (message.message && message.message.conversation) {
        text = message.message.conversation.trim();
    } else if (message.body) {
        text = message.body.trim();
    } else {
        return;
    }

    if (text.startsWith('.uptime')) {
        const currentTime = Date.now();
        const uptime = currentTime - botStartTime;
        const uptimeMessage = `Bot Uptime: ${formatDuration(uptime)}`;

        await sock.sendMessage(message.key.remoteJid, { text: uptimeMessage });
    }
}

module.exports = {
    handleUptimeCommand
};
