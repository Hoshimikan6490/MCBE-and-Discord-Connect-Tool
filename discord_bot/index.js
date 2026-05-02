const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
	],
});
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userModel = require('./models/userSchema');
require('dotenv').config({ quiet: true });

//機密情報取得
const discord_token = process.env.discord_token;
const PORT = 8000 || process.env.PORT;
const mcAllowedIPs = process.env.allowedIPs
	? JSON.parse(process.env.allowedIPs)
	: [];
const mongoDBConnectionString = process.env.mongoDBConnectionString;

///////////////////////////////////////////////////
fs.readdir('./events', (_err, files) => {
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		let eventName = file.split('.')[0];
		console.log(`クライアントイベントの読み込みが完了: ${eventName}`);
		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

client.commands = [];
fs.readdir('./commands', (err, files) => {
	if (err) throw err;
	files.forEach(async (f) => {
		try {
			if (f.endsWith('.js')) {
				let props = require(`./commands/${f}`);
				let propsJson = props.data.toJSON();
				client.commands.push(propsJson);
				console.log(`コマンドの読み込みが完了: ${propsJson.name}`);
			}
		} catch (err) {
			console.log(err);
		}
	});
});

if (mongoDBConnectionString) {
	//mongooseについて
	mongoose
		.connect(mongoDBConnectionString, { dbName: 'users' })
		.then(() => {
			console.log('[DB] データベースに接続しました');
		})
		.catch((err) => {
			throw err;
		});
} else {
	setTimeout(() => {
		console.log(
			'mongodbの接続情報をプロジェクト内の.envファイルに設定してください!',
		);
	}, 2000);
}

if (discord_token) {
	client.login(discord_token).catch((err) => {
		console.log(
			'プロジェクトに入力したボットのトークンが間違っているか、ボットのINTENTSがオフになっています!',
		);
	});
} else {
	setTimeout(() => {
		console.log(
			'ボットのトークンをプロジェクト内の.envファイルに設定してください!',
		);
	}, 2000);
}

app.get('/', (request, response) => {
	response?.sendStatus(200);
});

// userName取得API
app.get('/mcUsernameToDiscordUsername', async (request, response) => {
	let clientIPRaw =
		request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	if (!clientIPRaw) clientIPRaw = request.ip || null;
	// IPv4 が IPv6 マッピングで渡される場合があるので正規化する
	const clientIP =
		clientIPRaw && clientIPRaw.startsWith('::ffff:')
			? clientIPRaw.replace('::ffff:', '')
			: clientIPRaw;

	// allowedIPsが設定されている場合のみIPをチェック。空の場合は全IP許可
	if (
		mcAllowedIPs.length > 0 &&
		!(
			clientIP === '127.0.0.1' ||
			clientIP === '::1' ||
			mcAllowedIPs.includes(clientIP)
		)
	) {
		return response.status(403).send('Access denied: IP not allowed.');
	}

	let mcUserId = request.query.mcUserId;

	if (!mcUserId)
		return response.status(400).send('query parameter is required.');

	let matchedUser = await userModel.findOne({ mcUserId }).lean();
	const discordUserName = matchedUser?.discordUserName;

	if (discordUserName === undefined) {
		return response.status(200).send(mcUserId);
	}

	return response.status(200).send(discordUserName);
});

app.listen(PORT, function () {
	console.log(`[NodeJS] Application Listening on Port ${PORT}`);
});
