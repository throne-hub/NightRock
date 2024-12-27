// commands/math.js
const { create, all } = require('mathjs');

const math = create(all);

module.exports = {
    name: 'math', // Use lowercase for command name
    description: 'Perform complex algebraic equations.',
    author: 'Thorne',
    version: '1.0',
    category: 'utility',
    emoji: '🧮',
    execute(message, args) {
        // Join the arguments to form the equation
        const equation = args.join(' ');

        try {
            // Evaluate the equation using mathjs
            const result = math.evaluate(equation);

            // Send the result back to the channel
            message.channel.send(`Result: ${result}`);
        } catch (error) {
            // If there's an error, send it back to the channel
            message.channel.send(`Error: \`\`\`js\n${error.message}\n\`\`\``);
        }
    },
};