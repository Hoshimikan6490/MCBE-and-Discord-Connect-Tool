// Discord BOTのToken
const botToken = 'YOUR_DISCORD_BOT_TOKEN_HERE';
// 連携先Discord ChannelのChannel ID
const channelID = '1234567890';
// Discord BOTのAPIポート
// ※同一PCで両方のプログラムを起動する場合は設定を変えなくて大丈夫です。アドオンのみを利用する場合は「//」の位置を上下で入れ替えてください。
// ※Discord BOTを利用しない場合にURLが入力されていても動作はしますが、各種処理をするたびに通信を試みるためdiscordへの転送に遅延が生じます。
const discordUserNameAPIurl = 'http://localhost:8000'; // Discord BOTも利用する場合はこの行のようにURLを指定する
//const discordUserNameAPIurl = ""; // Discord BOTを利用しない場合はこの行のように空欄にする

export { channelID, botToken, discordUserNameAPIurl };
