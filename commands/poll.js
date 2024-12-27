module.exports = {
    name: 'poll',
    description: 'Creates a poll with multiple options. The question must be enclosed in quotes.',
    author: 'Thorne',
    version: '1.0',
    category: 'utility',
    emoji: '📊',
    async execute(message, args) {
        // Check if there are enough arguments
        if (args.length < 3) {
            return message.reply('Usage: !poll "<question>" <option1> <option2> ...');
        }

        // Check if the first argument is enclosed in quotes
        const question = args.join(' '); // Join all arguments to handle spaces
        const questionMatch = question.match(/^"(.+?)"\s*(.*)$/); // Match the question in quotes

        if (!questionMatch) {
            return message.reply('The question must be enclosed in double quotes (").');
        }

        const formattedQuestion = questionMatch[1]; // Extract the question without quotes
        const optionsString = questionMatch[2].trim(); // Remaining string after the question

        // Split options by spaces and filter out empty strings
        const options = optionsString.split('"').filter(opt => opt.trim()).map(opt => opt.trim());

        // Check if there are at least two options
        if (options.length < 2) {
            return message.reply('You must provide at least two options.');
        }

        // Create the poll message
        const pollMessageContent = `${formattedQuestion}\n${options.map((option, index) => `${index + 1}. ${option}`).join('\n')}\nReact with the corresponding number to vote!`;

        // Send the poll message
        try {
            const pollMessage = await message.channel.send(pollMessageContent);

            // React with numbers for each option
            for (let i = 0; i < options.length; i++) {
                await pollMessage.react(`${i + 1}️⃣`);
            }
        } catch (error) {
            console.error('Error sending poll:', error);
            message.reply('There was an error creating the poll. Please try again.');
        }
    }
};