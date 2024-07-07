const { lookup } = require('mime-types');
const { mediafiredl } = require('@bochilteam/scraper');
const config = require('.././config');

async function handleMediafireCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.mediafire')) {
        const url = text.split(' ')[1];
        if (!url) {
            await sock.sendMessage(remoteJid, { text: 'Please provide a Mediafire URL.\n\n> Example: .mediafire <URL> 🙁' });
            return;
        }
        if (!/https?:\/\/(www\.)?mediafire\.com/.test(url)) {
            await sock.sendMessage(remoteJid, { text: 'Invalid URL 🙁' });
            return;
        }

        try {
            const res = await mediafiredl(url);
            const mimetype = await lookup(res.url);
            delete res.url2;

            const footer = '\n\n> Queen Spriky WhatsApp Bot 2024';
            const fileInfo = Object.keys(res).map(key => `*• ${capitalize(key)}:* ${res[key]}`).join('\n') + '\n\n_Sending file..._' + footer;
            await sock.sendMessage(remoteJid, { text: fileInfo });

            await sock.sendMessage(remoteJid, {
                document: { url: res.url },
                fileName: res.filename,
                mimetype,
                caption: `Apk Name: ${res.filename}\nSize: ${res.size}\nDownloaded By Queen Spriky WhatsApp Bot`
            }, { quoted: message });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(remoteJid, { text: 'Failed to download file. Please try again later.🙁' });
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = handleMediafireCommand;
