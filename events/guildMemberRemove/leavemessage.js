const {user_channel} = require('../../config/moderation.json')

module.exports = {
	name: 'leavemessage',
	description: 'Display a message when they leave the server.',
	async execute(client, member){
		const channel = client.channels.cache.get(user_channel);
		channel.send(`${member.user.username} (${member.user.id}) left.`);
	}
}
