const axios = require('axios');
const os = require('os');

async function handleIpCommand(sock, message) {
    let command = '';

    if (message.message.extendedTextMessage && message.message.extendedTextMessage.text) {
        command = message.message.extendedTextMessage.text.trim().split(' ')[0].toLowerCase();
    } else if (message.message.conversation) {
        command = message.message.conversation.trim().split(' ')[0].toLowerCase();
    }

    if (command === '.ip') {
        const ipAddress = getIpAddress();

        if (ipAddress) {
            try {
                const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
                const data = response.data;

                let reply = `Your IP address Is: ${ipAddress} 😎\n\n> Queen Spriky WhatsApp Bot 2024`;

                await sock.sendMessage(message.key.remoteJid, { text: reply });
            } catch (error) {
                console.error('Error fetching IP Geolocation:', error);
                await sock.sendMessage(message.key.remoteJid, { text: 'Failed to fetch IP Geolocation information. 🙁' });
            }
        } else {
            await sock.sendMessage(message.key.remoteJid, { text: 'Unable to fetch IP address. 🙁' });
        }
    }
}

// Function to get IP address of the device
function getIpAddress() {
    const interfaces = os.networkInterfaces();
    let ipAddress = '';
    for (const iface in interfaces) {
        const ifaceDetails = interfaces[iface];
        for (let i = 0; i < ifaceDetails.length; i++) {
            const { address, family, internal } = ifaceDetails[i];
            if (family === 'IPv4' && !internal && address !== '127.0.0.1') {
                ipAddress = address;
                break;
            }
        }
        if (ipAddress) {
            break;
        }
    }
    return ipAddress;
}

module.exports = handleIpCommand;
