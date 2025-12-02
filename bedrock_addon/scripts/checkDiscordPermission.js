import {
	HttpRequest,
	HttpHeader,
	http,
	HttpRequestMethod,
} from '@minecraft/server-net';
import { botToken } from './env.js';
const ADMIN_BIT = 8n;

async function fetch(url) {
	try {
		const req = new HttpRequest(url);
		req.method = HttpRequestMethod.Get;
		req.headers = [new HttpHeader('Authorization', `Bot ${botToken}`)];
		const response = await http.request(req);
		return JSON.parse(response.body);
	} catch (err) {
		return {};
	}
}

export default async (channelID, userId) => {
	try {
		// サーバーIdの取得
		const guildRes = await fetch(
			`https://discord.com/api/v10/channels/${channelID}`
		);
		if (!guildRes) throw new Error('Guild fetch error');
		const guildId = guildRes.guild_id;

		// ユーザーの所属ロールID取得
		const memberRes = await fetch(
			`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`
		);
		if (!memberRes) throw new Error('Member fetch error');

		// サーバー内すべてのロール取得
		const rolesRes = await fetch(
			`https://discord.com/api/v10/guilds/${guildId}/roles`
		);
		if (!rolesRes) throw new Error('Roles fetch error');

		// 管理者ビットを持っているか確認
		const isAdmin = rolesRes
			.filter((role) => memberRes.roles.includes(role.id))
			.some((role) => (BigInt(role.permissions) & ADMIN_BIT) === ADMIN_BIT);

		return isAdmin;
	} catch (err) {
		console.error('Error:', err.message);
		return false;
	}
};
