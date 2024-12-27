// index.js
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const client = new Client();
const commandsDir = path.join(__dirname, 'commands');

// Load commands dynamically
client.commands = new Map();

const loadCommands = () => {
    client.commands.clear(); // Clear existing commands
    fs.readdirSync(commandsDir).forEach(file => {
        if (file.endsWith('.js')) {
            const command = require(path.join(commandsDir, file));
            console.log("Loaded: " + command.name + ".js");
            client.commands.set(command.name, command);
        }
    });
};

// Initial load of commands
loadCommands();
client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);

    // Rotating status functionality
    let statusIndex = 0;
    const updateStatus = () => {
        if (config.status && config.status.length > 0) {
            client.user.setActivity(config.status[statusIndex], { type: 'WATCHING' });
            statusIndex = (statusIndex + 1) % config.status.length; // Cycle through the status array
        }
    };

    // Update status every 5 seconds
    setInterval(updateStatus, 5000);
    updateStatus(); // Set initial status

    // Check if the server exists
    const guildName = 'NightRock';
    let guild = client.guilds.cache.find(g => g.name === guildName);

    if (!guild) {
        // Create a new server (guild) if it doesn't exist
        try {
            guild = await client.guilds.create(guildName, {
                region: 'us-central', // Specify the region
            });
            console.log(`Created new server: ${guild.name}`);
        } catch (error) {
            console.error('Error creating server:', error);
            return;
        }
    } else {
        console.log(`Found existing server: ${guild.name}`);
    }

    // Remove existing channels and categories
    const existingChannels = guild.channels.cache;
    for (const channel of existingChannels.values()) {
        try {
            await channel.delete();
            console.log(`Deleted channel: ${channel.name}`);
        } catch (error) {
            console.error(`Error deleting channel ${channel.name}:`, error);
        }
    }

    // Create new channels
    const channels = [
        { name: 'general', message: 'Please enter commands here to avoid any Discord bans from servers.' },
        { name: 'logs', message: 'Bot logs will be sent here.' },
        { name: 'rules', message: 'Please do not spam or misuse the bot.' },
        { name: 'statuses', message: 'Commands are strictly enforced here.' }
    ];

    let logChannel; // Variable to hold the logs channel reference

    const createdChannels = []; // Array to hold created channels

    for (const channelInfo of channels) {
        try {
            const channel = await guild.channels.create(channelInfo.name, {
                type: 'GUILD_TEXT', // Specify the channel type
            });
            console.log(`Created channel: ${channelInfo.name}`);
            createdChannels.push({ channel, message: channelInfo.message }); // Store the created channel and its message

            // Store a reference to the logs channel
            if (channelInfo.name === 'logs') {
                logChannel = channel; // Save the logs channel reference
            }
        } catch (error) {
            console.error(`Error creating channel ${channelInfo.name}:`, error);
        }
    }

    // Send a message to each created channel
    for (const { channel, message } of createdChannels) {
        try {
            await channel.send(message);
            console.log(`Sent message to ${channel.name}: ${message}`);
        } catch (error) {
            console.error(`Error sending message to ${channel.name}:`, error);
        }
    }

    // Define the GetLog function
    const GetLog = async (logMessage) => {
        if (logChannel) {
            try {
                await logChannel.send (logMessage);
                console.log(`Log message sent: ${logMessage}`);
            } catch (error) {
                console.error(`Error sending log message:`, error);
            }
        } else {
            console.error('Log channel not found.');
        }
    };

    // Example usage of GetLog
    await GetLog("Log message v1");
});

// Debounce function to limit the rate of command reloads
let reloadTimeout;

fs.watch(commandsDir, (eventType, filename) => {
    if (filename.endsWith('.js')) {
        if (reloadTimeout) {
            clearTimeout(reloadTimeout); // Clear the previous timeout
        }
        reloadTimeout = setTimeout(() => {
            console.log(`Detected ${eventType} on ${filename}. Reloading commands...`);
            delete require.cache[require.resolve(path.join(commandsDir, filename))]; // Clear the cache
            loadCommands(); // Reload commands
        }, 100); // Adjust the timeout as needed (100ms in this case)
    }
});

client.on('messageCreate', async (message) => {
    // Check if the message starts with any of the prefixes
    const prefix = config.prefix.find(p => message.content.startsWith(p));
    if (!prefix) return; // If no prefix matches, exit

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command!');
        }
    } else if (commandName === "help") {
        let helpMessage = "🌟 **Available Commands** 🌟\n\n";

        // Create an object to hold categories
        const categories = {};

        // Populate categories with commands
        client.commands.forEach(cmd => {
            // Check if the emoji is already used in the category
            if (!categories[cmd.category]) {
                categories[cmd.category] = { commands: [], emojis: new Set() }; // Initialize the category if it doesn't exist
            }

            // Check for duplicate emoji
            if (!categories[cmd.category].emojis.has(cmd.emoji)) {
                categories[cmd.category].commands.push(`🔹 ${cmd.emoji} ${prefix}${cmd.name} - ${cmd.description} (Author: ${cmd.author}, Version: ${cmd.version})`);
                categories[cmd.category].emojis.add(cmd.emoji); // Add emoji to the set
            }
        });

        // Add categories to the help message
        for (const [category, { commands }] of Object.entries(categories)) {
            if (commands.length > 0) {
                helpMessage += `🛠️ **${category.charAt(0).toUpperCase() + category.slice(1)} Commands**:\n` + commands.join('\n') + "\n\n";
            }
        }

        helpMessage += "✨ **Use the commands wisely!** ✨";

        // Send the help message
        message.channel.send(helpMessage);
    }
});
client.login(config.token); // Replace with your token