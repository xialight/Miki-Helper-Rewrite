const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'logupdatedmessage',
	description: 'Nice (edited) there :D',
	async execute(client, oldMessage, newMessage){
		const updateEmbed = new  Discord.MessageEmbed()
			.setColor('#FFFF00')
			.setAuthor(`${oldMessage.author.username}#${oldMessage.author.discriminator} (${oldMessage.author.id})`, oldMessage.author.avatarURL())
			.setTitle('Edited Message')
			.addField('Channel', oldMessage.channel)
			.setTimestamp();
		if (oldMessage.content.length > 0) {
			updateEmbed.addField('Old Message', oldMessage.content.length > 500 ? `${oldMessage.content.substring(0, 497)}...`: oldMessage.content);
		}
		if (newMessage.content.length > 0) {
			updateEmbed.addField('New Message', `[${newMessage.content.length > 500 ? `${newMessage.content.substring(0, 497)}...`: newMessage.content}](${newMessage.url})`);
		}	
		if (oldMessage.attachments.size > 0){
			updateEmbed.addField('Attachment', oldMessage.attachments.first().proxyURL);
		}

		const channel = client.channels.cache.get(log_channel);
		channel.send(updateEmbed);
	}
}