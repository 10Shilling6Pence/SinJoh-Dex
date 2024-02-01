// roleSelection.js
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

async function sendRoleSelectionMessage(client) {
    const roles = [
        { label: 'Pearl', description: 'Select if you play Pokemon Pearl', value: '1195763170208383066' },
        { label: 'Diamond', description: 'Select if you play Pokemon Diamond', value: '1195763281642672228' },
        { label: 'Platinum', description: 'Select if you play Pokemon PLatinum', value: '1195763444616532080' },
        { label: 'SoulSilver', description: 'Select if you play Pokemon SoulSilver', value: '1195530702133940335' },
        { label: 'HeartGold', description: 'Select if you play Pokemon HeartGold', value: '1195530599616749628' },
        // ... other roles ...
    ];

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select-role')
                .setPlaceholder('Select a role')
                .addOptions(roles),
        );

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Role Selection')
        .setDescription('Choose a role from the dropdown below.');

    const channel = client.channels.cache.get('1195555876820492309');
    channel.send({ embeds: [embed], components: [row] });
}

async function handleRoleSelection(interaction) {
    const selectedRoleId = interaction.values[0];
    const role = interaction.guild.roles.cache.get(selectedRoleId);

    if (role) {
        try {
            await interaction.member.roles.add(role);
            await interaction.reply({ content: `You have been given the ${role.name} role!`, ephemeral: true });
        } catch (error) {
            console.error('Error assigning role:', error);
            await interaction.reply({ content: 'There was an error assigning the role.', ephemeral: true });
        }
    } else {
        await interaction.reply({ content: 'Role not found.', ephemeral: true });
    }
}

module.exports = { sendRoleSelectionMessage, handleRoleSelection };