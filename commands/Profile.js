const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserCodes } = require('../dbHandler'); // Import the function to get user codes from the database
const { EmbedBuilder } = require('discord.js'); // Ensure correct import for Discord.js v14

// Define the module export for the command
module.exports = {
    // Define the command's data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('profile') // Set the name of the command
        .setDescription('View a user\'s registered friend codes') // Description of the command
        .addUserOption(option =>
            option.setName('user') // Name of the user option
                .setDescription('The user whose profile you want to view') // Description for the user option
                .setRequired(false)), // Make this option not required

    // Define the async function that executes the command
    async execute(interaction) {
        // Get the user from the interaction options, defaulting to the interaction user if not specified
        const user = interaction.options.getUser('user') || interaction.user;

        try {
            // Fetch the user's codes from the database
            const codes = await getUserCodes(user.id);

            // Check if the user has registered any codes
            if (codes.length === 0) {
                // Reply with a message indicating no codes are registered
                return interaction.reply({ content: 'This user has not registered any codes.', ephemeral: true });
            }

            // Create a new embed to display the user's codes
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Codes`) // Set the title of the embed
                .setThumbnail(user.displayAvatarURL()) // Set the user's avatar as the thumbnail
                .setColor('#0099ff'); // Set the color of the embed

            // Add each code to the embed as a field
            codes.forEach(code => {
                // Format the code into groups of 4 digits separated by hyphens
                const formattedCode = `${code.code.slice(0, 4)}-${code.code.slice(4, 8)}-${code.code.slice(8)}`;
                embed.addFields({ name: code.game, value: formattedCode, inline: true }); // Add the code to the embed
            });

            // Reply with the embed containing the user's codes
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            // Log the error and reply with an error message
            console.error('Error fetching user codes:', error);
            interaction.reply({ content: 'There was an error fetching the user\'s codes. Please try again later.', ephemeral: true });
        }
    }
};
