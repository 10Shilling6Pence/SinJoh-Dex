const { Client, GatewayIntentBits } = require('discord.js'); // Import necessary classes from discord.js
const fs = require('fs'); // Import the file system module
const roleSelection = require('./roleSelection'); // Import the roleSelection module
const customLog = require('./consoleLog'); // Import the custom logging module
const { setupMessageLogging } = require('./messageLogger'); // Import the setupMessageLogging function from messageLogger
const { checkRssFeedAndPost } = require('./reddit'); // Import the checkRssFeedAndPost function from reddit
const config = require('./config.json'); // Import configuration settings

// Initialize the Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for managing guild-related events
    GatewayIntentBits.GuildMessages, // Required for handling guild messages
    GatewayIntentBits.MessageContent // Required for accessing message content
  ]
});

client.commands = new Map(); // Create a map to hold command data

// Read all JavaScript files in the 'commands' directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Dynamically import each command file and store in the client commands map
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command); // Map command name to command object
}

// Event handler for when the client is ready
client.once('ready', async () => {
    customLog(client, 'Bot is ready and operational.'); // Log the bot's readiness
    setupMessageLogging(client, config.logChannelId); // Set up message logging with the specified log channel ID

    // Register slash commands with Discord
    const commandsData = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    try {
        await client.application?.commands.set(commandsData); // Register the commands
        customLog(client, 'Successfully registered application commands.'); // Log successful registration
    } catch (error) {
        console.error('Error registering commands:', error); // Log any errors during registration
    }

    // Send role selection messages
    roleSelection.sendRoleSelectionMessage(client);

    // Schedule RSS feed checks and post updates to Discord
    setInterval(async () => {
        await checkRssFeedAndPost(client, config.redditChannelId); // Check RSS feed and post updates
    }, 60000); // Run every 60 seconds, can be adjusted
});

// Event handler for interactionCreate event
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        // Handle slash commands
        const command = client.commands.get(interaction.commandName); // Get the command object
        if (!command) return;
        try {
            await command.execute(interaction); // Execute the command
        } catch (error) {
            console.error(error); // Log any errors
            await interaction.reply({ content: 'There was an error executing that command.', ephemeral: true }); // Reply with error
        }
    } else if (interaction.isSelectMenu() && interaction.customId === 'select-role') {
        // Handle select menu interactions
        try {
            await roleSelection.handleRoleSelection(interaction); // Handle role selection
        } catch (error) {
            console.error(error); // Log any errors
            await interaction.reply({ content: 'There was an error processing your role selection.', ephemeral: true }); // Reply with error
        }
    }
});

// Log the client in using the token from the config file
client.login(config.token);
