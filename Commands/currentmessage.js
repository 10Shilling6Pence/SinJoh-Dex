const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('currentmessage')
        .setDescription('Sets or gets the current target message.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Sets the current target message.')
                .addStringOption(option => option.setName('messageid').setDescription('The target message ID').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Gets the current target message.')),
    async execute(interaction) {
        // Assuming you have some logic to handle 'set' and 'get' subcommands
        if (interaction.options.getSubcommand() === 'set') {
            const messageId = interaction.options.getString('messageid');
            // Logic to set the current message ID
            console.log(`Setting current message ID to: ${messageId}`);
            // Respond to interaction
            await interaction.reply({ content: `Current message ID set to: ${messageId}`, ephemeral: false });
        } else if (interaction.options.getSubcommand() === 'get') {
            // Logic to get the current message ID
            console.log(`Getting current message ID`);
            // Assuming you retrieve it from somewhere
            const currentMessageId = '123456789012345678'; // Example ID
            await interaction.reply({ content: `Current message ID is: ${currentMessageId}`, ephemeral: false });
        }
    },
};
