const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mcpePing = require("mcpe-ping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("💻マイクラサーバーのステータスを表示します。"),

  run: async (client, interaction) => {
    try {
      await interaction.deferReply(); // 応答を遅延させる
      let IPaddress = process.env.mcIPaddress;
      let port = process.env.mcPort || 19132; // デフォルトのポート番号

      if (!IPaddress)
        return interaction.reply(
          "IPアドレスが設定されていません。\n.envファイルを確認してください。設定後はBOTの再起動が必要です。"
        );

      mcpePing(IPaddress, port, (err, res) => {
        if (err) {
          // サーバーがオフラインの場合
          let embed = new EmbedBuilder()
            .setTitle("🔴 サーバーはオフラインです")
            .setColor(0xff0000);

          return interaction.editReply({
            embeds: [embed],
          });
        } else {
          // サーバーがオンラインの場合
          let embed = new EmbedBuilder()
            .setTitle(`🟢 ${res.cleanName || "サーバー"}はオンラインです。`)
            .addFields(
              { name: "ipアドレス", value: res.rinfo.address, inline: true },
              {
                name: "ポート",
                value: res.rinfo.port.toString(),
                inline: true,
              },
              {
                name: "プレイヤー数(現在の接続人数/最大接続人数)",
                value: `${res.currentPlayers}/${res.maxPlayers}`,
                inline: true,
              },
              {
                name: "バージョン",
                value: `統合版マインクラフト v${res.version}` || "不明",
                inline: true,
              }
            )
            .setColor(0x00ff00);

          return interaction.editReply({ embeds: [embed] });
        }
      });
    } catch (err) {
      const errorNotification = require("../errorNotification.js");
      errorNotification(client, interaction, err);
    }
  },
};
