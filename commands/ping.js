module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency.',
    author: 'Thorne',
    version: '1.0',
    category: 'utility',
    emoji: '🏓',
    execute(message, args) {
        const ping = Math.round(message.client.ws.ping);
        message.channel.send(`🏓 Pong! Latency is ${ping}ms.`);
    }
};