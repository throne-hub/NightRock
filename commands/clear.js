module.exports = {
    name: 'clear',
    description: 'Clears a specified number of messages from the channel.',
    author: 'Thorne',
    version: '1.0',
    category: 'utility',
    emoji: '🧹',
    async execute(message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to use this command.');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('Please provide a number between 1 and 100.');
        }

        await message.channel.bulkDelete(amount, true);
        message.channel.send(`Cleared ${amount} messages.`).then(msg => msg.delete({ timeout: 5000 }));
    }
};