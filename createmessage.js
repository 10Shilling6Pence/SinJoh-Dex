// createmessage.js
const { ChannelType } = require('discord.js');

async function handle(interaction) {
    const channel = interaction.options.getChannel('channel');
    const messageToSend = interaction.options.getString('message');

    // Log channel details for debugging
    console.log(channel);
    console.log(`Channel Type: ${channel.type}`);

    // Check if the selected channel is a text channel
    if (!channel || channel.type !== ChannelType.GuildText) {
        await interaction.reply({ content: 'Invalid channel selected. Please select a text channel.', ephemeral: false });
        return;
    }

    try {
        // Send the message to the selected channel
        await channel.send(messageToSend);
        await interaction.reply({ content: `Message received. Output to #${channel.name} successfully.`, ephemeral: false });
    } catch (error) {
        // Error handling
        console.error('Error sending message:', error);
        await interaction.reply({ content: 'Failed to send the message. Please check my permissions and try again.', ephemeral: false });
    }
}

module.exports = { handle };