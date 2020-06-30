const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'help',
	alias: [],
	usage: '[command]',
	required: false,
	description: 'Need help with a command?',
	async execute (client, message, args){
		if (args.length < 1) {
			const helpEmbed = new Discord.MessageEmbed()
				.setColor('#F0E68C')
				.setTitle('List of Commands')
				.setDescription(`The prefix is \`${client.prefix}\``)
				.setThumbnail(client.user.avatarURL({dynamic: true}));
			fs.readdirSync('./commands').forEach(function (subcom) {
				var commands = [];
				fs.readdirSync(`./commands/${subcom}`).forEach(function (file){
					commands.push(`\`${file.replace(`.js`, '')}\``);
				});
				helpEmbed.addField(subcom.charAt(0).toUpperCase() + subcom.slice(1), commands.join(' '));
			});
			message.channel.send(helpEmbed);
			return;
		}

		const foundCommand = client.commands.get(args[0]);
		if (!foundCommand){
			message.channel.send('That command/alias does not exist.');
			return;
		}

		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#F0E68C')
			.setTitle(foundCommand.name.toUpperCase())
			.setDescription(foundCommand.description);
		if (foundCommand.alias.length > 0){
			helpEmbed.addField('Alias', foundCommand.alias.join(', '));
		}
		helpEmbed.addField('Usage', `\`${client.prefix}${foundCommand.name} ${foundCommand.usage}\``)
		message.channel.send(helpEmbed);
	}
}