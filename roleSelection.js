// roleSelection.js
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

async function sendRoleSelectionMessage(client) {
    console.log("Sending role selection message...");
    //const roles = [
        //{ label: 'Pearl', description: 'Select if you play Pokemon Pearl', value: '1195763170208383066' },
        //{ label: 'Diamond', description: 'Select if you play Pokemon Diamond', value: '1195763281642672228' },
        //{ label: 'Platinum', description: 'Select if you play Pokemon Platinum', value: '1195763444616532080' },
        //{ label: 'SoulSilver', description: 'Select if you play Pokemon SoulSilver', value: '1195530702133940335' },
       // { label: 'HeartGold', description: 'Select if you play Pokemon HeartGold', value: '1195530599616749628' },
        // ... other roles ...
    //];

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select-role')
        .setPlaceholder('Select a role')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Pearl')
                .setDescription('I play Pokemon Pearl!')
                .setValue('1195763170208383066'),
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

    const row = new ActionRowBuilder()
        .addComponents(selectMenu);

    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Pokemon, Generation IV!')
        .setDescription('Select your favorite Gen IV game below. Your selection can be changed at any time.')
        .setThumbnail('https://imgur.com/7OoTJRu.png');

    try {
        const channel = client.channels.cache.get('1195555876820492309');
        if (!channel) {
            console.error('Channel not found');
            return;
        }
        
        await channel.send({ embeds: [embed], components: [row] });
        console.log("Role selection message sent successfully.");
    } catch (error) {
        console.error('Error sending role selection message:', error);
    }
}

async function handleRoleSelection(interaction) {
    const selectedValue = interaction.values[0];
    console.log(`Selected Role ID: ${selectedValue}`);

    // IDs of all roles that can be selected
    const allRoleIds = ['1195763170208383066', '1195763281642672228', '1195763444616532080', '1195530599616749628', '1195530702133940335'];

    try {
        // Remove all selectable roles except the one just selected
        await Promise.all(
            allRoleIds
                .filter(roleId => roleId !== selectedValue)
                .map(roleId => {
                    const roleToRemove = interaction.guild.roles.cache.get(roleId);
                    if (roleToRemove) {
                        return interaction.member.roles.remove(roleToRemove);
                    }
                })
        );

        // Add the selected role
        const roleToAdd = interaction.guild.roles.cache.get(selectedValue);
        if (!roleToAdd) {
            throw new Error('Role not found');
        }
        await interaction.member.roles.add(roleToAdd);

        await interaction.reply({ content: `You have been given the ${roleToAdd.name} role!`, ephemeral: true });
    } catch (error) {
        console.error('Error in handleRoleSelection:', error);
        await interaction.reply({ content: 'There was an error processing your role selection.', ephemeral: true });
    }
}

module.exports = { sendRoleSelectionMessage, handleRoleSelection };
