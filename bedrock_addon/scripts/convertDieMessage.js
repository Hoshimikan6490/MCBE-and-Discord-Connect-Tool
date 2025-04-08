module.exports = async (damageSource) => {
  // 矢で死んだ場合
  if (damageSource.damagingProjectile.typeId == "minecraft:arrow") {
    // 矢の発射者次第で処理を変える
    if (damageSource.cause.typeId == "minecraft:player")
      return "他のプレイヤーが射った矢に射抜かれた";
    if (damageSource.cause.typeId == "minecraft:arrow")
      return "どこかから飛んできた矢に射抜かれた";
    if (damageSource.cause.typeId == "minecraft:skeleton")
      return "スケルトンが射った矢に射抜かれた";
    if (damageSource.cause.typeId == "minecraft:stray")
      return "ストレイが射った矢に射抜かれた";
    if (damageSource.cause.typeId == "minecraft:pillager")
      return "ピリジャーが射った矢に射抜かれた";
  }

  // サボテンで死んだ場合
  if (damageSource.cause == "minecraft:cactus")
    return "サボテンが刺さって死んだ";

  // 溺れた場合
  if (damageSource.cause == "minecraft:drowning") return "溺れ死んだ";

  // エリトラで死んだ場合
  if (damageSource.cause == "minecraft:flyIntoWall")
    return "運動エネルギーを体験した";

  // エンティティの爆発で死んだ場合
  if (damageSource.cause.typeId == "minecraft:entityExplosion") {
    // 爆発の発生源次第で処理を変える
    if (damageSource.cause.exploder.typeId == "minecraft:tnt")
      return "TNTの爆発に巻き込まれた";
    if (damageSource.cause.exploder.typeId == "minecraft:creeper")
      return "クリーパーの爆発に巻き込まれた";
    if (damageSource.cause.exploder.typeId == "minecraft:ender_crystal")
      return "エンダークリスタルの爆発に巻き込まれた";
  }

  // ブロックの爆発で死んだ場合
  // エンドクリスタルの爆発や、ネザーでベットで寝た場合等
  if (damageSource.cause.typeId == "minecraft:blockExplosion") {
    return "爆発に巻き込まれた";
  }

  // 落下ダメージで死んだ場合
  if (damageSource.cause == "fall")
    return "落下ダメージ(エンダーパールによるダメージも含む)で力尽きた";

  // 金床の落下で死んだ場合
  if (damageSource.cause == "anvil") return "落下してきた金床に押しつぶされた";

  // 火に焼かれた場合
  if (damageSource.cause == "fireTick") return "こんがりと焼けた";

  // 花火の爆発で死んだ場合
  if (damageSource.cause == "fireworks") return "花火の爆発に巻き込まれた";

  // 溶岩に落ちた場合
  if (damageSource.cause == "lava") return "溶岩遊泳を試みた";

  // 落雷で死んだ場合
  if (damageSource.cause == "lightning") return "雷に打たれた";

  // マグマブロックで死んだ場合
  if (damageSource.cause == "magma") return "足元が溶岩だと気づいた";

  // エフェクトで死んだ場合
  if (damageSource.cause == "magic") {
    // ウィッチの魔法で死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:witch")
      return "ウィッチの魔法で殺された";
    // エヴォーカーの魔法で死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:evocation_illager")
      return "エヴォーカーの魔法で殺された";
    // プレイヤーの魔法で死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:player")
      return "プレイヤーの魔法で殺された";
    // それ以外の魔法で死んだ場合
    return "魔法で死んだ";
  }

  // 飛翔物で死んだ場合
  if (damageSource.cause == "projectile") {
    // トライデントで死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:trident")
      return "トライデントに殺害された";
    return "飛翔物に殺害された";
  }

  // MOBの攻撃で死んだ場合
  if (damageSource.cause == "entityAttack") {
    // ハチの攻撃で死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:bee")
      return "ミツバチに殺害された";
    // オオカミの攻撃で死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:wolf")
      return "オオカミに殺害された";
    // ホッキョクグマに殺された場合
    if (damageSource.damagingEntity.typeId == "minecraft:polar_bear")
      return "ホッキョクグマに殺害された";
    // ラマに殺害された場合
    if (damageSource.damagingEntity.typeId == "minecraft:llama")
      return "ラマに丸めてポイされた";
    // フグに殺害された場合
    if (damageSource.damagingEntity.typeId == "minecraft:pufferfish")
      return "フグに殺害された";
    // パンダに殺害された場合
    if (damageSource.damagingEntity.typeId == "minecraft:panda")
      return "パンダに殺害された";
    // エンダーマンに殺された場合
    if (damageSource.damagingEntity.typeId == "minecraft:enderman")
      return "エンダーマンに殺害された";
    // シルバーフィッシュに殺された場合
    if (damageSource.damagingEntity.typeId == "minecraft:silverfish")
      return "シルバーフィッシュに殺害された";
    // プレイヤーの攻撃で死んだ場合
    if (damageSource.damagingEntity.typeId == "minecraft:player")
      return "プレイヤーに殺害された";
  }
};
