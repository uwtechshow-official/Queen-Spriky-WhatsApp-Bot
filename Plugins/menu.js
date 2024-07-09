const fs = require('fs');
const config = require('.././config'); 

async function handleMenuCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;

    if (!remoteJid || !msg) {
        return;
    }

    const text = msg.conversation || msg.extendedTextMessage?.text;
    if (text && text.trim() === '.menu') {
        const menuMessage = `\n🎁Bot Name : ${config.botName}\n\n🎁Bot Version : ${config.version}\n\n🎁Bot Author : ${config.botAuthor}\n\n🎁Prefix: Multi Prefix\n\n Here are the available commands:

    
        \n\n*🦄General Commands*
        \n👋 .alive - Check if the bot is alive
        \n👋 .speedtest - Check the network speed
        \n👋 .ping - Check the ping time of the bot
        \n👋 .uptime - Check the uptime of the bot
        \n👋 .ip - Find Your Ip Adreess

        \n\n*🦄User Commands*
        \n👉 .translate <lang> <text> - Tranlate the english Text To Other Languages
        \n👉 .shorturl <link> - Generate short urls for the given url
        


        \n\n*🦄Search Commands*
        \n🤘 .news <country> - Get the latest news articles
        \n🤘 .wiki <query> - Search Wikipedia
        \n🤘 .define <word> - Get the definition of a word
        \n🤘 .github username/repository - Fetch Information of a GitHub repository
        \n🤘 .lyrics <song name> - Search for the lyrics


        \n\n*🦄Download Commands*
        \n🤙 .insta <insta url> - Download Insta Video / Photo 
        \n🤙 .yt <youtube url> - Download Youtube Video
        \n🤙 .tiktok <tiktok url> - Download Tiktok Video
        \n🤙 .mega <mega url> - Download Mega File
        \n🤙 .apk <apkname> - Download Apk File
        \n🤙 .mediafire <mediafire url> - Download Mediafire File


        \n\n*🦄Random Commands*
        \n👏 .joke - Get a random joke
        \n👏 .quote - Get a random quote

        \n\n*🦄Game Commands*
        \n🤟 .trivia - Play the trivia game
        \n\n> ${config.botFooter}
        `;

        const imagePath = 'Media/menu.jpg'; 

        try {
            const imageBuffer = fs.readFileSync(imagePath);

            await sock.sendMessage(remoteJid, { react: { text: '🤖', key: message.key } });

            await sock.sendMessage(remoteJid, {
                image: imageBuffer,
                caption: menuMessage,
                quotedMessageId: message.messageID 
            });
            console.log(`Replied to command .menu from ${remoteJid}`);
        } catch (error) {
            console.error('Failed to send menu command image message:', error);
        }
    }
}

module.exports = handleMenuCommand;
