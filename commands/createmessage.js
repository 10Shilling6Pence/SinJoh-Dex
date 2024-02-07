const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createmessage')
        .setDescription('Creates a message in a specified channel.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the message to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const messageContent = interaction.options.getString('message');

        // Ensure the channel is a guild text channel
        if (!channel || channel.type !== 'GUILD_TEXT') {
            await interaction.reply({ content: 'Please select a valid text channel.', ephemeral: false });
            return;
        }

        // Send the message to the specified channel
        await channel.send(messageContent);
        await interaction.reply({ content: 'Message sent successfully!', ephemeral: false });
    },
};