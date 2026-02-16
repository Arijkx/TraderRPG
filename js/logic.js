(function () {
  "use strict";
  window.Game = window.Game || {};
  const G = window.Game;

  let lastTickTime = 0;

  const MAX_PLAYER_LEVEL = (typeof G.MAX_PLAYER_LEVEL === "number" && G.MAX_PLAYER_LEVEL >= 1) ? G.MAX_PLAYER_LEVEL : 100;

  /** XP needed for next level; curve grows exponentially so high levels need much more. */
  function getXpForNextLevel(level) {
    if (level >= MAX_PLAYER_LEVEL) return Infinity;
    return Math.max(1, Math.round(300 * Math.pow(level, 1.6)));
  }

  function getSkillRank(skillId) {
    return Math.max(0, Math.floor(G.state.playerSkills?.[skillId] ?? 0));
  }

  function getSkillBonus(skillId) {
    const def = G.SKILLS?.find((s) => s.id === skillId);
    if (!def) return 0;
    const rank = getSkillRank(skillId);
    return rank * (def.effectValue ?? 0);
  }

  function getBuyDiscount() {
    return getSkillBonus("buy_discount");
  }
  function getSellBonus() {
    return getSkillBonus("sell_bonus");
  }
  function getUpgradeCostDiscount() {
    return getSkillBonus("upgrade_discount");
  }
  function getBuildingCostDiscount() {
    return getSkillBonus("building_cost");
  }
  /** Flat extra production per 24h per rank (integer, no decimals). */
  function getProductionBonusFlat() {
    const def = G.SKILLS?.find((s) => s.id === "production_bonus");
    if (!def || def.productionFlatPerRank == null) return 0;
    const rank = getSkillRank("production_bonus");
    return rank * (def.productionFlatPerRank ?? 0);
  }
  function getRentBonus() {
    return getSkillBonus("rent_bonus");
  }
  function getXpBonus() {
    return getSkillBonus("xp_bonus");
  }

  function addSkillPointOnLevelUp() {
    if (G.state.playerLevel <= MAX_PLAYER_LEVEL) {
      G.state.playerSkillPoints = (G.state.playerSkillPoints || 0) + 1;
    }
  }

  function addLog(msg, type) {
    G.state.log.unshift({ day: G.state.day, msg, type });
    if (G.state.log.length > 50) G.state.log.pop();
  }

  function applyAchievementReward(money, xp) {
    if (money > 0) G.state.money += money;
    if (xp > 0) {
      const xpMult = 1 + getXpBonus();
      G.state.playerXp += xp * xpMult;
      let required = getXpForNextLevel(G.state.playerLevel);
      while (G.state.playerLevel < MAX_PLAYER_LEVEL && G.state.playerXp >= required) {
        G.state.playerLevel += 1;
        G.state.playerXp -= required;
        addSkillPointOnLevelUp();
        required = getXpForNextLevel(G.state.playerLevel);
        addLog("Level up! Now level " + G.state.playerLevel + ". +1 skill point.", "income");
      }
    }
  }

  function checkAchievements() {
    const unlocked = G.state.achievements || [];
    G.ACHIEVEMENTS.forEach((ach) => {
      if (unlocked.includes(ach.id)) return;
      if (!ach.check(G.state)) return;
      G.state.achievements.push(ach.id);
      applyAchievementReward(ach.rewardMoney, ach.rewardXp);
      const rewards = [ach.rewardMoney && G.formatMoney(ach.rewardMoney), ach.rewardXp && ach.rewardXp + " XP"].filter(Boolean).join(", ");
      addLog("Achievement: " + ach.name + "! Reward: " + rewards + ".", "income");
    });
  }

  function roundPrice(p) {
    return Math.round(p * 100) / 100;
  }

  function randomWalk(price, rate) {
    if (rate === undefined) rate = 0.1;
    const change = (Math.random() - 0.48) * rate * Math.max(price, 0.5);
    return Math.max(0.01, roundPrice(price + change));
  }

  function advanceDay() {
    G.state.day += 1;
    if (G.state.day > 365) {
      G.state.day = 1;
      G.state.year += 1;
      addLog("New year! Year " + G.state.year + " begins.", "income");
    }
    let required = getXpForNextLevel(G.state.playerLevel);
    while (G.state.playerLevel < MAX_PLAYER_LEVEL && G.state.playerXp >= required) {
      G.state.playerLevel += 1;
      G.state.playerXp -= required;
      addSkillPointOnLevelUp();
      required = getXpForNextLevel(G.state.playerLevel);
      addLog("Level up! Now level " + G.state.playerLevel + ". +1 skill point.", "income");
    }
    G.GOODS.forEach((g) => {
      const slot = G.state.goods[g.id];
      slot.previousPrice = slot.price;
      slot.price = randomWalk(slot.price);
      const minPrice = g.basePrice < 10 ? 0.01 : Math.max(1, roundPrice(g.basePrice * 0.5));
      const maxPrice = g.basePrice < 10 ? 10 : Math.max(1, roundPrice(g.basePrice * 2));
      slot.price = roundPrice(Math.max(minPrice, Math.min(slot.price, maxPrice)));
      if (!slot.priceHistory) slot.priceHistory = [];
      slot.priceHistory.unshift(slot.price);
      if (slot.priceHistory.length > G.PRICE_HISTORY_DAYS) slot.priceHistory.pop();
    });
    const produced = {};
    let xpFromProduction = 0;
    Object.entries(G.state.buildings).forEach(([type, slot]) => {
      if (!slot || slot.count < 1) return;
      const def = G.BUILDING_TYPES[type];
      if (def.rent) return;
      const perUnit = def.baseOutput + (slot.level - 1) * def.upgradeOutputBonus;
      const flatBonus = getProductionBonusFlat();
      const amount = Math.max(0, Math.floor((perUnit * slot.count) + flatBonus * slot.count));
      G.state.goods[def.produces].qty += amount;
      produced[def.produces] = (produced[def.produces] || 0) + amount;
      xpFromProduction += amount;
    });
    const actualXpThisDay = xpFromProduction > 0 ? Math.floor(xpFromProduction * (1 + getXpBonus())) : 0;
    if (actualXpThisDay > 0) {
      G.state.playerXp += actualXpThisDay;
      while (G.state.playerLevel < MAX_PLAYER_LEVEL && G.state.playerXp >= required) {
        G.state.playerLevel += 1;
        G.state.playerXp -= required;
        addSkillPointOnLevelUp();
        required = getXpForNextLevel(G.state.playerLevel);
        addLog("Level up! Now level " + G.state.playerLevel + ". +1 skill point.", "income");
      }
    }
    if (G.state.day > 0 && G.state.day % 7 === 0) {
      let totalRent = 0;
      const rentMult = 1 + getRentBonus();
      Object.entries(G.state.buildings).forEach(([type, slot]) => {
        if (!slot || slot.count < 1) return;
        const def = G.BUILDING_TYPES[type];
        if (!def.rent) return;
        totalRent += def.rent * slot.count * rentMult;
      });
      if (totalRent > 0) {
        G.state.money += totalRent;
        addLog("Rent collected: " + G.formatMoney(totalRent) + " (real estate)", "income");
      }
    }
    const producedLines = Object.entries(produced)
      .map(([id, qty]) => qty + " " + G.GOODS.find((g) => g.id === id).name)
      .join(", ");
    if (producedLines) addLog("+" + producedLines + " (buildings)", "income");
    if (actualXpThisDay > 0) addLog("+" + actualXpThisDay + " XP (production this day)", "income");
    addLog("Day " + G.state.day + ". Market prices updated.", "");
    checkAchievements();
    lastTickTime = Date.now();
    G.saveState();
    if (G.render) G.render();
  }

  function updateZeitDisplay() {
    const elapsed = (Date.now() - lastTickTime) / 1000;
    const remaining = Math.max(0, Math.ceil(G.INCOME_INTERVAL_SEC - elapsed));
    const el = document.getElementById("zeit");
    if (el) el.textContent = remaining + " h";
  }

  function startIncomeTimer() {
    lastTickTime = lastTickTime || Date.now();
    setInterval(() => advanceDay(), G.INCOME_INTERVAL_SEC * 1000);
    setInterval(updateZeitDisplay, 1000);
    updateZeitDisplay();
  }

  function buyGood(goodId, amount) {
    const g = G.state.goods[goodId];
    const rawCost = g.price * amount;
    const cost = Math.max(0, rawCost * (1 - getBuyDiscount()));
    if (cost > G.state.money || amount <= 0) return;
    if (!G.state.stats) G.state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    G.state.stats.boughtOnce = true;
    G.state.money -= cost;
    g.qty += amount;
    addLog(amount + " " + G.GOODS.find((x) => x.id === goodId).name + " bought for " + G.formatMoney(cost), "spend");
    checkAchievements();
    G.saveState();
    if (G.render) G.render();
  }

  function sellGood(goodId, amount) {
    const g = G.state.goods[goodId];
    const sellQty = Math.min(amount, g.qty);
    if (sellQty <= 0) return;
    if (!G.state.stats) G.state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    G.state.stats.soldOnce = true;
    const revenue = g.price * sellQty * (1 + getSellBonus());
    G.state.money += revenue;
    g.qty -= sellQty;
    const goodName = G.GOODS.find((x) => x.id === goodId).name;
    addLog(sellQty + " " + goodName + " sold for " + G.formatMoney(revenue), "sell");
    checkAchievements();
    G.saveState();
    if (G.render) G.render();
  }

  function sellAllFromCategories(categoryNames) {
    if (!Array.isArray(categoryNames) || categoryNames.length === 0) return;
    const set = new Set(categoryNames);
    let soldAny = false;
    G.GOODS.forEach((g) => {
      const cat = g.category || "Other";
      if (!set.has(cat)) return;
      const slot = G.state.goods[g.id];
      const qty = slot?.qty ?? 0;
      if (qty <= 0) return;
      sellGood(g.id, qty);
      soldAny = true;
    });
    if (soldAny) addLog("Sold all from " + categoryNames.length + " selected categor" + (categoryNames.length === 1 ? "y" : "ies") + ".", "sell");
  }

  function getBuildingCost(type) {
    const def = G.BUILDING_TYPES[type];
    const count = G.state.buildings[type]?.count || 0;
    const raw = def.baseCost + count * 4500;
    return Math.max(0, Math.round(raw * (1 - getBuildingCostDiscount())));
  }

  function getBuildingMinLevel(type) {
    const def = G.BUILDING_TYPES[type];
    if (!def) return 1;
    if (typeof def.minLevel === "number" && def.minLevel >= 1) return def.minLevel;
    return 1;
  }

  function buyBuilding(type) {
    const minLevel = getBuildingMinLevel(type);
    if (G.state.playerLevel < minLevel) return;
    const cost = getBuildingCost(type);
    if (G.state.money < cost) return;
    G.state.money -= cost;
    if (G.state.buildings[type]) {
      G.state.buildings[type].count += 1;
    } else {
      G.state.buildings[type] = { count: 1, level: 1 };
    }
    const name = G.BUILDING_TYPES[type].name;
    const slot = G.state.buildings[type];
    addLog(name + (slot.count > 1 ? " x" + slot.count : "") + " bought for " + G.formatMoney(cost), "spend");
    checkAchievements();
    G.saveState();
    if (G.render) G.render();
  }

  function getUpgradeCost(type) {
    const slot = G.state.buildings[type];
    if (!slot) return Infinity;
    const def = G.BUILDING_TYPES[type];
    if (def.rent) return Infinity;
    const maxLevel = (typeof G.MAX_BUILDING_LEVEL === "number" && G.MAX_BUILDING_LEVEL >= 1) ? G.MAX_BUILDING_LEVEL : 99;
    if (slot.level >= maxLevel) return Infinity;
    const raw = def.upgradeCostBase * slot.level;
    return Math.max(0, Math.round(raw * (1 - getUpgradeCostDiscount())));
  }

  function getTotalUpgradeCost(type, count) {
    if (!count || count < 1) return 0;
    const slot = G.state.buildings[type];
    if (!slot) return Infinity;
    const def = G.BUILDING_TYPES[type];
    if (def.rent) return Infinity;
    const maxLevel = (typeof G.MAX_BUILDING_LEVEL === "number" && G.MAX_BUILDING_LEVEL >= 1) ? G.MAX_BUILDING_LEVEL : 99;
    const remaining = maxLevel - slot.level;
    if (remaining <= 0) return Infinity;
    const n = Math.min(count, remaining);
    const L = slot.level;
    const raw = def.upgradeCostBase * (n * L + (n * (n - 1)) / 2);
    return Math.max(0, Math.round(raw * (1 - getUpgradeCostDiscount())));
  }

  function investSkillPoint(skillId) {
    const def = G.SKILLS?.find((s) => s.id === skillId);
    if (!def) return;
    const rank = getSkillRank(skillId);
    if (rank >= def.maxRanks) return;
    const cost = def.costPerRank ?? 1;
    const points = G.state.playerSkillPoints ?? 0;
    if (points < cost) return;
    if (!G.state.playerSkills) G.state.playerSkills = {};
    G.state.playerSkills[skillId] = rank + 1;
    G.state.playerSkillPoints = points - cost;
    addLog("Skill: " + def.name + " rank " + (rank + 1) + "/" + def.maxRanks + ".", "income");
    G.saveState();
    if (G.render) G.render();
  }

  function upgradeBuilding(type, count) {
    const amount = (typeof count === "number" && count >= 1) ? Math.floor(count) : 1;
    const def = G.BUILDING_TYPES[type];
    if (def && def.rent) return;
    const slot = G.state.buildings[type];
    if (!slot) return;
    const maxLevel = (typeof G.MAX_BUILDING_LEVEL === "number" && G.MAX_BUILDING_LEVEL >= 1) ? G.MAX_BUILDING_LEVEL : 99;
    if (slot.level >= maxLevel) return;
    const remaining = maxLevel - slot.level;
    const n = Math.min(amount, remaining);
    if (n < 1) return;
    const totalCost = getTotalUpgradeCost(type, n);
    if (totalCost === Infinity || G.state.money < totalCost) return;
    G.state.money -= totalCost;
    slot.level += n;
    const name = G.BUILDING_TYPES[type].name;
    if (!G.state.stats) G.state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    G.state.stats.upgrades = (G.state.stats.upgrades || 0) + n;
    addLog(name + " (all " + slot.count + ") upgraded to level " + slot.level + " for " + G.formatMoney(totalCost) + (n > 1 ? " (+" + n + ")" : ""), "spend");
    checkAchievements();
    G.saveState();
    if (G.render) G.render();
  }

  function getBuildingOutputTotal(type, slot) {
    const def = G.BUILDING_TYPES[type];
    if (def.rent) return 0;
    const perUnit = def.baseOutput + (slot.level - 1) * def.upgradeOutputBonus;
    return perUnit * slot.count;
  }

  function getBuildingRentTotal(type, slot) {
    const def = G.BUILDING_TYPES[type];
    if (!def.rent || !slot) return 0;
    return def.rent * slot.count;
  }

  function getProducedGoodName(type) {
    const goodId = G.BUILDING_TYPES[type].produces;
    return G.GOODS.find((g) => g.id === goodId).name;
  }

  Object.assign(window.Game, {
    getXpForNextLevel,
    getSkillRank,
    getProductionBonusFlat,
    getBuyDiscount,
    investSkillPoint,
    addLog,
    advanceDay,
    startIncomeTimer,
    updateZeitDisplay,
    buyGood,
    sellGood,
    sellAllFromCategories,
    getBuildingCost,
    getBuildingMinLevel,
    buyBuilding,
    getUpgradeCost,
    getTotalUpgradeCost,
    upgradeBuilding,
    getBuildingOutputTotal,
    getBuildingRentTotal,
    getProducedGoodName,
  });
})();
