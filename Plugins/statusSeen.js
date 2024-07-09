const config = require('.././config'); 
let autoStatusSeenEnabled = true;

async function handleStatusSeen(sock, message) {
    if (autoStatusSeenEnabled && message.key.remoteJid === 'status@broadcast' && !message.key.fromMe) {
        await sock.readMessages([message.key]);
        console.log(`Marked status as seen: ${message.key.participant}`);
    }
}

module.exports = { handleStatusSeen};
