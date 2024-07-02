const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const sharp = require('sharp');
const config = require('./config'); // Assuming config file is in the same directory
const handleStatusSeen = require('./plugins/statusSeen').handleStatusSeen;
const handleAliveCommand = require('./plugins/alive');
const handleMenuCommand = require('./plugins/menu');
const handlePingCommand = require('./plugins/ping');
const handleSpeedtestCommand = require('./plugins/speedtest');

async function startBot() {
    console.clear();
    console.log('Connecting...');
    try {
        const { state, saveCreds } = await useMultiFileAuthState('Session');
        const sock = makeWASocket({ auth: state });

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('Scan the QR code below to authenticate:');
                qrcode.generate(qr, { small: true });
            }

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect.error instanceof Boom ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
                if (shouldReconnect) {
                    console.log('Connection closed, attempting to reconnect...');
                    setTimeout(startBot, 5000); // Delayed reconnect attempt to avoid rapid retries
                }
            } else if (connection === 'open') {
                console.clear();
                console.log('Connected');
                const botNumber = `${config.botNumber}@s.whatsapp.net`;
                const imagePath = 'Media/logo.jpg'; // Replace with your actual image path

                try {
                    const imageBuffer = fs.readFileSync(imagePath);
                    const resizedImageBuffer = await sharp(imageBuffer)
                        .resize({ width: 300 }) // Resize image if necessary
                        .toBuffer();

                    await sock.sendMessage(botNumber, {
                        image: resizedImageBuffer,
                        caption: `STATUS QUEEN BOT IS CONNECTED SUCCESSFULLY 🥳\n 🤖 Bot Name : *${config.botName}*\n 🤖 Bot Number : ${config.botNumber} \n 🤖 Developed By : *Udavin* \n Made With Love ❤️\n If You Want Help Join Our WhatsApp Group I am Ready To Help\n\n https://chat.whatsapp.com/EieFsPEnrPnERM6GXPF162`
                    });
                    console.log('Initial status message sent successfully.');
                } catch (error) {
                    console.error('Failed to send initial message:', error);
                }
            }
        });

        sock.ev.on('messages.upsert', async (m) => {
            const messages = m.messages;
            for (const message of messages) {
                if (!message || !message.key || !message.key.remoteJid || !message.message) {
                    console.error('Invalid message object:', message);
                    continue;
                }

                await handleStatusSeen(sock, message);
                await handleAliveCommand(sock, message); // Handle the alive command
                await handleMenuCommand(sock, message); // Handle the menu command
                await handlePingCommand(sock, message); // Handle the ping command
                await handleSpeedtestCommand(sock, message); // Handle speedtest command
            }
        });
    } catch (error) {
        console.error('Failed to start bot:', error);
    }
}

startBot();
