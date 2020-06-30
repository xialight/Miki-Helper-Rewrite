module.exports = {
	name: 'cleanroles',
	alias: [],
	usage: '',
	required: false,
	permissions: 'MANAGE_ROLES',
	description: 'Clean all unused color roles.',
	async execute (client, message, args) {
		var dumpedRoles = [];
		var dumpedRoleNames = [];
		message.guild.roles.cache.each(function (role) {
			if (role.name.startsWith('#') && role.members.size == 0){
				dumpedRoles.push(role);
			}
		});
		dumpedRoles.forEach(async function (role) {
			dumpedRoleNames.push(role.name);
			await role.delete('Unused role');
		});


		message.channel.send(`I have deleted ${dumpedRoleNames.join(', ')}`);
	}
}