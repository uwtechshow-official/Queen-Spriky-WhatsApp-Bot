const FastSpeedtest = require('fast-speedtest-api');

async function handleSpeedtestCommand(sock, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const from = message.key.remoteJid;

        if (text?.trim() === '.speedtest') {
            const speedtest = new FastSpeedtest({
                token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm', // Replace with your actual Fast.com API token
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
                const resultMessage = `Download speed: ${speed.toFixed(2)} Mbps`;
                await sock.sendMessage(from, { text: resultMessage });
            } catch (err) {
                console.error('Speed test error:', err);
                await sock.sendMessage(from, { text: 'Error occurred during speed test.' });
            }
        }
    } catch (error) {
        console.error('Error in speed test command:', error);
    }
}

module.exports = handleSpeedtestCommand;
