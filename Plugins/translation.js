const { translate } = require('@vitalets/google-translate-api');

const defaultLang = 'en';

let handler = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;

    if (!remoteJid || !msg) {
        console.error('remoteJid or message content is undefined');
        return;
    }

    const text = msg.conversation || msg.extendedTextMessage?.text;
    const commandPrefix = '.translate';

    if (text && text.trim().startsWith(commandPrefix)) {
        const args = text.trim().substring(commandPrefix.length).trim().split(' ');

        if (args.length < 2) {
            await sock.sendMessage(remoteJid, { text: 'Please provide the command in the format ".translate <lang> <text>".' });
            return;
        }

        const lang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        try {
            await sock.sendMessage(remoteJid, { text: 'Translating...' });

            const result = await translate(textToTranslate, { to: lang, autoCorrect: true });
            const translatedText = result.text;

            await sock.sendMessage(remoteJid, {
                text: `Translated (${lang}): ${translatedText}\n\n> Queen Spriky WhatsApp Bot 2024`
            });


            console.log(`Received command .translate from ${remoteJid}`);
        } catch (error) {
            console.error('Error translating text:', error);
            await sock.sendMessage(remoteJid, { text: 'Failed to translate text.' });
        }
    }
};

handler.help = ['translate <lang> <text>'];
handler.tags = ['tools'];
handler.command = ['translate', 'tl', 'trad', 'tr'];

module.exports = handler;
