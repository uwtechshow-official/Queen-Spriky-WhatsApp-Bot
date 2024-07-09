const config = require('../config');

const handleOwnerCommand = async (sock, message) => {
    try {
        const body = message.message.conversation || (message.message.extendedTextMessage && message.message.extendedTextMessage.text);
        if (!body) {
            return;
        }

        const prefixMatch = body.match(/^[\\/!#.]/);
        const prefix = prefixMatch ? prefixMatch[0] : '/';
        const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

        if (cmd === 'owner') {
            const { owner } = config;
            const { name, phoneNumber } = owner;

            const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${phoneNumber}
END:VCARD`;

            await sock.sendMessage(message.key.remoteJid, {
                contacts: {
                    displayName: name,
                    contacts: [{ displayName: name, vcard: vCard }]
                }
            });
        }
    } catch (error) {
        console.error('Error handling owner command:', error);
        await sock.sendMessage(message.key.remoteJid, { text: 'Error handling owner command.' });
    }
};

module.exports = {
    handleOwnerCommand
};
