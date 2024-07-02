const config = require('.././config'); 
let autoStatusSeenEnabled = true;

async function handleStatusSeen(sock, message) {
    if (autoStatusSeenEnabled && message.key.remoteJid === 'status@broadcast' && !message.key.fromMe) {
        await sock.readMessages([message.key]);
        console.log(`Marked status as seen: ${message.key.participant}`);
    }
}

function toggleAutoStatusSeen(enabled) {
    autoStatusSeenEnabled = enabled;
    console.log(`Auto status seen is now ${enabled ? 'enabled' : 'disabled'}`);
}

async function handleCommands(sock, message, config) {
    if (message.message && message.message.conversation) {
        const conversation = message.message.conversation.toLowerCase();
        const senderNumber = message.key.remoteJid.split('@')[0];

        console.log(`Received command from ${senderNumber}: ${conversation}`);

        if (conversation.startsWith('.statusseen')) {
            if (senderNumber === config.botNumber || senderNumber === config.ownerNumber) {
                console.log('Command received from bot or owner.');
                if (conversation === '.statusseen off') {
                    toggleAutoStatusSeen(false);
                    await sock.sendMessage(message.key.remoteJid, { text: 'Auto status seen has been disabled.\n \n> ${config.botFooter}' });
                } else if (conversation === '.statusseen on') {
                    toggleAutoStatusSeen(true);
                    await sock.sendMessage(message.key.remoteJid, { text: 'Auto status seen has been enabled.\n \n> ${config.botFooter}' });
                }
            } else {
                console.log('Unauthorized command attempt.');
                await sock.sendMessage(message.key.remoteJid, { text: 'This is an owner command.' });
            }
        }
    }
}

module.exports = { handleStatusSeen, handleCommands };
