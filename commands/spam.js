// Example command file (e.g., spam.js)
module.exports = {
    name: 'spam',
    description: 'Spams a user-defined message in the channel.',
    author: 'Thorne',
    version: '1.0',
    category: 'fun', // Specify the category here
    emoji: '📢', // Specify the emoji here
    async execute(message, args) {
        // Check if the user provided enough arguments
        if (args.length < 2) {
            return message.reply('Please provide a message and the number of times to spam. Usage: !spam <message> <count>');
        }

        // Extract the count from the last argument
        const count = parseInt(args.pop()); // Remove the last argument and parse it as an integer

        // Join the remaining arguments as the message
        const spamMessage = args.join(' '); // Join the remaining arguments into a single string

        // Validate the count
        if (isNaN(count) || count <= 0 || count > 1000) {
            return message.reply('Please provide a valid number of times to spam (1-1000).');
        }

        // Send the spam messages aggressively
        for (let i = 0; i < count; i++) {
            // Use a minimal delay to send messages as fast as possible
            setTimeout(() => {
                message.channel.send(spamMessage).catch(err => {
                    console.error('Failed to send message:', err);
                });
            }, 0); // No delay
        }
    }
};