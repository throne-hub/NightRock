// Example command file (e.g., isGay.js)
module.exports = {
    name: 'isgay', // Use lowercase for command name
    description: 'Checks how gay a user is, randomly generating a percentage.',
    author: 'Thorne',
    version: '1.0',
    category: 'fun',
    emoji: '🏳️‍🌈',
    execute(message, args) {
        // Check if a user is mentioned
        const userMention = args[0]; // Assuming the first argument is the mention
        const userId = userMention ? userMention.replace(/[<@!>]/g, '') : null; // Remove <@!> or <@> to get the user ID
        const user = message.mentions.users.get(userId); // Get the user object

        if (!user) {
            return message.reply('Please mention a user to check their gay percentage. Usage: isgay @user');
        }

        // Optionally, you can check for additional arguments
        if (args.length > 1) {
            return message.reply('Please mention only one user at a time.');
        }

        // Generate a random percentage between 0 and 100
        const percentage = Math.floor(Math.random() * 101); // Random number between 0 and 100

        // Send the result
        message.channel.send(`${user} is ${percentage}% gay!`);
    }
};