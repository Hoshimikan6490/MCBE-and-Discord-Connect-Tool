const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("username_dictionary")
    .setDescription("📚ユーザー名をdiscordのユーザー名と置き換えます！")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription(
          "統合版マインクラフトのユーザー名とdiscordのユーザー名の対応を追加します。"
        )
        .addStringOption((option) =>
          option
            .setName("mcUserId")
            .setDescription("統合版マインクラフトのユーザー名")
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("discordUser")
            .setDescription("Discordのユーザー")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("show")
        .setDescription(
          "既に設定されている統合版マインクラフトのユーザー名とdiscordのユーザー名の対応を表示します。"
        )
        .addUserOption((option) =>
          option
            .setName("discordUser")
            .setDescription("Discordのユーザー")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription(
          "既に設定されている統合版マインクラフトのユーザー名とdiscordのユーザー名の対応を削除します。"
        )
        .addUserOption((option) =>
          option
            .setName("discordUser")
            .setDescription("Discordのユーザー")
            .setRequired(true)
        )
    ),

  run: async (client, interaction) => {
    try {
      let subcommand = interaction.options.getSubcommand();
      let mcUserId = interaction.options.getString("mcUserId");
      let discordUser = interaction.options.getUser("discordUser");

      // discordのユーザー選択でBOTを選んだ場合
      if (discordUser.bot)
        return interaction.reply({
          content: "BOTを選択する事は出来ません。",
          flags: MessageFlags.Ephemeral,
        });

      if (subcommand == "add") {
      } else if (subcommand == "show") {
      } else if (subcommand == "remove") {
      }
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
