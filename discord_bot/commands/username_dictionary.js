const {
	SlashCommandBuilder,
	MessageFlags,
	EmbedBuilder,
} = require('discord.js');
const userModel = require('../models/userSchema');

const getDiscordUserName = (discordUser) =>
	discordUser.globalName || discordUser.username;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('username_dictionary')
		.setDescription('📚ユーザー名をdiscordのユーザー名と置き換えます！')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription(
					'統合版マインクラフトのユーザー名とdiscordのユーザー名の対応を追加します。',
				)
				.addStringOption((option) =>
					option
						.setName('mc_user_id')
						.setDescription('統合版マインクラフトのユーザー名')
						.setRequired(true),
				)
				.addUserOption((option) =>
					option
						.setName('discord_user')
						.setDescription('Discordのユーザー')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('show')
				.setDescription(
					'既に設定されている統合版マインクラフトのユーザー名とdiscordのユーザー名の対応を表示します。',
				)
				.addUserOption((option) =>
					option
						.setName('discord_user')
						.setDescription('Discordのユーザー')
						.setRequired(false),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription(
					'既に設定されている統合版マインクラフトのユーザー名とdiscordのユーザー名の対応を削除します。',
				)
				.addUserOption((option) =>
					option
						.setName('discord_user')
						.setDescription('Discordのユーザー')
						.setRequired(true),
				),
		),

	run: async (client, interaction) => {
		try {
			let subcommand = interaction.options.getSubcommand();
			let mcUserId = interaction.options.getString('mc_user_id');
			let discordUser = interaction.options.getUser('discord_user');
			let discordUserName = discordUser
				? getDiscordUserName(discordUser)
				: null;

			// discordのユーザー選択でBOTを選んだ場合
			if (discordUser?.bot)
				return interaction.reply({
					content: 'BOTを選択する事は出来ません。',
					flags: MessageFlags.Ephemeral,
				});

			if (subcommand == 'add') {
				await userModel.findOneAndUpdate(
					{ _id: discordUser.id },
					{
						mcUserId: mcUserId,
						discordUserName: discordUserName,
					},
					{ upsert: true, new: true },
				);

				// 登録済みか確認して未登録なら登録(またはアップデート)と表記
				return interaction.reply(
					`今後、${mcUserId}さんは\`${discordUserName}\`と表示されます！`,
				);
			} else if (subcommand == 'show') {
				let db = await userModel.find().lean();

				// Discordのユーザー指定がある場合
				if (discordUser) {
					let matchedUser = db.find((user) => user._id === discordUser.id);

					if (!matchedUser)
						return interaction.reply({
							content: '❌ そのユーザーのデータはありません！',
							flags: MessageFlags.Ephemeral,
						});

					let embed = new EmbedBuilder()
						.setTitle(
							'登録済みの統合版マインクラフトのユーザー名とDiscordのユーザー名の対応',
						)
						.setDescription(
							`統合版マインクラフトのユーザー名「${
								matchedUser.mcUserId
							}」さんは、「${
								matchedUser.discordUserName
							}」に置き換えられています。`,
						)
						.setColor(0x00ff00)
						.setTimestamp();

					return interaction.reply({
						embeds: [embed],
					});
				}

				let discordNames = [];
				let mcUserIds = [];

				// dbの内容をそれぞれの配列に格納
				db.forEach((entry, index) => {
					discordNames.push(`${index + 1}. ${entry.discordUserName}`);
					mcUserIds.push(`${index + 1}. ${entry.mcUserId}`);
				});

				let embed = new EmbedBuilder()
					.setTitle(
						'登録済みの統合版マインクラフトのユーザー名とDiscordのユーザー名の対応表',
					)
					.setDescription('※ユーザー名を更新した場合は、再度登録してください。')
					.setColor(0x00ff00)
					.addFields(
						{
							name: 'Discordユーザー名',
							value: discordNames.length > 0 ? discordNames.join('\n') : 'なし',
							inline: true,
						},
						{
							name: 'マイクラのユーザー名',
							value: mcUserIds.length > 0 ? mcUserIds.join('\n') : 'なし',
							inline: true,
						},
					)
					.setTimestamp();

				return interaction.reply({
					embeds: [embed],
				});
			} else if (subcommand == 'remove') {
				let result = await userModel.deleteOne({ _id: discordUser.id });

				if (result.deletedCount === 0)
					return interaction.reply({
						content: '❌ そのユーザーのデータはありません！',
						flags: MessageFlags.Ephemeral,
					});

				return interaction.reply('✅ データを削除しました！');
			}
		} catch (err) {
			await interaction
				.reply({
					content: '❌ エラー発生しました！',
					flags: MessageFlags.Ephemeral,
				})
				.catch((err) => {});
			const errorNotification = require('../errorNotification.js');
			errorNotification(client, interaction, err);
		}
	},
};
