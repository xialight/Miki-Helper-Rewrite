module.exports = {
	name: 'setcolor',
	alias: [],
	usage: '<Hex Color Code>',
	required: true,
	description: 'Allows donators to set their role color.',
	async execute (client, message, args){
		const hasDonatorRole = message.member.roles.cache.find(role => role.name === 'Donators');
		if (!hasDonatorRole) {
			message.reply('you\'re not an active patron of Miki. You can be one by donating monthly on <https://www.patreon.com/mikibot>');
			return;
		}

		const hexCode = args[0].toUpperCase().replace('0X','').replace('#','');
		let regexp = /^[0-9a-fA-F]+$/;
		if (hexCode.length != 6 || !regexp.test(hexCode)){
			message.reply('please enter a valid hex color code. Example: \`#FFF2D3\`');
			return;
		}

		message.member.roles.cache.each(async function (role){
			if (role.name.startsWith('#')){
				await message.member.roles.remove(role);
			}
		});

		const existRole = message.guild.roles.cache.find(role => role.name === `#${hexCode}`);
		if (existRole){
			message.member.roles.add(existRole);
			return;
		}

		const markerRole = message.guild.roles.cache.find(role=> role.name === 'Non-Unique Colors -----');
		var newRole = await message.guild.roles.create({
			data : {
				name: `#${hexCode}`,
				color: `#${hexCode}`,
				position: markerRole.position
			}
		});
		message.member.roles.add(newRole);
	}
}