const customLog = require('./consoleLog'); // Import the custom logging function
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js'); // Import necessary classes from discord.js

// Function to send the role selection message to a Discord channel
async function sendRoleSelectionMessage(client) {
    customLog(client, 'Sending role selection message...'); // Log the start of the message sending process

    // Create a select menu with options for different roles
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-role') // Set the custom ID for the select menu
        .setPlaceholder('Select a role') // Set placeholder text
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Pearl') // Label for the menu option
                .setDescription('I play Pokemon Pearl!') // Description for the option
                .setValue('1195763170208383066'), // Value for the option, typically a role ID
            new StringSelectMenuOptionBuilder()
                .setLabel('Diamond')
                .setDescription('I play Pokemon Diamond!')
                .setValue('1195763281642672228'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Platinum')
                .setDescription('I play Pokemon Platinum!')
                .setValue('1195763444616532080'),
            new StringSelectMenuOptionBuilder()
                .setLabel('HeartGold')
                .setDescription('I play Pokemon HeartGold!')
                .setValue('1195530599616749628'),
            new StringSelectMenuOptionBuilder()
                .setLabel('SoulSilver')
                .setDescription('I play Pokemon SoulSilver!')
                .setValue('1195530702133940335'),
        );

    // Create an action row to hold the select menu
    const row = new ActionRowBuilder()
        .addComponents(selectMenu);

    // Create an embed to accompany the select menu
    const embed = new EmbedBuilder()
        .setColor('#0099ff') // Set the embed color
        .setTitle('Pokemon, Generation IV!') // Set the embed title
        .setDescription('Select your favorite Gen IV game below. Your selection can be changed at any time.') // Set the embed description
        .setThumbnail('https://imgur.com/7OoTJRu.png'); // Set a thumbnail image for the embed

    try {
        // Fetch the channel where the message will be sent
        const channel = client.channels.cache.get('1195555876820492309');
        if (!channel) {
            console.error('Channel not found'); // Log an error if the channel is not found
            return;
        }

        // Send the embed and the select menu to the channel
        await channel.send({ embeds: [embed], components: [row] });
        customLog(client, 'Role selection message sent successfully.'); // Log the success of the message sending
    } catch (error) {
        console.error('Error sending role selection message:', error); // Log any errors that occur
    }
}

// Function to handle role selection from the select menu
async function handleRoleSelection(interaction) {
    const selectedValue = interaction.values[0]; // Get the selected role ID from the interaction

    // List of all possible role IDs
    const allRoleIds = ['1195763170208383066', '1195763281642672228', '1195763444616532080', '1195530599616749628', '1195530702133940335'];

    try {
        // Remove all roles except the selected one
        await Promise.all(
            allRoleIds
                .filter(roleId => roleId !== selectedValue) // Filter out the selected role
                .map(roleId => {
                    const roleToRemove = interaction.guild.roles.cache.get(roleId); // Get the role to remove
                    if (roleToRemove) {
                        return interaction.member.roles.remove(roleToRemove); // Remove the role from the member
                    }
                })
        );

        // Add the selected role to the member
        const roleToAdd = interaction.guild.roles.cache.get(selectedValue);
        if (!roleToAdd) {
            throw new Error('Role not found'); // Throw an error if the role is not found
        }
        await interaction.member.roles.add(roleToAdd); // Add the role to the member

        // Log the role assignment
        customLog(interaction.client, `${interaction.user.username} has been given the ${roleToAdd.name} role.`);

        // Reply to the interaction confirming the role assignment
        await interaction.reply({ content: `You have been given the ${roleToAdd.name} role!`, ephemeral: true });
    } catch (error) {
        console.error('Error in handleRoleSelection:', error); // Log any errors that occur
        await interaction.reply({ content: 'There was an error processing your role selection.', ephemeral: true }); // Reply with an error message
    }
}

module.exports = { sendRoleSelectionMessage, handleRoleSelection }; // Export the functions for use in other modules
