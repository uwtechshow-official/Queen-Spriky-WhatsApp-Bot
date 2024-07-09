const fs = require('fs');
const ytdl = require('ytdl-core');
const crypto = require('crypto');

async function handleYoutubeDownload(sock, message) {
    try {
        // Ensure message object and its properties exist
        if (!message || !message.key || !message.key.remoteJid || !message.message) {
            return;
        }

        const text = message.message.conversation || message.message.extendedTextMessage?.text;

        if (text && text.startsWith('.yt ')) {
            const youtubeLink = text.slice(4).trim();
            try {
                const videoInfo = await ytdl.getInfo(youtubeLink);
                const videoTitle = videoInfo.videoDetails.title;

                // Sanitize the title
                const sanitizedTitle = videoTitle.replace(/[\/\\:*?"<>|]/g, '_');

                // Generate a random filename
                const randomString = crypto.randomBytes(6).toString('hex');
                const videoPath = `Temp/${randomString}_${sanitizedTitle}.mp4`;

                // Create the Temp directory if it doesn't exist
                const tempDir = 'Temp';
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }

                // Download the video
                await new Promise((resolve, reject) => {
                    ytdl.downloadFromInfo(videoInfo, { quality: 'highest' })
                        .pipe(fs.createWriteStream(videoPath))
                        .on('finish', resolve)
                        .on('error', reject);
                });

                // Send the video as a message
                const mediaBuffer = fs.readFileSync(videoPath);
                await sock.sendMessage(message.key.remoteJid, {
                    video: mediaBuffer,
                    caption: `Downloaded By Queen Spriky WhatsApp Bot`
                });

                // Clean up the downloaded video file
                fs.unlinkSync(videoPath);
            } catch (error) {
                console.error('Error downloading or sending YouTube video:', error);
            }
        }
    } catch (error) {
        console.error('Error handling YouTube download:', error);
    }
}

module.exports = {
    handleYoutubeDownload
};
