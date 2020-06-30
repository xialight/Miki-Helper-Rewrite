const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'antispam',
	description: 'Anti-spam hurrdurr',
	async execute(client, message){
		if (message.channel.id == mute_channel) return;
		if (message.member.hasPermission('MANAGE_ROLES')) return;

		var messageCounter = 0;
		message.channel.messages.fetch({limit: 30})
			.then(function (messages) {
				const userMessages = messages.filter(m => m.author.id === message.author.id)
				userMessages.forEach(function (message){
					messageCounter++;
					const oldMessage = message;
					if (messageCounter > 3){
						var timeDuration = Date.now() - oldMessage.createdTimestamp;
						var avgTime = timeDuration / messageCounter / 1000;
						if (avgTime < 0.4){
							if (message.member.roles.cache.find(role => role.id === mute_role)) return;
							const muteRole = message.guild.roles.cache.find(role => role.id === mute_role);
							message.member.roles.add(muteRole);

							const channel = client.channels.cache.get(modlog_channel);
							const spamEmbed = new Discord.MessageEmbed()
								.setColor('#FFFF00')
								.setTitle('🔇 Automatically Muted For Spam')
								.setDescription(`[Click here to go to the messages](${message.url})`)
								.addField('Suspect', `${message.author.username}#${message.author.discriminator} (${message.author.id})`)
								.setTimestamp();
							channel.send(spamEmbed);
							message.author.send(`You just got automatically muted for spamming messages. Leaving the server to get your mute removed will result in an automatic ban.\nYou can be unmuted if you provide a justified reason in <#${mute_channel}>.(Asking/Begging for an unmute may lead to a mute extension)`);
							return;
						}
						return;
					}
				});
			})
			.catch(console.error);
	}
};