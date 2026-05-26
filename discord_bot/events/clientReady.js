const {
	REST,
	Routes,
	ActivityType,
	PresenceUpdateStatus,
	EmbedBuilder,
	MessageFlags,
} = require('discord.js');
const { safePingMinecraftServer } = require('../utils/serverPing');
const discord_token = process.env.discord_token;
const IPaddress = process.env.mcIPaddress;
const port = parseInt(process.env.mcPort) || 19132; // デフォルトのポート番号
let downNotifyChannelId = process.env.mcDownNotificationChannel;
let consoleChannelId = process.env.console_channel;
if (!downNotifyChannelId) downNotifyChannelId = consoleChannelId;

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
				`❌ スラッシュコマンドの再読み込み時にエラーが発生しました。：\n${err}`,
			);
		}
	})();

	console.log(`${client.user.username}への接続に成功しました。`);

	//カスタマイズアクティビティを設定
	let oldStatus;
	setInterval(async () => {
		try {
			const result = await safePingMinecraftServer(IPaddress, port);

			if (!result.success) {
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
						flags: MessageFlags.SuppressNotifications,
					});
					oldStatus = false;
				}
				return;
			}

			const res = result.data;
			client.user.setActivity({
				name: `${res.currentPlayers}/${res.maxPlayers}人がオンラインです。`,
				type: ActivityType.Competing,
			});
			client.user.setStatus(PresenceUpdateStatus.Online);
			oldStatus = true;
		} catch (error) {
			console.error('Error in status update interval:', error);
			// エラーが発生してもプロセスを継続
		}
	}, 10000);

	client.channels.cache.get(consoleChannelId).send('BOTを起動しました！');
};
