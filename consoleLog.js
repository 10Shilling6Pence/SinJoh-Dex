const { ChannelType } = require('discord.js');
const config = require('./config.json');

const logchannelid = config.logchannelid

// Helper function to format the date and time
function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Custom logging function with timestamp
function customLog(client, message) {
    const timestamp = formatDate(new Date()); // Get current date and time
    const logMessage = `[${timestamp}] ${message}`;

    console.log(logMessage); // Log to the console with timestamp

    // Send the log message to the specified Discord channel
    const logChannel = client.channels.cache.get(logchannelid);
    if (logChannel && logChannel.type === ChannelType.GuildText) {
        logChannel.send(logMessage).catch(console.error);
    } else {
        console.error('Log channel not found or is not a text channel.');
    }
}

module.exports = { customLog };
