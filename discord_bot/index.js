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
require('dotenv').config({ quiet: true });

//機密情報取得
const discord_token = process.env.discord_token;
const PORT = 8000 || process.env.PORT;
const mcIPaddress = process.env.mcIPaddress;
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

if (discord_token) {
	client.login(discord_token).catch((err) => {
		console.log(
			'プロジェクトに入力したボットのトークンが間違っているか、ボットのINTENTSがオフになっています!'
		);
	});
} else {
	setTimeout(() => {
		console.log(
			'ボットのトークンをプロジェクト内の.envファイルに設定してください!'
		);
	}, 2000);
}

app.get('/', (request, response) => {
	response?.sendStatus(200);
});

// userName取得API
app.get('/mcUsernameToDiscordUsername', (request, response) => {
	const clientIP = request.ip;

	// マイクラサーバー以外からのリクエストは無視する
	if (
		!(
			clientIP == '127.0.0.1' ||
			clientIP == '::1' ||
			clientIP.startsWith('::ffff:127.') ||
			clientIP == mcIPaddress
		)
	)
		return response.status(403).send('Access denied: IP not allowed.');

	let mcUserId = request.query.mcUserId;
	if (!mcUserId)
		return response.status(403).send('query parameter is required.');

	let db = fs.readFileSync('./mcIDtoDiscordUserName.json');
	db = JSON.parse(db);

	let parsedDB = {};

	// dbの内容を統合版マインクラフトのユーザー名とdiscordのユーザー名が対応するようにフォーマット
	Object.keys(db).forEach((key) => {
		parsedDB[db[key].mcUserId] = db[key].discordUserName;
	});

	return response?.status(200).send(parsedDB[mcUserId]);
});

app.listen(PORT, function () {
	console.log(`[NodeJS] Application Listening on Port ${PORT}`);
});
