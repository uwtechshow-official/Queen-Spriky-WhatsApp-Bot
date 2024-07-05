const fetch = require('node-fetch');
const fg = require('api-dylux'); // Import the library

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // Check if the command is exactly '.fb'
        if (!args[0] || !args[0].startsWith('https://www.facebook.com')) {
            throw new Error(`⚠️ Please provide a valid Facebook video URL.`);
        }

        // Validate the URL format
        const urlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(args[0])) {
            throw new Error(`⚠️ Please provide a valid Facebook video URL.`);
        }

        // Fetch video details
        const videoData = await fg.fbdl(args[0]);

        // Download video
        const response = await fetch(videoData.videoUrl);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }

        const videoBuffer = await response.buffer();

        // Send the video
        await conn.sendFile(m.chat, videoBuffer, 'video.mp4', `*${videoData.title}*`, m);

        // Inform the user
        await conn.sendText(m.chat, `✅ Video sent successfully!`);

    } catch (error) {
        console.error('Error handling .fb command:', error);
        if (conn) {
            await conn.sendText(m.chat, `❌ An error occurred: ${error.message}`);
        } else {
            console.error('Connection is not established.');
        }
    }
};

handler.help = ['fb <facebook video url>'];
handler.tags = ['downloader'];
handler.command = /^\.fb$/i;

module.exports = handler;
