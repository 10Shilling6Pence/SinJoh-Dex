const { SlashCommandBuilder } = require('discord.js');

// Define the module export for the command
module.exports = {
    // Define the command's data using SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('currentmessage') // Set the name of the command
        .setDescription('Sets or gets the current target message.') // Description of the command
        .addSubcommand(subcommand =>
            subcommand
                .setName('set') // Name of the subcommand
                .setDescription('Sets the current target message.') // Description for the subcommand
                .addStringOption(option => 
                    option.setName('messageid') // Name of the option
                        .setDescription('The target message ID') // Description for the option
                        .setRequired(true))) // Making this option required
        .addSubcommand(subcommand =>
            subcommand
                .setName('get') // Name of the subcommand
                .setDescription('Gets the current target message.')), // Description for the subcommand

    // Define the async function that executes the command
    async execute(interaction) {
        // Check which subcommand is being used
        if (interaction.options.getSubcommand() === 'set') {
            const messageId = interaction.options.getString('messageid'); // Get the message ID from the options
            // Logic to set the current message ID
            console.log(`Setting current message ID to: ${messageId}`);
            // Respond to interaction confirming the action
            await interaction.reply({ content: `Current message ID set to: ${messageId}`, ephemeral: false });
        } else if (interaction.options.getSubcommand() === 'get') {
            // Logic to get the current message ID
            console.log(`Getting current message ID`);
            // Example: Retrieve the current message ID (this should be replaced with actual retrieval logic)
            const currentMessageId = '123456789012345678'; // Example message ID
            // Respond to interaction with the current message ID
            await interaction.reply({ content: `Current message ID is: ${currentMessageId}`, ephemeral: false });
        }
    },
};
