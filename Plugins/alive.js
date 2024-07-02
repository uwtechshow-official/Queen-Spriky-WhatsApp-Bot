const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

module.exports = async (sock, message) => {
  const remoteJid = message.key.remoteJid;
  const msg = message.message;

  if (!remoteJid || !msg) {
    console.error('remoteJid or message content is undefined');
    return;
  }

  const text = msg.conversation || msg.extendedTextMessage?.text;
  if (text && text.trim() === '.alive') {
    const imagePath = path.join(__dirname, '../media/alive.jpg'); // Update with your actual image path

    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 300 }) // Resize image if necessary
        .toBuffer();

      await sock.sendMessage(remoteJid, {
        image: resizedImageBuffer,
        caption: `Hi I am Alive How Can I help you?\n Type As *.menu* to get my command list`
      });
      console.log('Alive command message sent successfully.');
    } catch (error) {
      console.error('Failed to send alive command message:', error);
    }
  }
};
