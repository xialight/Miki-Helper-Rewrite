const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const {prefix, token} = require('./config/settings.json')
const {log_channel, modlog_channel, server_id, mute_role, mute_channel} = require('./config/moderation.json')

const client = new Discord.Client();
client.prefix = prefix;
client.commands = new Discord.Collection();
client.guildMemberAdd = new Discord.Collection();
client.guildMemberRemove = new Discord.Collection();
client.onMessage = new  Discord.Collection();
client.onMessageDelete = new  Discord.Collection();
client.onMessageUpdate = new  Discord.Collection();

const getAllFunctions = function(dirPath, collectList){
	fs.readdirSync(dirPath).forEach(function (file) {
		if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
			getAllFunctions(`${dirPath}/${file}`, collectList);
		}
		else {
			const obj = require(`${dirPath}/${file}`);
			collectList.set(obj.name, obj);
			try {
				obj.alias.forEach(function (alias) {
					collectList.set(alias, obj);
				});
			}
			catch (error) {

			}
			console.log(`${file} loaded.`);
		}
	});
};

getAllFunctions('./events/guildMemberAdd', client.guildMemberAdd);
getAllFunctions('./events/guildMemberRemove', client.guildMemberRemove);
getAllFunctions('./events/onMessage', client.onMessage)
getAllFunctions('./events/onMessageDelete', client.onMessageDelete)
getAllFunctions('./events/onMessageUpdate', client.onMessageUpdate)
getAllFunctions('./commands', client.commands);


client.on('ready', async () => {
	client.user.setActivity('this server', {type: 'WATCHING'});
	console.log('Ready!');
});

client.on('guildMemberAdd', async member => {
	client.guildMemberAdd.forEach(function (event){
		if (!member.guild.id == server_id) return;

		try {
			event.execute(client, member);
		}
		catch(error) {
			console.log(error);
		}
	});
});

client.on('guildMemberRemove', async member => {
	client.guildMemberRemove.forEach(function (event){
		if (!member.guild.id == server_id) return;

		try {
			event.execute(client, member);
		}
		catch(error) {
			console.log(error);
		}
	});
});

client.on('messageDelete', async message => {
	if (message.channel.type == 'dm' || !message.guild.id == server_id) return;
	if (message.author.bot) return;

	client.onMessageDelete.forEach(function (event){
		try {
			event.execute(client, message);
		}
		catch(error) {
			console.log(error);
		}
	});
});

client.on('messageUpdate', async (oldMessage, newMessage) =>{
	if (oldMessage.channel.type == 'dm' || !oldMessage.guild.id == server_id) return;
	if (oldMessage.author.bot) return;

	client.onMessageUpdate.forEach(function (event){
		try {
			event.execute(client, oldMessage, newMessage);
		}
		catch(error) {
			console.log(error);
		}
	});
});

client.on('message', async message =>{
	if (message.channel.type == 'dm') return;
	if (message.author.bot) return;
	if (!message.guild.id == server_id) return;

	client.onMessage.forEach(function (event) {
		try {
			event.execute(client, message);
		}
		catch(error) {
			console.log(error);
		}
	});
});

client.on('message', async message => {
	if (!message.content.startsWith(client.prefix) || message.author.bot) return;
	if (message.channel.type == 'dm') return;
	if (!message.guild.id == server_id) return;

	const args = message.content.slice(client.prefix.length).split(/\s+/);
	const commandName = args.shift().toLowerCase();
	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);
	if (command.permissions){
		if (!message.member.hasPermission(command.permissions)){
			message.reply('you do not have permission to use this command.');
			return;
		}
	}
	if (command.required){
		if (args.length < 1) {
			message.reply(`the correct usage is \`${client.prefix}${command.name} ${command.usage}\``);
			return;
		}
	}

	try {
		command.execute(client, message, args);
	}
	catch(error) { 
		console.log(error);
		message.channel.send('There was an error executing that command.');
		return;
	}
});

client.login(token);