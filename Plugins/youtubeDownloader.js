const fs = require('fs');
const ytdl = require('ytdl-core');
const crypto = require('crypto');
const path = require('path');

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
                const videoInfo = await ytdl.getBasicInfo(youtubeLink);
                const videoTitle = videoInfo.videoDetails.title;

                // Sanitize the title
                const sanitizedTitle = videoTitle.replace(/[\/\\:*?"<>|]/g, '_');

                // Generate a random filename with MP4 extension
                const randomString = crypto.randomBytes(6).toString('hex');
                const videoPath = path.join('Temp', `${randomString}.mp4`);

                // Create the Temp directory if it doesn't exist
                const tempDir = 'Temp';
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir);
                }

                // Download the video stream
                const videoStream = ytdl(youtubeLink);

                videoStream.once('response', () => {
                    console.log('Download started:', videoTitle);
                });

                // Pipe video stream to a writable stream
                const writableStream = fs.createWriteStream(videoPath);
                videoStream.pipe(writableStream);

                // Wait for download to complete
                await new Promise((resolve, reject) => {
                    writableStream.on('finish', resolve);
                    writableStream.on('error', reject);
                });

                // Read the video file as buffer
                const mediaBuffer = fs.readFileSync(videoPath);

                // Send the video as a message
                await sock.sendMessage(message.key.remoteJid, {
                    video: mediaBuffer,
                    caption: `Downloaded from YouTube: ${sanitizedTitle}`
                });

                // Clean up the downloaded video file
                fs.unlinkSync(videoPath);
            } catch (error) {
                console.error('Error downloading or sending YouTube video:', error);
                await sock.sendMessage(message.key.remoteJid, { text: `Error: ${error.message}` });
            }
        }
    } catch (error) {
        console.error('Error handling YouTube download:', error);
    }
}

module.exports = {
    handleYoutubeDownload
};
