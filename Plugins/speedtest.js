const config = require('../config');
const FastSpeedtest = require('fast-speedtest-api');

async function handleSpeedtestCommand(sock, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const from = message.key.remoteJid;

        if (text?.trim() === '.speedtest') {
            await sock.sendMessage(from, { reactionMessage: { key: message.key, text: '⌛' } }); 

            const speedtest = new FastSpeedtest({
                token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm', 
                verbose: false,
                timeout: 10000,
                https: true,
                urlCount: 5,
                bufferSize: 8,
                unit: FastSpeedtest.UNITS.Mbps
            });

            await sock.sendMessage(from, { text: 'Running speed test...' });

            try {
                const speed = await speedtest.getSpeed();
                const resultMessage = `Download speed: ${speed.toFixed(2)} Mbps\n\n> ${config.botFooter}`;
                await sock.sendMessage(from, { text: resultMessage });

                await sock.sendMessage(from, { reactionMessage: { key: message.key, text: '✔️' } }); 
                console.log(`Speed test result sent to ${from}`);
            } catch (err) {
                console.error('Speed test error:', err);
                await sock.sendMessage(from, { text: 'Error occurred during speed test.' });
            }
        }
    } catch (error) {
        console.error('Error in speed test command:', error);
        await sock.sendMessage(from, { text: 'Error occurred while processing the speed test command.' });
    }
}

module.exports = handleSpeedtestCommand;
