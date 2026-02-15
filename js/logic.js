(function () {
  "use strict";
  window.Game = window.Game || {};
  const G = window.Game;

  let lastTickTime = 0;

  function getXpForNextLevel(level) {
    return 100 * level;
  }

  function addLog(msg, type) {
    G.state.log.unshift({ day: G.state.day, msg, type });
    if (G.state.log.length > 50) G.state.log.pop();
  }

  function applyAchievementReward(money, xp) {
    if (money > 0) G.state.money += money;
    if (xp > 0) {
      G.state.playerXp += xp;
      let required = getXpForNextLevel(G.state.playerLevel);
      while (G.state.playerXp >= required) {
        G.state.playerLevel += 1;
        G.state.playerXp -= required;
        required = getXpForNextLevel(G.state.playerLevel);
        addLog("Level up! Now level " + G.state.playerLevel + ".", "income");
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

  function randomWalk(price, rate) {
    if (rate === undefined) rate = 0.1;
    const change = (Math.random() - 0.48) * rate * price;
    return Math.max(1, Math.round(price + change));
  }

  function advanceDay() {
    G.state.day += 1;
    if (G.state.day > 365) {
      G.state.day = 1;
      G.state.year += 1;
      addLog("New year! Year " + G.state.year + " begins.", "income");
    }
    let required = getXpForNextLevel(G.state.playerLevel);
    while (G.state.playerXp >= required) {
      G.state.playerLevel += 1;
      G.state.playerXp -= required;
      required = getXpForNextLevel(G.state.playerLevel);
      addLog("Level up! Now level " + G.state.playerLevel + ".", "income");
    }
    G.GOODS.forEach((g) => {
      const slot = G.state.goods[g.id];
      slot.previousPrice = slot.price;
      slot.price = randomWalk(slot.price);
      const minPrice = Math.max(1, Math.round(g.basePrice * 0.5));
      const maxPrice = Math.max(1, g.basePrice * 2);
      slot.price = Math.max(minPrice, Math.min(slot.price, maxPrice));
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
      const amount = perUnit * slot.count;
      G.state.goods[def.produces].qty += amount;
      produced[def.produces] = (produced[def.produces] || 0) + amount;
      xpFromProduction += amount;
    });
    if (xpFromProduction > 0) {
      G.state.playerXp += xpFromProduction;
      while (G.state.playerXp >= required) {
        G.state.playerLevel += 1;
        G.state.playerXp -= required;
        required = getXpForNextLevel(G.state.playerLevel);
        addLog("Level up! Now level " + G.state.playerLevel + ".", "income");
      }
    }
    if (G.state.day > 0 && G.state.day % 7 === 0) {
      let totalRent = 0;
      Object.entries(G.state.buildings).forEach(([type, slot]) => {
        if (!slot || slot.count < 1) return;
        const def = G.BUILDING_TYPES[type];
        if (!def.rent) return;
        const rent = def.rent * slot.count;
        totalRent += rent;
      });
      if (totalRent > 0) {
        G.state.money += totalRent;
        addLog("Rent collected: " + G.formatMoney(totalRent) + " (real estate)", "income");
      }
    }
    const producedLines = Object.entries(produced)
      .map(([id, qty]) => qty + " " + G.GOODS.find((g) => g.id === id).name + " (+" + qty + " XP)")
      .join(", ");
    if (producedLines) addLog("+" + producedLines + " (buildings)", "income");
    if (xpFromProduction > 0) addLog("+" + xpFromProduction + " XP (production this day)", "income");
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
    const cost = g.price * amount;
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
    const revenue = g.price * sellQty;
    G.state.money += revenue;
    g.qty -= sellQty;
    const goodName = G.GOODS.find((x) => x.id === goodId).name;
    addLog(sellQty + " " + goodName + " sold for " + G.formatMoney(revenue), "sell");
    checkAchievements();
    G.saveState();
    if (G.render) G.render();
  }

  function getBuildingCost(type) {
    const def = G.BUILDING_TYPES[type];
    const count = G.state.buildings[type]?.count || 0;
    return def.baseCost + count * 4500;
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
    return def.upgradeCostBase * slot.level;
  }

  function upgradeBuilding(type) {
    const def = G.BUILDING_TYPES[type];
    if (def && def.rent) return;
    const slot = G.state.buildings[type];
    if (!slot) return;
    const cost = getUpgradeCost(type);
    if (G.state.money < cost) return;
    G.state.money -= cost;
    slot.level += 1;
    const name = G.BUILDING_TYPES[type].name;
    if (!G.state.stats) G.state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    G.state.stats.upgrades = (G.state.stats.upgrades || 0) + 1;
    addLog(name + " (all " + slot.count + ") upgraded to level " + slot.level + " for " + G.formatMoney(cost), "spend");
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
    addLog,
    advanceDay,
    startIncomeTimer,
    updateZeitDisplay,
    buyGood,
    sellGood,
    getBuildingCost,
    getBuildingMinLevel,
    buyBuilding,
    getUpgradeCost,
    upgradeBuilding,
    getBuildingOutputTotal,
    getBuildingRentTotal,
    getProducedGoodName,
  });
})();
