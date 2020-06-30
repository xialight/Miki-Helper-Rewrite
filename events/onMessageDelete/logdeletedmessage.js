const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'logdeletedmessage',
	description: 'You can\'t hide you messages here.',
	async execute(client, message){
		//When you ban them while they have a mute.
		try{
			const banEntry = await message.guild.fetchBan(member.user.id);
			if (banEntry){
				return;
			}
		}
		catch (error){

		}

		const deleteEmbed = new Discord.MessageEmbed()
			.setColor('FF0000')
			.setAuthor(`${message.author.username}#${message.author.discriminator} (${message.author.id})`, message.author.avatarURL())
			.setTitle('Deleted Message')
			.addField('Channel', message.channel)
			.setTimestamp();
		if (message.content.length > 0) {
			deleteEmbed.addField('Content', message.content.length > 500 ? `${message.content.substring(0, 497)}...`: message.content);
		}
		if (message.attachments.size > 0){
			deleteEmbed.addField('Attachment', message.attachments.first().proxyURL);
		}

		const channel = client.channels.cache.get(log_channel);
		channel.send(deleteEmbed);
	}
}