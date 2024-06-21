const { SlashCommandBuilder, ChannelType } = require('discord.js');

// Define the module export for the command
module.exports = {
    // Define the command's data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('createmessage') // Set the name of the command
        .setDescription('Creates a message in a specified channel.') // Description of the command
        .addChannelOption(option => 
            option.setName('channel') // Name of the channel option
                .setDescription('The channel to send the message to') // Description for the channel option
                .setRequired(true)) // Making this option required
        .addStringOption(option =>
            option.setName('message') // Name of the message option
                .setDescription('The message to send') // Description for the message option
                .setRequired(true)), // Making this option required

    // Define the async function that executes the command
    async execute(interaction) {
        // Get the channel from the interaction options
        const channel = interaction.options.getChannel('channel');
        // Get the message content from the interaction options
        const messageContent = interaction.options.getString('message');

        // Ensure the channel is a guild text channel
        if (!channel || channel.type !== ChannelType.GuildText) {
            // Reply with an error message if the channel is not valid
            await interaction.reply({ content: 'Please select a valid text channel.', ephemeral: false });
            return;
        }

        // Send the message to the specified channel
        await channel.send(messageContent);
        // Confirm success by replying to the interaction
        await interaction.reply({ content: 'Message sent successfully!', ephemeral: false });
    },
};
