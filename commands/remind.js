module.exports = {
    name: 'remind',
    description: 'Sets a reminder for a user.',
    author: 'Thorne',
    version: '1.0',
    category: 'utility',
    emoji: '⏰',
    async execute(message, args) {
        const time = parseInt(args[0]);
        const reminder = args.slice(1).join(' ');

        if (isNaN(time) || time <= 0) {
            return message.reply('Please provide a valid time in seconds.');
        }

        message.channel.send(`Reminder set for ${time} seconds!`);

        setTimeout(() => {
            message.channel.send(`⏰ Reminder: ${reminder}`);
        }, time * 1000);
    }
};