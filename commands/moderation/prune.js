module.exports = {
	name: 'prune',
	alias: [],
	usage: '<Amount>',
	required: true,
	permissions: 'MANAGE_MESSAGES',
	description: 'Clean the server chat.',
	async execute (client, message, args){
		if (isNaN(args[0])) {
			message.reply('that\'s not a valid number.');
			return;
		}

		const numMes = parseInt(args[0]);
		if (numMes > 100 || numMes < 1) {
			message.reply('please pick a number between 1-100');
			return;
		}

		await message.delete();
		await message.channel.bulkDelete(numMes);
	}
}