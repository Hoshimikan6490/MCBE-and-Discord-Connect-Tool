const {
	REST,
	Routes,
	ActivityType,
	PresenceUpdateStatus,
	EmbedBuilder,
} = require('discord.js');
const mcpePing = require('mcpe-ping');
const discord_token = process.env.discord_token;
const IPaddress = process.env.mcIPaddress;
const port = process.env.mcPort || 19132;
const downNotifyChannelId = process.env.mcDownNotificationChannel;
const readyChannelId = process.env.console_channel;

module.exports = async (client) => {
	//discord botへのコマンドの設定
	const rest = new REST({ version: '10' }).setToken(discord_token);
	(async () => {
		try {
			await rest.put(Routes.applicationCommands(client.user.id), {
				body: await client.commands,
			});
			console.log('スラッシュコマンドの再読み込みに成功しました。');
		} catch (err) {
			console.log(
				`❌ スラッシュコマンドの再読み込み時にエラーが発生しました。：\n${err}`
			);
		}
	})();

	console.log(`${client.user.username}への接続に成功しました。`);

	//カスタマイズアクティビティを設定
	let oldStatus;
	setInterval(() => {
		mcpePing(IPaddress, port, (err, res) => {
			if (err) {
				client.user.setActivity({
					name: 'サーバーがオフラインです',
					type: ActivityType.Competing,
				});
				client.user.setStatus(PresenceUpdateStatus.Idle);

				if (oldStatus) {
					let embed = new EmbedBuilder()
						.setTitle('**⛔　サーバー停止**')
						.setColor(0xff0000)
						.setTimestamp();
					client.channels.cache.get(downNotifyChannelId).send({
						embeds: [embed],
					});
					oldStatus = false;
				}
				return;
			}

			client.user.setActivity({
				name: `${res.currentPlayers}/${res.maxPlayers}人がオンラインです。`,
				type: ActivityType.Competing,
			});
			client.user.setStatus(PresenceUpdateStatus.Online);
			oldStatus = true;
		});
	}, 10000);

	client.channels.cache.get(readyChannelId).send('BOTを起動しました！');
};
