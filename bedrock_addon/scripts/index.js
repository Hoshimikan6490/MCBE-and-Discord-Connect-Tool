import { system, world } from '@minecraft/server';
import {
	HttpRequest,
	HttpHeader,
	http,
	HttpRequestMethod,
} from '@minecraft/server-net';
import { channelID, botToken, discordUserNameAPIurl } from './env.js';
import convertDieMessage from './convertDieMessage.js';
import checkIfUserIsAdmin from './checkDiscordPermission.js';

// クールダウン管理用マップ（ユーザーID: 最終警告送信時刻）
const nonAdminCooldown = new Map();
const COOLDOWN_MS = 60 * 1000; // 1分

// ============================
// Discord メッセージ送信関数
// ============================
async function sendDiscordMessage(message) {
	const req = new HttpRequest(
		`https://discord.com/api/v10/channels/${channelID}/messages`,
	);
	req.method = HttpRequestMethod.Post;
	req.body = JSON.stringify(message);
	req.headers = [
		new HttpHeader('Content-Type', 'application/json'),
		new HttpHeader('Authorization', `Bot ${botToken}`),
	];
	await http.request(req);
}

// ============================
// Minecraft イベント連携
// ============================
world.afterEvents.worldLoad.subscribe(async () => {
	let title = `**✅｜サーバー起動**`;
	const embedData = {
		title: title,
		color: 0x0000ff,
		timestamp: new Date().toISOString(),
	};
	const message = {
		content: '',
		embeds: [embedData],
	};
	sendDiscordMessage(message);
});

world.afterEvents.chatSend.subscribe(async (eventData) => {
	let player = eventData.sender.name;
	let discordUserName = await getDiscordUserName(player);
	const message = {
		content: `<${discordUserName}> ${eventData.message}`,
	};
	sendDiscordMessage(message);
});

world.afterEvents.playerJoin.subscribe(async (eventData) => {
	let player = eventData.playerName;
	let discordUserName = await getDiscordUserName(player);
	let title = `**🚪｜${discordUserName}がサーバーに参加しました**`;
	const embedData = {
		title: title,
		color: 0x87ceeb, // 空色
		timestamp: new Date().toISOString(),
	};
	const message = {
		content: '',
		embeds: [embedData],
	};
	sendDiscordMessage(message);
});

world.afterEvents.playerLeave.subscribe(async (eventData) => {
	let player = eventData.playerName;
	let discordUserName = await getDiscordUserName(player);
	let title = `**👋｜${discordUserName}がサーバーから退出しました**`;
	const embedData = {
		title: title,
		color: 0xffa500, // オレンジ色
		timestamp: new Date().toISOString(),
	};
	const message = {
		content: '',
		embeds: [embedData],
	};
	sendDiscordMessage(message);
});

world.afterEvents.playerEmote.subscribe(async (eventData) => {
	let player = eventData.player.nameTag;
	let playerLocation = eventData.player.location;
	let { x, y, z } = playerLocation;
	let discordUserName = await getDiscordUserName(player);
	let title = `**💃｜${discordUserName}が (${x.toFixed(2)}, ${y.toFixed(
		2,
	)}, ${z.toFixed(2)}) でエモートを使いました！**`;
	const embedData = {
		title: title,
		description: '※仕様上、エモート名は表示出来ません。',
		color: 0x00ff00, // 緑色
		timestamp: new Date().toISOString(),
	};
	const message = {
		content: '',
		embeds: [embedData],
	};
	sendDiscordMessage(message);
});

world.afterEvents.entityDie.subscribe(async (eventData) => {
	if (eventData.deadEntity.typeId == 'minecraft:player') {
		let player = eventData.deadEntity.nameTag;
		let deadReason = await convertDieMessage(eventData.damageSource);
		let discordUserName = await getDiscordUserName(player);
		let damagingEntityId = eventData.damageSource.damagingEntity?.typeId;
		let title = `**💀｜${discordUserName}は${
			deadReason ? deadReason : '何らかの理由で死亡しました'
		}**`;
		let description = deadReason
			? ''
			: `debug: \`${damagingEntityId}\` by \`${eventData.damageSource.cause}\``;
		const embedData = {
			title: title,
			description: description,
			color: 0x800080, // 紫色
			timestamp: new Date().toISOString(),
		};
		const message = {
			content: '',
			embeds: [embedData],
		};
		sendDiscordMessage(message);
	}
});

// ============================
// Discordからのメッセージ取得
// ============================
const messageURL = `https://discord.com/api/v10/channels/${channelID}/messages`;
let lastMessageID = null;
let i = 0;

async function handleNewMessages() {
	const url = lastMessageID
		? `${messageURL}?after=${lastMessageID}`
		: messageURL;
	const req = new HttpRequest(url);
	req.method = HttpRequestMethod.Get;
	req.headers = [new HttpHeader('Authorization', `Bot ${botToken}`)];
	const response = await http.request(req);

	// HTTPステータスコードをチェック
	if (response.status === 401) {
		console.warn(
			`Discord API 認証エラー (401 Unauthorized)： Botトークンを確認してください。`,
		);
		return;
	}

	let messages;
	try {
		messages = JSON.parse(response.body);
	} catch (err) {
		console.warn(
			`Discord API から JSON 以外の応答を受信しました。status=${response.status}, body=${response.body}`,
		);
		return;
	}

	if (!Array.isArray(messages)) {
		console.warn(
			`Discord API の応答形式が想定外です。status=${response.status}, body=${response.body}`,
		);
		return;
	}

	messages.forEach(async (message) => {
		if (!message.author.bot && i !== 0) {
			if (message.referenced_message) {
				let messageAuthor = message.referenced_message.author;
				world.sendMessage(
					`§l|⁻⁻§r§b[${
						messageAuthor.global_name || messageAuthor.username
					}] §f${message.referenced_message.content}\n§b[${
						messageAuthor.global_name || messageAuthor.username
					}] §f${message.content}`,
				);
			} else {
				if (message.content.startsWith('runCommand!')) {
					try {
						// Discordからのコマンドはサーバー管理者だけが使えるようにする
						let isAdmin = await checkIfUserIsAdmin(
							channelID,
							message.author.id,
						);
						if (!isAdmin) {
							const now = Date.now();
							const lastWarnTime = nonAdminCooldown.get(message.author.id) || 0;

							// クールダウン中の場合は無視
							if (now - lastWarnTime < COOLDOWN_MS) return;

							// --- クールダウンマップから期限切れを削除 ---
							for (const [userId, timestamp] of nonAdminCooldown.entries()) {
								if (now - timestamp >= COOLDOWN_MS) {
									nonAdminCooldown.delete(userId);
								}
							}

							nonAdminCooldown.set(message.author.id, now);
							return sendDiscordMessage({
								content: `<@${message.author.id}> あなたは、サーバー管理者権限を持っていないため、このコマンドは実行されません。`,
							});
						}

						const command = message.content.slice('runCommand!'.length);
						if (command == 'list') {
							const players = world.getAllPlayers();
							const playerNames = players.map((p) => p.name).join(', ');
							sendDiscordMessage({
								content: `計${players.length}人のプレイヤーが接続中！: ${playerNames}`,
							});
						} else {
							world.getDimension('overworld').runCommand(command);
							// 結果をワールドに送信
							sendDiscordMessage({
								content: `success!!`,
							});
						}
					} catch (err) {
						sendDiscordMessage({
							content: `コマンド送信時に以下のエラーが発生しました！\n\`\`\`\n${err}\n\`\`\``,
						});
					}
				} else {
					world.sendMessage(
						`§b[${message.author.global_name || message.author.username}] §f${
							message.content
						}`,
					);
				}
			}
		}
	});

	if (messages.length > 0) {
		lastMessageID = messages[0].id;
	}
	i++;
}

async function getDiscordUserName(mcBE_userName) {
	try {
		if (!discordUserNameAPIurl) return mcBE_userName;

		const req = new HttpRequest(
			`${discordUserNameAPIurl}/mcUsernameToDiscordUsername?mcUserId=${mcBE_userName}`,
		);
		req.method = HttpRequestMethod.Get;
		const response = await http.request(req);

		// 正常に処理が完了したら
		if (response.status == 200) return response.body;
		// 通信には成功しているが200じゃない場合は
		return 'Unknown User';
	} catch (err) {
		// 失敗したら
		return mcBE_userName;
	}
}

system.runInterval(() => {
	handleNewMessages();
}, 20);
