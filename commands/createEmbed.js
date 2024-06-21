const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

// Define the module export for the command
module.exports = {
    // Define the command's data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('createembedmessage') // Set the name of the command
        .setDescription('Creates a message as an embed in a specified channel.') // Description of the command
        .addChannelOption(option => 
            option.setName('channel') // Name of the channel option
                .setDescription('The channel to send the embed message to') // Description for the channel option
                .setRequired(true)) // Making this option required
        .addStringOption(option => 
            option.setName('title') // Name of the title option
                .setDescription('Title of the embed') // Description for the title option
                .setRequired(true)) // Making this option required
        .addStringOption(option => 
            option.setName('description') // Name of the description option
                .setDescription('Description of the embed') // Description for the description option
                .setRequired(true)) // Making this option required
        .addStringOption(option => 
            option.setName('hexcode') // Name of the hexcode option
                .setDescription('Hex color code for the embed (without the #). Optional.') // Description for the hexcode option
                .setRequired(false)), // Making this option optional

    // Define the async function that executes the command
    async execute(interaction) {
        // Get the channel from the interaction options
        const channel = interaction.options.getChannel('channel');
        // Get the title from the interaction options
        const title = interaction.options.getString('title');
        // Get the description from the interaction options
        const description = interaction.options.getString('description');
        // Get the hex code from the interaction options, if provided
        let hexcode = interaction.options.getString('hexcode');
        
        // Parse hexcode to a number, and provide a default color if not provided
        let color = hexcode ? parseInt(hexcode, 16) : 0x000000; // Default to black if no color provided

        // Ensure the channel is a guild text channel
        if (!channel || channel.type !== ChannelType.GuildText) {
            await interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true }); // Reply with an error message
            return;
        }

        // Create a new embed with the provided title, description, and color
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color); // Set the color of the embed

        // Send the embed to the specified channel
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Embed message sent successfully!', ephemeral: true }); // Confirm success
    },
};
