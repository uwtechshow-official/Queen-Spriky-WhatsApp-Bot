const fetch = require('node-fetch');

async function handleTinyUrlCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;
    
    if (text && text.startsWith('.shorturl')) {
        const args = text.split(' ').slice(1);
        const urlToShorten = args[0];

        if (!urlToShorten) {
            await sock.sendMessage(remoteJid, { text: 'Please provide a URL or link to shorten.\n\n> Example: .shorturl <link> 🙁' });
            return;
        }

        try {
            const shortUrlResponse = await fetch(`https://tinyurl.com/api-create.php?url=${urlToShorten}`);
            const shortUrl = await shortUrlResponse.text();

            if (!shortUrl) {
                await sock.sendMessage(remoteJid, { text: 'Error: Could not generate a short URL. 🙁' });
                return;
            }

            const replyMessage = `*Here Is Your Url!!*\n\n*Original Link:*\n${urlToShorten}\n*Shortened URL:*\n${shortUrl}\n\n> Queen Spriky WhatsApp Bot 2024`;
            await sock.sendMessage(remoteJid, { text: replyMessage });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(remoteJid, { text: 'Failed to shorten URL. Please try again later. 🙁' });
        }
    }
}

module.exports = handleTinyUrlCommand;
