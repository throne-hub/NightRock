// Example command file (e.g., lookupUser .js)
module.exports = {
    name: 'lookupuser', // Command name
    description: 'Looks up a user and displays their information.',
    author: 'Thorne',
    version: '1.0',
    category: 'info',
    emoji: '🔍',
    execute(message, args) {
        // Check if a user is mentioned or if an ID is provided
        const userMention = args[0]; // Assuming the first argument is the mention
        const userId = userMention ? userMention.replace(/[<@!>]/g, '') : null; // Remove <@!> or <@> to get the user ID
        const user = message.mentions.users.first() || message.guild.members.cache.get(userId)?.user; // Get the user object

        // Check if the author mentions themselves
        if (user && user.id === message.author.id) {
            return message.reply("You cannot look up your own information.");
        }

        if (!user) {
            return message.reply('Please mention a user or provide their ID to look them up. Usage: lookupuser @user or lookupuser userID');
        }

        if (args.length > 1) {
            return message.reply('Please mention only one user at a time.');
        }

        // Get the member object for more information
        const member = message.guild.members.cache.get(user.id);

        // Prepare user information
        const mutualServers = message.client.guilds.cache.filter(guild => guild.members.cache.has(user.id)).map(guild => guild.name).join(', ') || 'No mutual servers';

        const userInfo = `
        **Username:** ${user.username}
        **Discriminator:** #${user.discriminator}
        **ID:** ${user.id}
        **Avatar:** [Click Here](${user.displayAvatarURL()})
        **Created At:** ${user.createdAt.toDateString()}
        **Joined Server At:** ${member.joinedAt.toDateString()}
        **Status:** ${member.presence ? member.presence.status : 'offline'}
        **Roles:** ${member.roles.cache.map(role => role.name).join(', ') || 'No roles'}
        **Mutual Servers:** ${mutualServers}
        `;

        // Send the user information
        message.channel.send(userInfo);
    }
};