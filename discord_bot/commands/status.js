const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const { safePingMinecraftServer } = require("../utils/serverPing");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("💻マイクラサーバーのステータスを表示します。"),

	run: async (client, interaction) => {
		try {
			await interaction.deferReply(); // 応答を遅延させる
			let IPaddress = process.env.mcIPaddress;
			let port = parseInt(process.env.mcPort) || 19132; // デフォルトのポート番号

			if (!IPaddress)
				return interaction.editReply(
					"IPアドレスが設定されていません。\n.envファイルを確認してください。設定後はBOTの再起動が必要です。"
				);

			// 新しいpingユーティリティを使用
			const pingResult = await safePingMinecraftServer(IPaddress, port);

			if (!pingResult.success) {
				const embed = new EmbedBuilder()
					.setTitle("🔴 サーバーはオフラインです")
					.setDescription(
						`エラー: ${pingResult.error?.message || "サーバーに接続できません"}`
					)
					.addFields(
						{ name: "IPアドレス", value: IPaddress, inline: true },
						{ name: "ポート", value: port.toString(), inline: true }
					)
					.setColor(0xff0000);

				return interaction.editReply({ embeds: [embed] });
			}

			// 成功した場合の処理
			const res = pingResult.data;
			let embed;

			if (pingResult.method === "mcpe-ping" && res.rinfo) {
				// mcpe-pingからの詳細情報を使用
				embed = new EmbedBuilder()
					.setTitle(`🟢 ${res.cleanName || "サーバー"}はオンラインです。`)
					.addFields(
						{
							name: "IPアドレス",
							value: res.rinfo.address || IPaddress,
							inline: true,
						},
						{
							name: "ポート",
							value: (res.rinfo.port || port).toString(),
							inline: true,
						},
						{
							name: "プレイヤー数(現在の接続人数/最大接続人数)",
							value: `${res.currentPlayers || 0}/${res.maxPlayers || "不明"}`,
							inline: true,
						},
						{
							name: "バージョン",
							value: res.version
								? `統合版マインクラフト v${res.version}`
								: "不明",
							inline: true,
						}
					)
					.setColor(0x00ff00);
			} else {
				// 基本的なping情報のみ
				embed = new EmbedBuilder()
					.setTitle("🟢 サーバーはオンラインです。")
					.setDescription(
						"サーバーが応答しています（詳細情報は取得できませんでした）"
					)
					.addFields(
						{ name: "IPアドレス", value: IPaddress, inline: true },
						{ name: "ポート", value: port.toString(), inline: true },
						{
							name: "応答時間",
							value: res.responseTime ? `${res.responseTime}ms` : "不明",
							inline: true,
						}
					)
					.setColor(0x00ff00);
			}

			let button = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel("サーバーへの参加方法")
					.setStyle(ButtonStyle.Link)
					.setURL(`https://kuwa.app/tool/hjs/?ip=${IPaddress}&port=${port}`)
			);

			return interaction.editReply({ embeds: [embed], components: [button] });
		} catch (err) {
			console.error("Status command error:", err);

			const embed = new EmbedBuilder()
				.setTitle("❌ エラーが発生しました")
				.setDescription(`予期しないエラーが発生しました: ${err.message}`)
				.setColor(0xff0000);

			try {
				await interaction.editReply({ embeds: [embed] });
			} catch (replyError) {
				console.error("Failed to send error message:", replyError);
				const errorNotification = require("../errorNotification.js");
				errorNotification(client, interaction, err);
			}
		}
	},
};
