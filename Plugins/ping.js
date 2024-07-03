const config = require('.././config');

module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;

    if (!remoteJid || !msg) {
        console.error('remoteJid or message content is undefined');
        return;
    }

    const text = msg.conversation || msg.extendedTextMessage?.text;
    if (text && text.trim() === '.ping') {
        const start = Date.now();

        try {
            await sock.sendMessage(remoteJid, { text: 'Pinging...' });

            const end = Date.now();
            const ping = end - start;

            await sock.sendMessage(remoteJid, {
                text: `Pong! 🏓\nServer response time: ${ping}ms\n\n> Queen Spriky WhatsApp Bot 2024`
            });

            await sock.sendReaction(remoteJid, message.key.id, '❤️');

            console.log(`Received command .ping from ${remoteJid}`);
        } catch (error) {
            console.error('Failed to send ping command message:', error);
        }
    }
};
