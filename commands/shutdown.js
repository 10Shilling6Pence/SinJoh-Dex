const { SlashCommandBuilder } = require('discord.js');

// Define the module export for the command
module.exports = {
    // Define the command's data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('shutdown') // Set the name of the command
        .setDescription('Shuts down the bot if you have the required permissions.'), // Description of the command

    // Define the async function that executes the command
    async execute(interaction) {
        // Check if the user has the required permissions by verifying their user ID
        if (interaction.user.id === '678067592673493005') { // Replace with your Discord user ID
            // Respond to interaction indicating that the bot is shutting down
            await interaction.reply({ content: 'Shutting down...', ephemeral: false });
            process.exit(0); // Safely shuts down the bot by exiting the process
        } else {
            // Respond to interaction indicating lack of permission to shut down the bot
            await interaction.reply({ content: 'You do not have permission to shut down the bot.', ephemeral: false });
        }
    },
};
