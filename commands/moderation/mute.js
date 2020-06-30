const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'mute',
	alias: ['silence'],
	usage: '<User> [Reason]',
	required: true,
	permissions: 'MANAGE_ROLES',
	description: 'Mute people.',
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

		if (args.length > 1) {
			var reason = args.slice(1,args.length).join(' ');
		}
		else {
			var reason = '(Blank)';
		}

		try {
			guildMember.send(`You have been muted for: \n\`${reason}\`\nYou can be unmuted if you provide a justified reason in <#${mute_channel}>.(Asking/Begging for an unmute may lead to a mute extension)`);
		}
		catch (error){
			console.log(error);
		}

		const muteRole = message.guild.roles.cache.find(role => role.id === mute_role);
		guildMember.roles.add(muteRole);
		const channel = client.channels.cache.get(modlog_channel);
		const muteEmbed = new Discord.MessageEmbed()
			.setColor('#FFFF00')
			.setTitle('🔇 Muted')
			.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL({dynamic: true}))
			.addField(`${guildMember.user.username}#${guildMember.user.discriminator} (${guildMember.user.id})`, `**Reason:** ${reason}`)
			.setTimestamp();
		channel.send(muteEmbed);
	}
}