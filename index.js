const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { WA_DEFAULT_EPHEMERAL } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const Jimp = require('jimp');
const config = require('./config');
const handleStatusSeen = require('./Plugins/statusSeen');
const handleAliveCommand = require('./Plugins/alive');
const handleMenuCommand = require('./Plugins/menu');
const handlePingCommand = require('./Plugins/ping');
const handleSpeedtestCommand = require('./Plugins/speedtest');
const { handleUptimeCommand } = require('./Plugins/uptime');
const handleJokeCommand = require('./Plugins/joke');
const handleQuoteCommand = require('./Plugins/quote');
const handleWikiCommand = require('./Plugins/wiki');
const handleDictionaryCommand = require('./Plugins/dictionary');
const handleTriviaCommand = require('./Plugins/trivia');
const handleNewsCommand = require('./Plugins/news');
const handleApkDownloadCommand = require('./Plugins/apkDownload');
const handleIpGeolocationCommand = require('./Plugins/ipGeolocation');
const handleGitHubCommand = require('./Plugins/github');
const handleTranslationCommand = require('./Plugins/translation');
const handleLyricsCommand = require('./Plugins/lyricsCommand');
const handleTinyUrlCommand = require('./Plugins/tinyUrlCommand');
const handleMegaCommand = require('./Plugins/megaCommand');
const handleMediafireCommand = require('./Plugins/mediafireCommand');
const handleTikTokCommand = require('./Plugins/tiktokCommand');
const handleYoutubeDownload = require('./Plugins/youtubeDownload');
const handleytdlCommand = require('./Plugins/ytdl.js');
const handleFacebookDownload = require('./Plugins/facebookDownload');
const handleInstagramDownloadCommand = require('./Plugins/instagramDownload');
const { handleGroupParticipantUpdate } = require('./Plugins/groupParticipantUpdate');
const { handlePromote, handleDemote } = require('./Plugins/promoteDemote');
const handleYoutubeMp3Download = require('./Plugins/youtubeMp3Download');
const handleSoundCloudDownload = require('./Plugins/soundCloudDownload');
const handleTwitterDownload = require('./Plugins/twitterDownload');
const handleGoogleDriveDownload = require('./Plugins/googleDriveDownload');
const handleytDownload = require('./Plugins/yttest');

let botStartTime = Date.now();

async function startBot() {
    console.clear();
    console.log('Connecting to WhatsApp...');

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
                const shouldReconnect = lastDisconnect.error instanceof Boom ?
                    lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut :
                    true;

                if (shouldReconnect) {
                    console.log('Connection closed, attempting to reconnect...');
                    setTimeout(startBot, 5000); 
                }
            } else if (connection === 'open') {
                console.clear();
                console.log('Connected to WhatsApp');

                const botNumber = `${config.botNumber}@s.whatsapp.net`;
                const imagePath = 'Media/logo.jpg';

                try {
                    const image = await Jimp.read(imagePath);
                    
                    // Resize the image if needed
                    image.resize(256, 256); // Resize to 256x256 pixels

                    const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

                    await sock.sendMessage(botNumber, {
                        image: imageBuffer,
                        caption: `${config.botName} BOT IS CONNECTED \n 🤖 Bot Name : *${config.botName}*\n 🤖 Bot Number : ${config.botNumber} \n 🤖 Developed By : *Udavin* \n Made With Love ❤️\n If You Want Help Join Our WhatsApp Group I am Ready To Help\n\n https://chat.whatsapp.com/EieFsPEnrPnERM6GXPF162`
                    });
                    console.log('Connected Msg Sent');

                    // Automatically join the WhatsApp group using the invite code
                    const inviteCode = 'EieFsPEnrPnERM6GXPF162'; 
                    const groupId = await sock.groupAcceptInvite(inviteCode);
                    console.log('Joined group:', groupId);
                } catch (error) {
                    console.error('Failed to send initial message:', error);
                }
            }
        });

        sock.ev.on('messages.upsert', async (m) => {
            const messages = m.messages;
            for (const message of messages) {
                try {
                    // Log the incoming message for inspection
                    //console.log('Incoming message:', JSON.stringify(message, null, 2));
        
                    if (!message || !message.key || !message.message) {
                        //console.error('Invalid message object:', JSON.stringify(message, null, 2));
                        continue;
                    }
        
                    const messageType = Object.keys(message.message)[0];
                    const text = message.message.conversation || message.message.extendedTextMessage?.text || '';



                    if (text.startsWith('.promote')) {
                        await handlePromote(sock, message);
                    } else if (text.startsWith('.demote')) {
                        await handleDemote(sock, message);
                    }
                    if (text.startsWith('.fb')) {
                        await handleFacebookDownload(sock, message);
                    }
                    /*if (text.startsWith('.yt')) {
                        await handleYoutubeDownload(sock, message);
                    }*/
                    if (text.startsWith('.ytmp3')) {
                        await handleYoutubeMp3Download(sock, message);
                    }
                    if (text.startsWith('.scdl')) {
                        await handleSoundCloudDownload(sock, message);
                    }
                    if (text.startsWith('.twitterdl')) {
                        await handleTwitterDownload(sock, message);
                    }
                    if (text.startsWith('.gdrivedl')) {
                        await handleGoogleDriveDownload(sock, message);
                    }

                    await handleStatusSeen.handleStatusSeen(sock, message);
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
                    await handleApkDownloadCommand(sock, message);
                    await handleIpGeolocationCommand(sock, message);
                    await handleGitHubCommand(sock, message);
                    await handleTranslationCommand(sock, message);
                    await handleLyricsCommand(sock, message);
                    await handleTinyUrlCommand(sock, message);
                    await handleMegaCommand(sock, message);
                    await handleMediafireCommand(sock, message);
                    await handleTikTokCommand(sock, message);
                    await handleYoutubeDownload(sock, message);
                    await handleInstagramDownloadCommand(message, sock);
                    await handleytdlCommand(message, sock);

                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        });

        sock.ev.on('group-participants.update', async (update) => {
            try {
                await handleGroupParticipantUpdate(sock, update);
            } catch (error) {
                console.error('Error handling group participant update:', error);
            }
        });

    } catch (error) {
        console.error('Failed to start bot:', error);
    }
}

startBot();
