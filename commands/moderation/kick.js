const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'kick',
	alias: ['boot'],
	usage: '<User> [Reason]',
	required: true,
	permissions: 'KICK_MEMBERS',
	description: 'Kick them out of the server.',
	async execute (client, message, args){
		if (message.mentions.members.size > 0) {
			var guildMember = message.mentions.members.first();
		}
		else{
			try{
				var guildMember = message.guild.members.cache.find(mem => mem.id === args[0]); 
			}
			catch (error){
				message.reply('I don\'t think that person is in the server.');
				return;
			}
		}

		if (!message.guild.ownerID == guildMember.user.id &&message.member.roles.highest.comparePositionTo(guildMember.roles.highest)<1){
			message.reply('You can\'t kick someone higher or equal to you.');
			return;
		}
		if (!guildMember.kickable){
			message.reply('I don\'t have enough power to kick that person. Give me more permissions.');
			return;
		}

		if (args.length > 1) {
			var reason = args.slice(1,args.length).join(' ');
		}
		else {
			var reason = '(Blank)';
		}

		try {
			await guildMember.send(`You have been kicked for: \n\`${reason}\`\nYou can rejoin via <https://discord.gg/39Xpj7K>; just don't make the same mistake again or it will lead to a ban.`);
		}
		catch (error){
			console.log(error);
		}

		await guildMember.kick(reason);
		const channel = client.channels.cache.get(modlog_channel);
		const kickEmbed = new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL({dynamic: true}))
			.setTitle('👢 Kicked')
			.setTimestamp();
		kickEmbed.addField(`${guildMember.user.username}#${guildMember.user.discriminator} (${guildMember.user.id})`, `**Reason:** ${reason}`);
		channel.send(kickEmbed);
	}
}