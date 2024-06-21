const { SlashCommandBuilder } = require('@discordjs/builders');
const { registerUserCode } = require('../dbHandler'); // Import the function to register user codes in the database

// Define the module export for the command
module.exports = {
    // Define the command's data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('register') // Set the name of the command
        .setDescription('Register your 12-digit game code') // Description of the command
        .addStringOption(option =>
            option.setName('game') // Name of the game option
                .setDescription('Select your game') // Description for the game option
                .setRequired(true) // Make this option required
                .addChoices( // Add choices for different games
                    { name: 'HeartGold', value: 'HeartGold' },
                    { name: 'SoulSilver', value: 'SoulSilver' },
                    { name: 'Diamond', value: 'Diamond' },
                    { name: 'Pearl', value: 'Pearl' },
                    { name: 'Platinum', value: 'Platinum' }
                ))
        .addStringOption(option =>
            option.setName('code') // Name of the code option
                .setDescription('Your 12-digit game code') // Description for the code option
                .setRequired(true)), // Make this option required

    // Define the async function that executes the command
    async execute(interaction) {
        const game = interaction.options.getString('game'); // Get the selected game from the options
        const code = interaction.options.getString('code'); // Get the game code from the options
        const discordId = interaction.user.id; // Get the Discord user ID of the interaction user

        // Validate that the code is a 12-digit number
        if (!/^\d{12}$/.test(code)) {
            return interaction.reply({ content: 'The code must be a 12-digit number.', ephemeral: true }); // Reply with an error if validation fails
        }

        try {
            // Attempt to register the user's game code in the database
            await registerUserCode(discordId, game, code);
            // Respond with a success message if registration is successful
            interaction.reply({ content: `Your code for ${game} has been registered successfully!`, ephemeral: true });
        } catch (error) {
            // Log any errors and respond with an error message
            console.error('Error registering user code:', error);
            interaction.reply({ content: 'There was an error registering your code. Please try again later.', ephemeral: true });
        }
    }
};
