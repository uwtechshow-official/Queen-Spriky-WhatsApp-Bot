const isAdmin = async (sock, groupId, participant) => {
    const groupMetadata = await sock.groupMetadata(groupId);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    return admins.includes(participant);
};

const handlePromote = async (sock, message) => {
    const quotedMessage = message.message.extendedTextMessage;
    const groupId = message.key.remoteJid;
    const senderId = message.key.participant || message.key.remoteJid;

    if (!quotedMessage) {
        await sock.sendMessage(groupId, {
            text: '⚠️ Please reply to the message of the person you want to promote.'
        }, { quoted: message });
        return;
    }

    const participant = quotedMessage.contextInfo.participant;
    if (!participant) {
        await sock.sendMessage(groupId, {
            text: '⚠️ Could not get participant from the quoted message.'
        }, { quoted: message });
        return;
    }

    if (!(await isAdmin(sock, groupId, senderId))) {
        await sock.sendMessage(groupId, {
            text: '⚠️ You need to be an admin to use this command.'
        }, { quoted: message });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(groupId, [participant], 'promote');
        await sock.sendMessage(groupId, {
            text: `✅ Successfully promoted @${participant.split('@')[0]}`
        }, { quoted: message, mentions: [participant] });
    } catch (error) {
        console.error('Error promoting user:', error);
        await sock.sendMessage(groupId, {
            text: '⚠️ An error occurred while promoting the user.'
        }, { quoted: message });
    }
};

const handleDemote = async (sock, message) => {
    const quotedMessage = message.message.extendedTextMessage;
    const groupId = message.key.remoteJid;
    const senderId = message.key.participant || message.key.remoteJid;

    if (!quotedMessage) {
        await sock.sendMessage(groupId, {
            text: '⚠️ Please reply to the message of the person you want to demote.'
        }, { quoted: message });
        return;
    }

    const participant = quotedMessage.contextInfo.participant;
    if (!participant) {
        await sock.sendMessage(groupId, {
            text: '⚠️ Could not get participant from the quoted message.'
        }, { quoted: message });
        return;
    }

    if (!(await isAdmin(sock, groupId, senderId))) {
        await sock.sendMessage(groupId, {
            text: '⚠️ You need to be an admin to use this command.'
        }, { quoted: message });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(groupId, [participant], 'demote');
        await sock.sendMessage(groupId, {
            text: `✅ Successfully demoted @${participant.split('@')[0]}`
        }, { quoted: message, mentions: [participant] });
    } catch (error) {
        console.error('Error demoting user:', error);
        await sock.sendMessage(groupId, {
            text: '⚠️ An error occurred while demoting the user.'
        }, { quoted: message });
    }
};

module.exports = { handlePromote, handleDemote };
