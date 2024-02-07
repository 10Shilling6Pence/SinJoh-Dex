const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shuts down the bot if you have the required permissions.'),
    async execute(interaction) {
        // Check for user permission
        if (interaction.user.id === '678067592673493005') { // Replace with your Discord user ID
            await interaction.reply({ content: 'Shutting down...', ephemeral: false });
            process.exit(0); // Safely shuts down the bot
        } else {
            await interaction.reply({ content: 'You do not have permission to shut down the bot.', ephemeral: false });
        }
    },
};