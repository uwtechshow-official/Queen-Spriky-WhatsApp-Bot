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
        const menuMessage = `\n🎁Bot Name : ${config.botName}\n\n🎁Bot Version : ${config.version}\n\n🎁Bot Author : ${config.botAuthor}\n\n🎁Prefix: . \n\n Here are the available commands:
        \n\n
╭──── 〔 *Owner Commands* 〕
┊・ 👉| Will Be Available Soon \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *General Commands* 〕
┊・ 👉| .alive - Send Alive Message \n
┊・ 👉| .speedtest - Check The Network Speed \n
┊・ 👉| .ping Check Pin Time With Bot \n
┊・ 👉| .uptime Check The Uptime Of Bot \n
┊・ 👉| .ip - Get Your IP Address \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Group Commands* 〕
┊・ 👉| .promote - Give Admin For Someone \n
┊・ 👉| .demote - Remove Admin From Someone \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *User Commands* 〕
┊・ 👉| .translate <language> <text> - Translate English To Given Language \n
┊・ 👉| .shorturl - Generate Short URLs \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Search Commands* 〕
┊・ 👉| .news <Country> - Get Latest News \n
┊・ 👉| .wiki <Query> - Search On Wikipedia \n
┊・ 👉| .difine <Word> -Get Definition Of A Word \n
┊・ 👉| .github username/repository - Fetch Information of a GitHub repository \n
┊・ 👉| .lyrics <song name> - Search for the lyrics \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Download Commands* 〕
┊・ 👉| .insta <insta url> - Download Insta Video / Photo  \n
┊・ 👉| .yt <youtube url> - Download Youtube Video \n
┊・ 👉| .tiktok <tiktok url> - Download Tiktok Video \n
┊・ 👉| .mega <mega url> - Download Mega File \n
┊・ 👉| .apk <apkname> - Download Apk File \n
┊・ 👉| .mediafire <mediafire url> - Download Mediafire File \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Random Commands* 〕
┊・ 👉| .joke - Get a random joke  \n
┊・ 👉| .quote - Get a random quote \n
╰┈┈┈┈┈┈┈┈
\n\n
╭──── 〔 *Game Commands* 〕
┊・ 👉| .trivia - Play the trivia game  \n
╰┈┈┈┈┈┈┈┈

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
