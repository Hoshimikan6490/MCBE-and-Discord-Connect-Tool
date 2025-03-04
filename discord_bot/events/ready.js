const { REST, Routes, ActivityType } = require("discord.js");
const discord_token = process.env.discord_token;

module.exports = async (client) => {
  //discord botへのコマンドの設定
  const rest = new REST({ version: "10" }).setToken(discord_token);
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: await client.commands,
      });
      console.log("スラッシュコマンドの再読み込みに成功しました。");
    } catch (err) {
      console.log(
        `❌ スラッシュコマンドの再読み込み時にエラーが発生しました。：\n${err}`
      );
    }
  })();

  console.log(`${client.user.username}への接続に成功しました。`);

  //カスタマイズアクティビティを設定
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は${client.guilds.cache.size}`,
      type: ActivityType.Listening,
    });
  }, 10000);
};
