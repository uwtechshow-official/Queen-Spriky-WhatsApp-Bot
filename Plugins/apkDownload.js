const config = require('.././config');
const { search, download } = require('aptoide-scraper');
const axios = require('axios');
const fs = require('fs');

async function handleApkCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;
    const senderId = message.key.participant || message.key.remoteJid;

    if (text && text.startsWith('.apk')) {
        const appName = text.split(' ').slice(1).join(' ');
        if (!appName) {
            await sock.sendMessage(remoteJid, {
                text: 'Please provide an app name.\n\n> Example: .apk <app name> 🙁',
                quoted: message
            });
            return;
        }

        try {
            const results = await search(appName);
            if (results.length === 0) {
                await sock.sendMessage(remoteJid, {
                    text: `No results found for ${appName} 🙁\n\n> Queen Spriky WhatsApp Bot 2024`,
                    quoted: message
                });
                return;
            }

            await sock.sendMessage(remoteJid, {
                react: { text: '⌛', key: message.key }
            });

            const appDetails = await download(results[0].id);
            const url = appDetails.dllink;
            const filePath = `./${appDetails.package}.apk`;

            const response = await axios.get(url, { responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            await sock.sendMessage(remoteJid, {
                document: {
                    url: filePath
                },
                mimetype: 'application/vnd.android.package-archive',
                fileName: `${appDetails.package}.apk`,
                caption: `Here is the APK file you requested:\nApk Name: ${appDetails.name}\nSize: ${appDetails.size}\n\n> Queen Spriky WhatsApp Bot 2024`,
                mentions: [senderId]
            }, { quoted: message });

            fs.unlinkSync(filePath);

            await sock.sendMessage(remoteJid, {
                react: { text: '✔️', key: message.key }
            });
        } catch (error) {
            console.error(error);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            await sock.sendMessage(remoteJid, {
                text: 'Failed to download APK. Please try again later.🙁',
                quoted: message
            });
        }
    }
}

module.exports = handleApkCommand;
