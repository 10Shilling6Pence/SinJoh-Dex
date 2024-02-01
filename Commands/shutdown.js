// shutdown.js
async function handle(interaction) {
    if (interaction.user.id === '678067592673493005') { // Your Discord user ID
        await interaction.reply({ content: 'Shutting down...', ephemeral: false });
        interaction.client.destroy();
    } else {
        await interaction.reply({ content: 'You do not have permission to shut down the bot.', ephemeral: false });
    }
}

module.exports = { handle };
