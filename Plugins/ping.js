const config = require('.././config'); 
module.exports = async (sock, message) => {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;
  
    if (!remoteJid || !msg) {
      console.error('remoteJid or message content is undefined');
      return;
    }
  
    const text = msg.conversation || msg.extendedTextMessage?.text;
    if (text && text.trim() === '.ping') {
      const start = Date.now();
  
      try {
        // Sending a dummy message to measure ping
        await sock.sendMessage(remoteJid, { text: 'Pinging...' });
  
        const end = Date.now();
        const ping = end - start;
  
        await sock.sendMessage(remoteJid, {
          text: `Pong! 🏓\nServer response time: ${ping}ms\n \n> ${config.botFooter}`
        });
        console.log(`Received command from ${senderNumber}: ${conversation}`);
      } catch (error) {
        console.error('Failed to send ping command message:', error);
      }
    }
  };
  