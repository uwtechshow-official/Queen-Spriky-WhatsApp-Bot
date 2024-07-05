const { lyrics } = require('@bochilteam/scraper');
const Genius = require('genius-lyrics');
const axios = require('axios');
const cheerio = require('cheerio');

async function handleLyricsCommand(sock, message) {
    const remoteJid = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text && text.startsWith('.lyrics')) {
        const args = text.split(' ').slice(1);
        let query = args.join(' ');

        if (!query) {
            if (message.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                query = message.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
            } else {
                await sock.sendMessage(remoteJid, { text: 'Enter a music title!\n*Example:* .lyrics hello' });
                return;
            }
        }

        let key = "h6fTn1BYNjYi5VTszhyAFTcM3WWtk2E4hqrXCcutfObE4jVFnJ3LVyewHKIYTli7";
        let Client = new Genius.Client(key);
        let nothing = "Not known!";

        try {
            let bocil = await lyrics(query);
            let bocap = `*乂 Title 乂*\n${bocil.title ? bocil.title : nothing}\n\n*乂 Lyrics 乂*\n${bocil.lyrics ? bocil.lyrics : nothing}\n\n*乂 Singer 乂*\n${bocil.author ? bocil.author : nothing}\n\n*乂 Url 乂*\n${bocil.link ? bocil.link : nothing}\n\n_By Queen Spriky WhatsApp Bot._`;
            await sock.sendMessage(remoteJid, { text: bocap });
        } catch (e) {
            try {
                let song = await Client.songs.search(query);
                let jenius = song[0];
                let albert = `*乂 Title 乂*\n${jenius.title ? jenius.title : nothing}\n\n*乂 Lyrics 乂*\n${await getLyrics(jenius.url)}\n\n*乂 Singer 乂*\n${jenius.artist.name ? jenius.artist.name : nothing}\n\n*乂 Url 乂*\n${jenius.url ? jenius.url : nothing}\n\n_By Queen Spriky WhatsApp Bot 2024._`;
                await sock.sendMessage(remoteJid, { text: albert });
            } catch (e) {
                try {
                    const { data } = await axios.get("https://www.lyricsfreak.com/search.php?a=search&q=" + query);
                    let $ = cheerio.load(data);
                    let h1 = $(".song");
                    const hh = h1.attr("href");
                    const huu = await axios.get("https://www.lyricsfreak.com" + hh);
                    let s = cheerio.load(huu.data);
                    let h2 = s(".lyrictxt").text();
                    let frank = `*乂 Lyrics 乂*\n${h2}\n\n_By lyricsfreak_\n\n_By Queen Spriky WhatsApp Bot 2024._`;
                    await sock.sendMessage(remoteJid, { text: frank });
                } catch (e) {
                    await sock.sendMessage(remoteJid, { text: 'Failed to fetch lyrics. Please try again later.🙁' });
                }
            }
        }
    }
}

module.exports = handleLyricsCommand;

async function getLyrics(url) {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    let lyrics = '';
    $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
            const snippet = $(elem)
                .html()
                .replace(/<br>/g, '\n')
                .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
            lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
        }
    });
    return lyrics;
}
