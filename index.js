const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const roleSelection = require('./roleSelection');
const createmessage = require('./commands/createmessage');
const currentmessage = require('./commands/currentmessage');
const shutdown = require('./commands/shutdown');

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

// When the bot is ready, register the slash commands
client.once('ready', async () => {
    const data = [
        {
            name: 'ping',
            description: 'Replies with Pong!'
        },
        {
            name: 'shutdown',
            description: 'Shuts down the bot'
        },
        {
            name: 'createmessage',
            description: 'Creates a message in a specified channel',
            options: [
                {
                    type: 7, // Channel type
                    name: 'channel',
                    description: 'The channel to send the message to',
                    required: true
                },
                {
                    type: 3, // String type for the message
                    name: 'message',
                    description: 'The message to send',
                    required: true
                }
            ]
        },
        {
            name: 'currentmessage',
            description: 'Designate a target message.',
            options: [
                {
                    type: 7, // Channel type
                    name: 'channel',
                    description: 'The channel of the target message',
                    required: true
                },
                {
                    type: 3, // String type for the Message ID
                    name: 'messageid',
                    description: 'The ID of the target message',
                    required: true
                }
            ]
        }
    ];

    // Register the commands globally or for a specific guild
    await client.application?.commands.set(data);
    console.log('Successfully registered application commands.');
});

// Handling the interaction for the slash commands
let targetMessage = null;

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        } else if (commandName === 'shutdown') {
            await shutdown.handle(interaction);
        } else if (commandName === 'createmessage') {
            await createmessage.handle(interaction);
        } else if (commandName === 'currentmessage') {
            await currentmessage.handle(interaction);
        }
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId === 'select-role') {
            await roleSelection.handleRoleSelection(interaction);
        }
    }
});

client.login('YOUR_BOT-TOKEN');
