const fs = require('fs');
const config = require('../config');

async function handleMenuCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const msg = message.message;
    const senderId = message.key.participant || message.key.remoteJid;

    if (!remoteJid || !msg) {
        return;
    }

    const text = msg.conversation || msg.extendedTextMessage?.text;
    if (text && text.trim() === '.menu') {
        const menuMessage = `Hi, @${senderId.split('@')[0]},\nHere is my menu:\n
🎁Bot Name : ${config.botName}\n
🎁Bot Version : ${config.version}\n
🎁Bot Author : ${config.botAuthor}\n
🎁Prefix: .\n
\n\n
╭──── 〔 *Owner Commands* 〕\n
┊・ 👉| Will Be Available Soon\n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *General Commands* 〕\n
┊・ 👉| .alive - Send Alive Message\n
┊・ 👉| .speedtest - Check The Network Speed\n
┊・ 👉| .ping - Check Ping Time With Bot\n
┊・ 👉| .uptime - Check The Uptime Of Bot\n
┊・ 👉| .ip - Get Your IP Address\n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Group Commands* 〕\n
┊・ 👉| .promote - Give Admin To Someone\n
┊・ 👉| .demote - Remove Admin From Someone\n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *User Commands* 〕\n
┊・ 👉| .translate <language> <text> - Translate English To Given Language\n
┊・ 👉| .shorturl - Generate Short URLs\n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Search Commands* 〕\n
┊・ 👉| .news <Country> - Get Latest News\n
┊・ 👉| .wiki <Query> - Search On Wikipedia\n
┊・ 👉| .define <Word> - Get Definition Of A Word\n
┊・ 👉| .github username/repository - Fetch Information of a GitHub repository\n
┊・ 👉| .lyrics <song name> - Search for the lyrics\n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Download Commands* 〕\n
┊・ 👉| .insta <insta url> - Download Insta Video / Photo\n
┊・ 👉| .tiktok <tiktok url> - Download TikTok Video\n
┊・ 👉| .mega <mega url> - Download Mega File\n
┊・ 👉| .apk <apkname> - Download Apk File\n
┊・ 👉| .mediafire <mediafire url> - Download Mediafire File\n
┊・ 👉| .scdl <sound cloud url> - Download Audio File\n
┊・ 👉| .twitterdl <twitter url> - Download Twitter Video\n
┊・ 👉| .gdrive <google drive url> - Download Google Drive\n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Random Commands* 〕\n
┊・ 👉| .joke - Get a random joke\n
┊・ 👉| .quote - Get a random quote\n
╰┈┈┈┈┈┈┈┈

╭──── 〔 *Game Commands* 〕\n
┊・ 👉| .trivia - Play the trivia game\n
╰┈┈┈┈┈┈┈┈

> ${config.botFooter}
`;

        const imagePath = 'Media/menu.jpg'; 

        try {
            const imageBuffer = fs.readFileSync(imagePath);

            await sock.sendMessage(remoteJid, {
                image: imageBuffer,
                caption: menuMessage,
                mentions: [senderId]
            }, { quoted: message });
            console.log(`Replied to command .menu from ${remoteJid}`);
            await sock.sendMessage(remoteJid, { react: { text: '🤖', key: message.key } });
        } catch (error) {
            console.error('Failed to send menu command image message:', error);
        }
    }
}

module.exports = handleMenuCommand;
