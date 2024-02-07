const { ChannelType } = require('discord.js');
const customLog = require('./consoleLog'); // Adjust the path as necessary

// Helper function to format the date and time
function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function setupMessageLogging(client) {
    client.on('messageDelete', async (message) => {
        if (message.partial) return;

        const timestamp = formatDate(new Date());
        const logMessage = `:wastebasket: ${message.author.tag} (${message.author.id}) message deleted in #**${message.channel.name}**: ${message.content || 'No content'}`;
        customLog(client, logMessage);
    });

    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (oldMessage.partial || newMessage.partial) return;
        if (oldMessage.content === newMessage.content) return;

        const timestamp = formatDate(new Date());
        const logMessage = `:pencil: ${oldMessage.author.tag} (${oldMessage.author.id}) message edited in **#${oldMessage.channel.name}**:\nB: ${oldMessage.content}\nA: ${newMessage.content}`;
        customLog(client, logMessage);
    });
}

module.exports = { setupMessageLogging };
