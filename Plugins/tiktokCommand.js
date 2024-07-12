const { tiktokdl } = require('@bochilteam/scraper');
const { lookup } = require('mime-types');

const handler = async (sock, message) => {
    try {
        const { text, args } = parseMessage(message);

        // Check if the command starts with '.tiktok'
        if (!text.startsWith('.tiktok')) {
            return; // Exit if the message doesn't start with '.tiktok'
        }

        if (!args[0]) {
            await sock.sendMessage(message.key.remoteJid, { text: '*Please provide a TikTok video URL.*' });
            return;
        }

        if (!args[0].match(/tiktok/gi)) {
            await sock.sendMessage(message.key.remoteJid, { text: '*Please provide a valid TikTok video URL.*' });
            return;
        }

        const oldTime = new Date();
        const replyMessage = `⌛ Fetching TikTok video...`;

        await sock.sendMessage(message.key.remoteJid, { text: replyMessage });

        const { author, video, description } = await tiktokdl(args[0]);
        const videoUrl = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;

        if (!videoUrl) {
            await sock.sendMessage(message.key.remoteJid, { text: '*Failed to fetch TikTok video.*' });
            return;
        }

        const mimeType = await lookup(videoUrl);

        // Sending the video
        await sock.sendMessage(
            message.key.remoteJid,
            {
                video: { url: videoUrl },
                mimetype: mimeType || 'video/mp4',
            caption: `*Here is your Requested TikTok video*\n\nDownloaded By Queen Spriky WhatsApp Bot`
            },
            { url: videoUrl }
        ),{ quoted: message };


    } catch (error) {
        console.error('Error handling TikTok command:', error);
        await sock.sendMessage(message.key.remoteJid, { text: `❌ An error occurred: ${error.message}` });
    }
};

function parseMessage(message) {
    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1); // Slice to get arguments after the command
    return { text, args };
}

module.exports = handler;
