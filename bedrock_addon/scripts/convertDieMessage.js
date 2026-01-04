export default async (damageSource) => {
	// 金床の落下で死んだ場合
	if (damageSource.cause == 'anvil') return '落下してきた金床に押しつぶされた';

	// ブロックの爆発で死んだ場合
	// エンドクリスタルの爆発や、ネザーでベットで寝た場合等
	if (damageSource.cause == 'blockExplosion') {
		return '[意図的なゲーム デザイン]に倒された';
	}

	// サボテンで死んだ場合
	if (damageSource.cause == 'contact') {
		if (damageSource.damagingEntity?.typeId == 'minecraft:pufferfish')
			return 'フグに殺害された';
		return 'サボテンまたはスイートベリーの棘が刺さって死んだ'; //仕様上区別できない
	}

	// 溺れた場合
	if (damageSource.cause == 'drowning') return '溺れ死んだ';

	// MOBの攻撃で死んだ場合
	if (damageSource.cause == 'entityAttack') {
		// ハチの攻撃で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:bee')
			return 'ミツバチに殺害された';
		// オオカミの攻撃で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:wolf')
			return 'オオカミに殺害された';
		// シロクマに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:polar_bear')
			return 'シロクマに殺害された';
		// パンダに殺害された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:panda')
			return 'パンダに殺害された';
		// エンダーマンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:enderman')
			return 'エンダーマンに殺害された';
		// シルバーフィッシュに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:silverfish')
			return 'シルバーフィッシュに殺害された';
		// ウィザースケルトンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:wither_skeleton')
			return 'ウィザースケルトンに殺害された';
		// スライムに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:slime')
			return 'スライムに殺害された';
		// クモに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:spider')
			return 'クモに殺害された';
		// ゾンビに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:zombie')
			return 'ゾンビに殺害された';
		// ゾンビピッグマンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:zombie_pigman')
			return 'ゾンビピグリンに殺害された';
		// ハスクに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:husk')
			return 'ハスクに殺害された';
		// ドラウンドに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:drowned')
			return 'ドラウンドに殺害された';
		// 洞窟グモに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:cave_spider')
			return '洞窟グモに殺害された';
		// ガーディアンのビームで死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:guardian')
			return 'ガーディアンに殺害された';
		// エルダーガーディアンのビームで死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:elder_guardian')
			return 'エルダーガーディアンに殺害された';
		// エンダーマイトに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:endermite')
			return 'エンダーマイトに殺害された';
		// マグマキューブに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:magma_cube')
			return 'マグマキューブに殺害された';
		// ホグリンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:hoglin')
			return 'ホグリンに殺害された';
		// ゾグリンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:zoglin')
			return 'ゾグリンに殺害された';
		// ピグリンブルートに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:piglin_brute')
			return 'ピグリンブルートに殺害された';
		// ウォーデンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:warden')
			return 'ウォーデンに殺害された';
		// ブレイズに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:blaze')
			return 'ブレイズに殺害された';
		// ヴィンディケーターに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:vindicator')
			return 'ヴィンディケーターに殺害された';
		// ヴェックスに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:vex')
			return 'ヴェックスに殺害された';
		// 村人ゾンビに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:zombie_villager_v2')
			return '村人ゾンビに殺害された';
		// ファントムの攻撃で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:phantom')
			return 'ファントムに殺害された';
		// アイアンゴーレムに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:iron_golem')
			return 'アイアンゴーレムに殺害された';
		// エンダードラゴンに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:ender_dragon')
			return 'エンダードラゴンに殺害された';
		// ウィザーに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:wither')
			return 'ウィザーに殺害された';
		// プレイヤーの攻撃で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:player')
			return 'プレイヤーに殺害された';
		// クリーキングに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:creaking')
			return 'クリーキングに殺害された';
	}

	// エンティティの爆発で死んだ場合
	if (damageSource.cause == 'entityExplosion') {
		// 爆発の発生源次第で処理を変える
		if (damageSource.damagingEntity?.typeId == 'minecraft:tnt')
			return 'TNT火薬のブロックに爆破された';
		if (damageSource.damagingEntity?.typeId == 'minecraft:creeper')
			return 'クリーパーに爆発された';
		// ウィザーの爆発で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:wither')
			return 'ウィザーに爆発された';
		// ウィザーが飛ばしてくる爆発物で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:wither_skull')
			return 'ウィザーに爆発された';
	}

	// 落下ダメージで死んだ場合(低い位置から落ちても(地面と強く激突した場合でも)同じ扱い)
	if (damageSource.cause == 'fall') return '高い所から落ちた';

	// 火の単発ダメージで死んだ場合
	if (damageSource.cause == 'fire') return '炎に巻かれた';

	// 火の継続ダメージで死んだ場合
	if (damageSource.cause == 'fireTick') return 'こんがりと焼けた';

	// 花火の爆発で死んだ場合
	if (damageSource.cause == 'fireworks') return '花火の爆発に巻き込まれた';

	// エリトラで死んだ場合
	if (damageSource.cause == 'flyIntoWall') return '運動エネルギーを体験した';

	// 粉雪で死んだ場合
	if (damageSource.cause == 'freezing') return '凍え死んだ';

	// 溶岩に落ちた場合
	if (damageSource.cause == 'lava') return '溶岩遊泳を試みた';

	// 落雷で死んだ場合
	if (damageSource.cause == 'lightning') return '雷に打たれた';

	// 壁の中で窒息死した時
	if (damageSource.cause == 'suffocation') return '壁の中で窒息した';

	// マグマブロックで死んだ場合
	if (damageSource.cause == 'magma') return '足元が溶岩だと気づいた';

	// コマンドなどで死んだ場合
	if (damageSource.cause == 'none') return '死んだ';

	// ビヘイビアーパックの体力削りで死んだ場合
	if (damageSource.cause == 'override') return '死んだ';

	// ヤギの突進で死んだ場合
	if (damageSource.cause == 'ramAttack') return '死んだ'; //'ヤギに突進されて力尽きた'が本来のはずだが、統合版内のログに合わせる

	// killコマンドで死んだ場合
	if (damageSource.cause == 'selfDestruct') return '死んだ';

	// 衝撃波で死んだ場合
	if (damageSource.cause == 'sonicBoom')
		// ウォーデンの衝撃波で死んだ場合
		return 'ウォーデンから逃れようとして衝撃波に消し飛ばされた';

	// 奈落の底で死んだ場合
	if (damageSource.cause == 'void') return '奈落の底へ落ちた';

	// ウィザー効果で死んだ場合
	if (damageSource.cause == 'wither') return '干からびた';

	// 鍾乳石で死んだ場合
	// 上から落ちてきた
	if (damageSource.cause == 'stalactite')
		return '落ちてきた鍾乳石に串刺しにされた';
	// 足元
	if (damageSource.cause == 'stalagmite') return '石筍に突き刺さった';

	// 空腹で死んだ場合
	if (damageSource.cause == 'starve') return '飢え死にした';

	// トゲで死んだ場合
	if (damageSource.cause == 'thorns') {
		// ガーディアンのトゲで死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:guardian')
			return 'ガーディアンを傷つけようとして殺害された';
		// エルダーガーディアンのトゲで死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:elder_guardian')
			return 'エルダーガーディアンを傷つけようとして殺害された';
		// 棘の鎧で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:player')
			return '棘の鎧で反撃された';
	}

	// エフェクトで死んだ場合
	if (damageSource.cause == 'magic') {
		// ウィッチの魔法で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:witch')
			return 'ウィッチの魔法で殺された';
		// エヴォーカーの魔法で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:evocation_illager')
			return 'エヴォーカーの魔法で殺された';
		// プレイヤーの魔法(魔法の矢など)で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:player')
			return 'プレイヤーの魔法で殺された';
		// それ以外の魔法で死んだ場合
		return '魔法で殺された';
	}

	// 飛翔物で死んだ場合
	if (damageSource.cause == 'projectile') {
		// 矢で死んだ場合
		if (damageSource.damagingProjectile?.typeId == 'minecraft:arrow') {
			// 矢の発射者次第で処理を変える
			if (damageSource.damagingEntity?.typeId == 'minecraft:player')
				return 'プレイヤーに射抜かれた';
			if (damageSource.damagingEntity?.typeId == 'minecraft:arrow')
				return '矢に殺害された';
			if (damageSource.damagingEntity?.typeId == 'minecraft:skeleton')
				return 'スケルトンに射抜かれた';
			if (damageSource.damagingEntity?.typeId == 'minecraft:stray')
				return 'ストレイに射抜かれた';
			if (damageSource.damagingEntity?.typeId == 'minecraft:pillager')
				return 'ピリジャーに射抜かれた';
			if (damageSource.damagingEntity?.typeId == 'minecraft:piglin')
				return 'ピグリンに射抜かれた';
			if (damageSource.damagingEntity?.typeId == 'minecraft:bogged')
				return 'ボグドに射抜かれた';
			if (damageSource.damagingEntity?.typeId == 'minecraft:parched')
				return 'パーチドに射抜かれた';
		}

		// トライデントで死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:trident')
			return 'トライデントに殺害された';
		// 飛んできたトライデントで死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:thrown_trident')
			return 'トライデントに殺害された';
		// ラマに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:llama')
			return 'ラマに丸めてポイされた';
		// 商人のラマに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:trader_llama')
			return '商人のラマに丸めてポイされた';
		// ブレイズに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:blaze')
			return 'ブレイズに火だるまにされた';
		// シュルカーの玉で死んだ場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:shulker')
			return 'シュルカーに狙撃された';
		// ブリーズに殺された場合
		if (damageSource.damagingEntity?.typeId == 'minecraft:breeze')
			return 'ブリーズに殺害された';
		// ウィンドチャージの爆発で死んだ場合
		if (
			damageSource.damagingEntity?.typeId == 'minecraft:wind_charge_projectile'
		)
			return 'ウィンドチャージに殺害され';
		return '飛翔物に殺害された';
	}

	return null;
};
