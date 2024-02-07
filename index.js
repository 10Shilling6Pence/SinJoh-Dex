const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const roleSelection = require('./roleSelection');
const customLog = require('./consoleLog');
const { setupMessageLogging } = require('./messageLogger');
const { fetchNewRedditPosts } = require('./reddit'); // Ensure reddit.js is correctly required
const config = require('./config.json');

// Initialize the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Dynamically import commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    customLog(client, 'Bot is ready and operational.');
    setupMessageLogging(client, config.logChannelId); // Corrected variable name

    // Register commands
    const commandsData = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    try {
        await client.application?.commands.set(commandsData);
        customLog(client, 'Successfully registered application commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }

    // Additional setup like sending role selection messages
    roleSelection.sendRoleSelectionMessage(client);

    // Schedule Reddit post checking and posting to Discord
    setInterval(async () => {
        try {
            const newPosts = await fetchNewRedditPosts(config.subredditName);
            const channel = await client.channels.fetch(config.discordChannelId);
            for (const post of newPosts) {
                const message = `New post on r/${config.subredditName}\n**${post.title}**\n${post.url}`;
                await channel.send(message);
            }
        } catch (error) {
          console.error('Error fetching or sending posts:', error);
        }
    }, 60000); // Check every 60 seconds, adjust as needed
});

// Handling the interaction for the slash commands and select menus
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true });
        }
    } else if (interaction.isSelectMenu() && interaction.customId === 'select-role') {
        try {
            await roleSelection.handleRoleSelection(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error processing your role selection.', ephemeral: true });
        }
    }
});

client.login(config.token);
