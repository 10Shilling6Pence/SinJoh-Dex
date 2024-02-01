// currentmessage.js
const { ChannelType } = require('discord.js');

let targetMessage = null; // Holds the target message information

async function handle(interaction) {
    const channel = interaction.options.getChannel('channel');
    const messageId = interaction.options.getString('messageid');

    try {
        const message = await channel.messages.fetch(messageId);
        targetMessage = { channelId: channel.id, messageId: message.id };
        await interaction.reply({ content: `Target message set: ${messageId} in ${channel.name}`, ephemeral: false });
    } catch (error) {
        console.error('Error fetching message:', error);
        await interaction.reply({ content: 'Failed to set the target message. Please check the channel and message ID.', ephemeral: false });
    }
}

function getTargetMessage() {
    return targetMessage;
}

module.exports = { handle, getTargetMessage };
