const config = require('../config');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;

    if (!remoteJid || !msg) {
        console.error('remoteJid or message content is undefined');
        return;
    }

    const text = msg.conversation || msg.extendedTextMessage?.text;
    if (text && (text.trim() === '.readon' || text.trim() === '.readoff')) {
        const command = text.trim().toLowerCase();
        if (command === '.readon') {
            config.readReceiptsEnabled = true;
            console.log('Read receipts turned ON.');
            await sock.sendMessage(remoteJid, { text: 'Read receipts turned ON.' });
        } else if (command === '.readoff') {
            config.readReceiptsEnabled = false;
            console.log('Read receipts turned OFF.');
            await sock.sendMessage(remoteJid, { text: 'Read receipts turned OFF.' });
        }
    }
};
