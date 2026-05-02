const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		_id: { type: String, required: true }, //ユーザーID
		mcUserId: { type: String, required: true }, //マイクラのユーザーID
		discordUserName: { type: String, required: true }, //Discordのユーザー名
	},
	{ versionKey: false },
);

const model = mongoose.model('users', userSchema);

module.exports = model;
