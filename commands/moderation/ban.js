const Discord = require('discord.js');
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'ban',
	alias: ['beam', 'destroy'],
	usage: '<User> [Reason]',
	required: true,
	permissions: 'BAN_MEMBERS',
	description: 'Give them the ban hammer!',
	async execute(client, message, args){
		if (message.mentions.users.size > 0) {
			var user = message.mentions.users.first();
		}
		else {
			try {
				var user = await client.users.fetch(args[0]);
			}
			catch (error) {
				message.reply('please enter a valid user or user ID.');
				return;
			}
		}

		const guildMember = message.guild.members.cache.find(mem => mem.id === user.id);
		if (guildMember) {
			if (!message.guild.ownerID == user.id &&message.member.roles.highest.comparePositionTo(guildMember.roles.highest)<1){
				message.reply('You can\'t ban someone higher or equal to you.');
				return;
			}
			if (!guildMember.bannable){
				message.reply('I don\'t have enough power to ban that person. Give me more permissions.');
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
			if (guildMember) {
				await user.send(`You have been banned for: \n\`${reason}\`\nIf you believe this is an error, fill out a form at <https://forms.gle/btDTFLxxH8U2fYKt8>.`);
			}
		}
		catch (error){
			console.log(error);
		}

		await message.guild.members.ban(user, {days: 1 ,reason: `${reason}`});
		const channel = client.channels.cache.get(modlog_channel);
		const banEmbed = new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL({dynamic: true}))
			.setTitle('🔨 Banned')
			.setTimestamp();
		banEmbed.addField(`${user.username}#${user.discriminator} (${user.id})`, `**Reason:** ${reason}`);
		channel.send(banEmbed);
	}
};