const Discord = require('discord.js');
const {raid_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'checkfornewaccounts',
	description: 'Notify you of new accounts',
	async execute(client, member){
		if (Date.now() - member.user.createdTimestamp > 172800000){
			return;
		}

		const channel = client.channels.cache.get(raid_channel);
		var todayDate = new Date();
		const raidEmbed = new Discord.MessageEmbed()
			.setColor('#FFFF00')
			.setTitle('New Account Detected')
			.setDescription(`${member.user.username}#${member.user.discriminator} (${member.user.id})`)
			.addFields(
				{name : 'Creation Date', value: member.user.createdAt.toUTCString()},
				{name : 'Join Date', value: todayDate.toUTCString()}
			);
		channel.send(raidEmbed);
	}
}
