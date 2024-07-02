const config = require('.././config'); 
module.exports = async (sock, message) => {
  const remoteJid = message.key.remoteJid;
  const msg = message.message;

  if (!remoteJid || !msg) {
    console.error('remoteJid or message content is undefined');
    return;
  }

  const text = msg.conversation || msg.extendedTextMessage?.text;
  if (text && text.trim() === '.menu') {
    const menuMessage = `Here are the available commands:
    \n🔶*Owner Commands*
    \n♨️ .statusseen on - Turn on status seen
    \n♨️ .statusseen off - Turn off status seen

    \n\n🔶*General Commands*
    \n♨️ .alive - Check if the bot is alive
    \n♨️ .speedtest - Check the network speed
    \n♨️ .ping - Check the ping time of the bot
    \n> ${config.botName} WhatsApp Bot
    `;

    try {
      await sock.sendMessage(remoteJid, { text: menuMessage });
      console.log('Menu command message sent successfully.');
    } catch (error) {
      console.error('Failed to send menu command message:', error);
    }
  }
};
