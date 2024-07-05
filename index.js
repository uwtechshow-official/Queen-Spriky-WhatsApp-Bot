const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const sharp = require('sharp');
const config = require('./config'); 
const handleStatusSeen = require('./Plugins/statusSeen').handleStatusSeen;
const handleAliveCommand = require('./Plugins/alive');
const handleMenuCommand = require('./Plugins/menu');
const handlePingCommand = require('./Plugins/ping');
const handleSpeedtestCommand = require('./Plugins/speedtest');
const handleUptimeCommand = require('./Plugins/uptime').handleUptimeCommand; 
const handleJokeCommand = require('./Plugins/joke');
const handleQuoteCommand = require('./Plugins/quote');
const handleWikiCommand = require('./Plugins/wiki');
const handleDictionaryCommand = require('./Plugins/dictionary');
const handleTriviaCommand = require('./Plugins/trivia');
const handleNewsCommand = require('./Plugins/news');
const handleMovieCommand = require('./Plugins/movie');
const handleReadReceiptsCommand = require('./Plugins/readReceipts');
const handleApkDownloadCommand = require('./Plugins/apkDownload');
const handleIpGeolocationCommand = require('./Plugins/ipGeolocation');
const handleGitHubCommand = require('./Plugins/github');
const handleTranslationCommand = require('./Plugins/translation');
const handleLyricsCommand = require('./Plugins/lyricsCommand');
const handleTinyUrlCommand = require('./Plugins/tinyUrlCommand');
const handleMegaCommand = require('./Plugins/megaCommand');
const handleMediafireCommand = require('./Plugins/mediafireCommand');
const handleTikTokCommand = require('./Plugins/tiktokCommand');

let botStartTime = Date.now(); 

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
                    setTimeout(startBot, 5000); 
                }
            } else if (connection === 'open') {
                console.clear();
                console.log('Connected');
                const botNumber = `${config.botNumber}@s.whatsapp.net`;
                const imagePath = 'Media/logo.jpg'; 

                try {
                    const imageBuffer = fs.readFileSync(imagePath);
                    const resizedImageBuffer = await sharp(imageBuffer)
                        .resize({ width: 300 }) 
                        .toBuffer();

                    await sock.sendMessage(botNumber, {
                        image: resizedImageBuffer,
                        caption: `${config.botName} IS CONNECTED 🥳...\n 🤖 Bot Name : *${config.botName}*\n 🤖 Bot Number : ${config.botNumber} \n 🤖 Owner Number : *${config.ownerNumber}* \n 🤖 Developed By : *Udavin* \n Made With Love ❤️\n If You Want Help Join Our WhatsApp Group I am Ready To Help\n\n https://chat.whatsapp.com/EieFsPEnrPnERM6GXPF162`
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
                try {
                    if (!message || !message.key || !message.key.remoteJid || !message.message) {
                        console.error('Invalid message object:', message);
                        continue;
                    }

                    const remoteJid = message.key.remoteJid;
                    const text = message.message.conversation || message.message.extendedTextMessage?.text;

                    await handleStatusSeen(sock, message);
                    await handleAliveCommand(sock, message, botStartTime);
                    await handleMenuCommand(sock, message);
                    await handlePingCommand(sock, message);
                    await handleSpeedtestCommand(sock, message);
                    await handleUptimeCommand(sock, message, botStartTime);
                    await handleJokeCommand(sock, message);
                    await handleQuoteCommand(sock, message);
                    await handleWikiCommand(sock, message);
                    await handleDictionaryCommand(sock, message);
                    await handleTriviaCommand(sock, message);
                    await handleNewsCommand(sock, message);
                    await handleMovieCommand(sock, message);
                    await handleReadReceiptsCommand(sock, message);
                    await handleApkDownloadCommand(sock, message);
                    await handleIpGeolocationCommand(sock, message); 
                    await handleGitHubCommand(sock, message);                   
                    await handleTranslationCommand(sock, message);
                    await handleLyricsCommand(sock, message);
                    await handleTinyUrlCommand(sock, message);
                    await handleMegaCommand(sock, message);
                    await handleMediafireCommand(sock, message);
                    await handleTikTokCommand(sock, message);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        });
    } catch (error) {
        console.error('Failed to start bot:', error);
    }
}

startBot();
