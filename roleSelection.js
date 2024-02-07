const customLog = require('../consoleLog'); // Ensure the path is correct based on your project structure

async function handleRoleSelection(interaction) {
    const selectedValue = interaction.values[0];

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

        // Log the action here, after the role has been successfully added
        customLog(interaction.client, `${interaction.user.username} has been given the ${roleToAdd.name} role.`);

        await interaction.reply({ content: `You have been given the ${roleToAdd.name} role!`, ephemeral: true });
    } catch (error) {
        console.error('Error in handleRoleSelection:', error);
        await interaction.reply({ content: 'There was an error processing your role selection.', ephemeral: true });
    }
}
