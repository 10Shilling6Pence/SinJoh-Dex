const { ChannelType } = require('discord.js'); // Import necessary classes from discord.js
const customLog = require('./consoleLog'); // Import the custom logging function

// Helper function to format the date and time
function formatDate(date) {
    // Format the date as MM/DD/YYYY and time as HH:MM:SS (24-hour format)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Function to set up message logging for message deletions and edits
function setupMessageLogging(client) {
    // Event handler for message deletions
    client.on('messageDelete', async (message) => {
        // Ignore partial messages that are not fully fetched
        if (message.partial) return;

        const timestamp = formatDate(new Date()); // Get the current timestamp
        // Create a log message for the deleted message
        const logMessage = `:wastebasket: ${message.author.tag} (${message.author.id}) message deleted in #**${message.channel.name}**: ${message.content || 'No content'}`;
        customLog(client, logMessage); // Log the message using customLog
    });

    // Event handler for message edits
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        // Ignore partial messages and edits with no content change
        if (oldMessage.partial || newMessage.partial) return;
        if (oldMessage.content === newMessage.content) return;

        const timestamp = formatDate(new Date()); // Get the current timestamp
        // Create a log message for the edited message, showing before and after content
        const logMessage = `:pencil: ${oldMessage.author.tag} (${oldMessage.author.id}) message edited in **#${oldMessage.channel.name}**:\nB: ${oldMessage.content}\nA: ${newMessage.content}`;
        customLog(client, logMessage); // Log the message using customLog
    });
}

module.exports = { setupMessageLogging }; // Export the setupMessageLogging function
