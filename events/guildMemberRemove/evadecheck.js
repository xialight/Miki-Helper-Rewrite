const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'evadecheck',
	description: 'Checking if they mute evade.',
	async execute(client, member){
		//When you ban them while they have a mute.
		try{
			const banEntry = await member.guild.fetchBan(member.user.id);
			if (banEntry){
				return;
			}
		}
		catch (error){

		}

		if (member.roles.cache.find(role => role.id === mute_role)) {
			member.ban({days: 1, reason: 'User mute evaded'})
				.then()
				.catch(console.error)

			const channel = client.channels.cache.get(modlog_channel);
			const evadeEmbed = new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('🏃 Mute Evaded')
				.addField('Suspect', `${member.user.username}#${member.user.discriminator} (${member.user.id})`)
				.setTimestamp();
			channel.send(evadeEmbed);
		};
	}
};