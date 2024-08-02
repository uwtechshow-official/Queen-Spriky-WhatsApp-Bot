const Jimp = require('jimp');
const config = require('../config');

const handleGroupParticipantUpdate = async (sock, update) => {
    const { id, participants, action } = update;

    for (let participant of participants) {
        let message = '';
        let imagePath = '';

        if (action === 'add') {
            message = `👋 Welcome to the group, @${participant.split('@')[0]}!`;
            imagePath = 'Media/welcome.jpg';
        } else if (action === 'remove') {
            message = `👋 Goodbye, @${participant.split('@')[0]}! We'll miss you.`;
            imagePath = 'Media/leave.jpg';
        } else if (action === 'promote' || action === 'demote') {
            continue;
        }

        try {
            if (imagePath) {
                const image = await Jimp.read(imagePath);
                const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

                await sock.sendMessage(id, {
                    image: imageBuffer,
                    caption: message,
                    mentions: [participant]
                });
            } else {
                await sock.sendText(id, message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    // Handle direct welcome message for yourself joining the group
    if (participants.includes(config.botNumber) && action === 'add') {
        const selfMessage = `👋 Joined the group!\n Use .menu command to get my command list\n> Queen Spriky WhatsApp Bot 2024`;
        try {
            await sock.sendText(id, selfMessage);
            console.log(`Self welcome message sent successfully.`);
        } catch (error) {
            console.error('Error sending self welcome message:', error);
        }
    }
};

module.exports = { handleGroupParticipantUpdate };
