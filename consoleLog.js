// Import necessary modules from discord.js
const { ChannelType } = require('discord.js');
// Import the configuration file
const config = require('./config.json');

// Extract the log channel ID from the config
const logchannelid = config.logchannelid;

// Helper function to format the date and time
function formatDate(date) {
    // Return the formatted date and time as a string
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Custom logging function with timestamp
function customLog(client, message) {
    const timestamp = formatDate(new Date()); // Get current date and time formatted
    const logMessage = `[${timestamp}] ${message}`; // Prepend timestamp to the message

    console.log(logMessage); // Log the message to the console with timestamp

    // Get the log channel from the client's channel cache using the configured channel ID
    const logChannel = client.channels.cache.get(logchannelid);
    // Check if the log channel is found and is a guild text channel
    if (logChannel && logChannel.type === ChannelType.GuildText) {
        // Send the log message to the log channel
        logChannel.send(logMessage).catch(console.error); // Catch and log any errors that occur while sending
    } else {
        // Log an error if the log channel is not found or is not a text channel
        console.error('Log channel not found or is not a text channel.');
    }
}

// Export the customLog function for use in other modules
module.exports = customLog;
