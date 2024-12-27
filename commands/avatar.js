module.exports = {
    name: 'avatar',
    description: 'Displays the avatar of a user.',
    author: 'Thorne',
    version: '1.0',
    category: 'utility',
    emoji: '🖼️',
    execute(message, args) {
        const userMention = args[0];
        const userId = userMention ? userMention.replace(/[<@!>]/g, '') : message.author.id;
        const user = message.mentions.users.get(userId) || message.client.users.cache.get(userId);

        if (!user) {
            return message.reply('User  not found.');
        }

        message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
    }
};