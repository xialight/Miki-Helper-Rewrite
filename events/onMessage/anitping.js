const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'antiping',
	description: 'NO SPAM PINGING D:<',
	async execute(client, message){
		if (message.channel.id == mute_channel) return;
		if (message.member.hasPermission('MANAGE_ROLES')) return;

		if (message.mentions.users.size + message.mentions.roles.size > 4){
			if (message.member.roles.cache.find(role => role.id === mute_role)) return;
			const muteRole = message.guild.roles.cache.find(role => role.id === mute_role);
			message.member.roles.add(muteRole);

			const channel = client.channels.cache.get(modlog_channel);
			const spamEmbed = new Discord.MessageEmbed()
				.setColor('#FFFF00')
				.setTitle('🔇 Automatically Muted For Mentions')
				.setDescription(`[Click here to go to the message](${message.url})`)
				.addField('Suspect', `${message.author.username}#${message.author.discriminator} (${message.author.id})`)
				.setTimestamp();
			channel.send(spamEmbed);
			message.author.send(`You just got automatically muted for spam mentioning. Leaving the server to get your mute removed will result in an automatic ban.\nYou can be unmuted if you provide a justified reason in <#${mute_channel}>.(Asking/Begging for an unmute may lead to a mute extension)`);
		}
	}
};