const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createembedmessage')
        .setDescription('Creates a message as an embed in a specified channel.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the embed message to')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Description of the embed')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('hexcode')
                .setDescription('Hex color code for the embed (without the #). Optional.')
                .setRequired(false)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        let hexcode = interaction.options.getString('hexcode');
        
        // Parse hexcode to a number, and provide a default color if not provided
        let color = hexcode ? parseInt(hexcode, 16) : 0x000000; // Default to white if no color provided

        // Ensure the channel is a guild text channel
        if (!channel || channel.type !== ChannelType.GuildText) {
            await interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color); // Set the color of the embed

        // Send the embed to the specified channel
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Embed message sent successfully!', ephemeral: true });
    },
};
