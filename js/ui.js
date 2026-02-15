(function () {
  "use strict";
  window.Game = window.Game || {};
  const G = window.Game;

  function formatMoney(n) {
    return new Intl.NumberFormat("en-US", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + " $";
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }

  function getSearchQuery(tabId) {
    return (G.uiState.searchQueries && G.uiState.searchQueries[tabId]) ? String(G.uiState.searchQueries[tabId]).trim().toLowerCase() : "";
  }

  function setSearchQuery(tabId, value) {
    if (!G.uiState.searchQueries) G.uiState.searchQueries = { market: "", "buildings-shop": "", "my-buildings": "", resources: "" };
    G.uiState.searchQueries[tabId] = value;
    G.render();
  }

  function isCategoryOpen(cat, tabId) {
    const tab = G.uiState.categoriesOpen[tabId];
    if (!tab || typeof tab !== "object") return true;
    return tab[cat] !== false;
  }

  function toggleCategory(cat, tabId) {
    if (!G.uiState.categoriesOpen[tabId]) G.uiState.categoriesOpen[tabId] = {};
    G.uiState.categoriesOpen[tabId][cat] = !isCategoryOpen(cat, tabId);
    G.saveUiState();
    G.render();
  }

  function getPriceChangeBadge(goodId) {
    const data = G.state.goods[goodId];
    if (!data || data.previousPrice == null || data.previousPrice === undefined) return "";
    const diff = data.price - data.previousPrice;
    if (diff > 0) return '<span class="badge badge-price-change badge-up" title="Price rose">▲</span>';
    if (diff < 0) return '<span class="badge badge-price-change badge-down" title="Price fell">▼</span>';
    return '<span class="badge badge-price-change badge-same" title="Price unchanged">●</span>';
  }

  function getPriceChartSvg(goodId) {
    const data = G.state.goods[goodId];
    const history = data?.priceHistory || [];
    if (history.length === 0) return '<span class="price-chart-empty" title="No history yet">—</span>';
    const w = 80, h = 28, pad = 2;
    const points = history.slice().reverse();
    const minP = Math.min(...points), maxP = Math.max(...points), range = maxP - minP || 1;
    const innerW = w - 2 * pad, innerH = h - 2 * pad, n = points.length;
    const pts = n === 1 ? pad + "," + (h / 2) + " " + (w - pad) + "," + (h / 2) : points.map((p, i) => {
      const x = pad + (n > 1 ? (i / (n - 1)) * innerW : 0);
      const y = pad + innerH - ((p - minP) / range) * innerH;
      return x + "," + y;
    }).join(" ");
    return "<svg class=\"price-chart-svg\" width=\"" + w + "\" height=\"" + h + "\" viewBox=\"0 0 " + w + " " + h + "\" aria-hidden=\"true\" title=\"Price history (last " + Math.min(n, G.PRICE_HISTORY_DAYS) + " days)\"><polyline fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" points=\"" + pts + "\"/></svg>";
  }

  function getPriceChartExpandedSvg(goodId) {
    const good = G.GOODS.find((g) => g.id === goodId);
    const basePrice = good ? good.basePrice : 10;
    const data = G.state.goods[goodId];
    const history = data?.priceHistory || [];
    const days = G.PRICE_HISTORY_DAYS;
    const w = 1040, h = 140, pad = 24;
    const innerW = w - 2 * pad, innerH = h - 2 * pad;
    const minY = Math.max(1, Math.round(basePrice * 0.5)), maxY = Math.max(1, basePrice * 2), rangeY = maxY - minY || 1;
    const valueToY = (v) => pad + innerH - ((v - minY) / rangeY) * innerH;
    const baselineY = valueToY(basePrice);
    const barGap = 1, barTotalW = innerW / days, barW = Math.max(1, barTotalW - barGap);
    const slots = [];
    for (let i = 0; i < days; i++) slots.push((days - 1 - i) < history.length ? history[days - 1 - i] : null);
    if (slots.filter((v) => v != null).length === 0) return "<p class=\"chart-expanded-empty\">No history yet.</p>";
    let gridLines = "";
    for (let i = 0; i <= days; i++) {
      const gx = pad + i * barTotalW;
      gridLines += "<line x1=\"" + gx + "\" y1=\"" + pad + "\" x2=\"" + gx + "\" y2=\"" + (pad + innerH) + "\" stroke=\"var(--border)\" stroke-width=\"1\" class=\"chart-grid-line\"/>";
    }
    gridLines += "<line x1=\"" + pad + "\" y1=\"" + pad + "\" x2=\"" + (w - pad) + "\" y2=\"" + pad + "\" stroke=\"var(--border)\" stroke-width=\"1\" class=\"chart-grid-line\"/>";
    gridLines += "<line x1=\"" + pad + "\" y1=\"" + (pad + innerH) + "\" x2=\"" + (w - pad) + "\" y2=\"" + (pad + innerH) + "\" stroke=\"var(--border)\" stroke-width=\"1\" class=\"chart-grid-line\"/>";
    const baselineLine = "<line x1=\"" + pad + "\" y1=\"" + baselineY + "\" x2=\"" + (w - pad) + "\" y2=\"" + baselineY + "\" stroke=\"var(--text-muted)\" stroke-width=\"1\" class=\"chart-baseline\"/>";
    let bars = "", hoverRects = "";
    for (let i = 0; i < days; i++) {
      const value = slots[i];
      const x = pad + i * barTotalW + barGap / 2;
      const dayLabel = i === days - 1 ? "Today" : i === days - 2 ? "Yesterday" : (days - 1 - i) + " days ago";
      if (value == null) {
        bars += "<rect x=\"" + x + "\" y=\"" + pad + "\" width=\"" + barW + "\" height=\"" + innerH + "\" fill=\"transparent\"><title>No value – " + dayLabel + "</title></rect>";
      } else {
        const title = formatMoney(value) + " – " + dayLabel + (value > basePrice ? " (above base)" : value < basePrice ? " (below base)" : " (base)");
        if (value > basePrice) {
          const barTopY = valueToY(value), barHeight = Math.max(1, baselineY - barTopY);
          bars += "<rect class=\"chart-bar chart-bar-up\" x=\"" + x + "\" y=\"" + barTopY + "\" width=\"" + barW + "\" height=\"" + barHeight + "\" fill=\"var(--accent)\"><title>" + escapeHtml(title) + "</title></rect>";
        } else if (value < basePrice) {
          const barBottomY = valueToY(value), barHeight = Math.max(1, barBottomY - baselineY);
          bars += "<rect class=\"chart-bar chart-bar-down\" x=\"" + x + "\" y=\"" + baselineY + "\" width=\"" + barW + "\" height=\"" + barHeight + "\" fill=\"var(--danger)\"><title>" + escapeHtml(title) + "</title></rect>";
        } else {
          bars += "<rect class=\"chart-bar chart-bar-base\" x=\"" + x + "\" y=\"" + (baselineY - 0.5) + "\" width=\"" + barW + "\" height=\"1\" fill=\"var(--text-muted)\"><title>" + escapeHtml(title) + "</title></rect>";
        }
      }
      const hx = pad + i * barTotalW;
      const hoverTitle = value == null ? "No value – " + dayLabel : formatMoney(slots[i]) + " – " + dayLabel + (slots[i] > basePrice ? " (above base)" : slots[i] < basePrice ? " (below base)" : " (base)");
      const hoverClass = value == null ? "chart-bar-hover chart-bar-hover-empty" : value > basePrice ? "chart-bar-hover chart-bar-hover-up" : value < basePrice ? "chart-bar-hover chart-bar-hover-down" : "chart-bar-hover chart-bar-hover-base";
      hoverRects += "<rect x=\"" + hx + "\" y=\"" + pad + "\" width=\"" + barTotalW + "\" height=\"" + innerH + "\" fill=\"transparent\" class=\"" + hoverClass + "\"><title>" + escapeHtml(hoverTitle) + "</title></rect>";
    }
    return "<svg class=\"price-chart-expanded-svg price-chart-bars\" width=\"" + w + "\" height=\"" + h + "\" viewBox=\"0 0 " + w + " " + h + "\" aria-label=\"Price history last " + days + " days (Base: " + formatMoney(basePrice) + ")\">" + gridLines + baselineLine + bars + hoverRects + "</svg>";
  }

  function toggleChartExpand(goodId) {
    if (!G.uiState.expandedMarketCharts) G.uiState.expandedMarketCharts = {};
    G.uiState.expandedMarketCharts[goodId] = !G.uiState.expandedMarketCharts[goodId];
    G.render();
  }

  function getGoodsByCategory() {
    const map = {};
    G.GOODS.forEach((g) => {
      const cat = g.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(g);
    });
    return G.GOODS_CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, goods: map[c] }));
  }

  function getBuildingsByCategory() {
    const map = {};
    Object.entries(G.BUILDING_TYPES).forEach(([type, def]) => {
      const cat = def.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push([type, def]);
    });
    return G.BUILDING_CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, entries: map[c] }));
  }

  function getMyBuildingsByCategory() {
    const map = {};
    Object.entries(G.state.buildings).forEach(([type, slot]) => {
      if (!slot || slot.count < 1) return;
      const def = G.BUILDING_TYPES[type];
      const cat = def?.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push({ type, slot, def });
    });
    return G.BUILDING_CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, buildings: map[c] }));
  }

  function switchTab(tabId) {
    G.uiState.activeTab = tabId;
    G.saveUiState();
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t.getAttribute("data-tab") === tabId);
      t.setAttribute("aria-selected", t.getAttribute("data-tab") === tabId);
    });
    document.querySelectorAll(".tab-panel").forEach((p) => {
      const id = p.id.replace("panel-", "");
      p.classList.toggle("active", id === tabId);
    });
  }

  function render() {
    document.getElementById("money").textContent = formatMoney(G.state.money);
    document.getElementById("day").textContent = "Year " + G.state.year + ", Day " + G.state.day;
    const xpNeeded = G.getXpForNextLevel(G.state.playerLevel);
    const pct = xpNeeded > 0 ? Math.min(100, (G.state.playerXp / xpNeeded) * 100) : 0;
    document.getElementById("player-level").textContent = G.state.playerLevel;
    document.getElementById("player-level-bar").style.width = pct + "%";
    document.getElementById("player-xp-text").textContent = G.state.playerXp + " / " + xpNeeded + " XP";
    G.updateZeitDisplay();

    const tabMarket = "market";
    const searchMarket = getSearchQuery(tabMarket);
    const marketOnlyWithStock = !!G.uiState.marketOnlyWithStock;
    const marketCategories = getGoodsByCategory()
      .map(({ category, goods }) => {
        let list = searchMarket ? goods.filter((g) => g.name.toLowerCase().includes(searchMarket)) : goods;
        if (marketOnlyWithStock) list = list.filter((g) => (G.state.goods[g.id]?.qty || 0) > 0);
        return { category, goods: list };
      })
      .filter(({ goods }) => goods.length > 0);
    const marketList = document.getElementById("market-list");
    marketList.innerHTML = marketCategories.map(({ category, goods }) => {
      const open = isCategoryOpen(category, tabMarket);
      return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabMarket + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span></div><div class=\"category-content\">" + goods.map((g) => {
        const expanded = !!(G.uiState.expandedMarketCharts && G.uiState.expandedMarketCharts[g.id]);
        return "<div class=\"market-row-wrapper " + (expanded ? "expanded" : "") + "\"><div class=\"market-row\"><button type=\"button\" class=\"market-row-name-btn\" onclick=\"window.game.toggleChartExpand('" + g.id + "')\" title=\"Price chart " + (expanded ? "collapse" : "expand") + "\"><span class=\"name\">" + escapeHtml(g.name) + "</span><span class=\"market-row-expand-icon\" aria-hidden=\"true\">" + (expanded ? "▼" : "▶") + "</span></button><span class=\"qty\">" + G.state.goods[g.id].qty + "</span><span class=\"market-chart-wrap\" title=\"Price history\">" + getPriceChartSvg(g.id) + "</span><span class=\"market-price-wrap\">" + getPriceChangeBadge(g.id) + "<span class=\"badge badge-price\">" + formatMoney(G.state.goods[g.id].price) + "</span></span><div class=\"market-row-divider\"></div><div class=\"actions\"><button class=\"btn btn-buy\" onclick=\"window.game.buyGood('" + g.id + "', 1)\" title=\"Cost: " + escapeHtml(formatMoney(G.state.goods[g.id].price)) + "\">+1</button><button class=\"btn btn-buy\" onclick=\"window.game.buyGood('" + g.id + "', 10)\" title=\"Cost: " + escapeHtml(formatMoney(G.state.goods[g.id].price * 10)) + "\">+10</button><button class=\"btn btn-buy\" onclick=\"window.game.buyGood('" + g.id + "', 100)\" title=\"Cost: " + escapeHtml(formatMoney(G.state.goods[g.id].price * 100)) + "\">+100</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 1)\"" + (G.state.goods[g.id].qty < 1 ? " disabled" : "") + ">−1</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 10)\"" + (G.state.goods[g.id].qty < 10 ? " disabled" : "") + ">−10</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 100)\"" + (G.state.goods[g.id].qty < 100 ? " disabled" : "") + ">−100</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 999999999)\"" + (G.state.goods[g.id].qty < 1 ? " disabled" : "") + ">All</button></div></div>" + (expanded ? "<div class=\"market-row-chart-expanded\"><div class=\"market-row-chart-expanded-inner\">" + getPriceChartExpandedSvg(g.id) + "</div></div>" : "") + "</div>";
      }).join("") + "</div></div>";
    }).join("");

    const tabShop = "buildings-shop";
    const searchShop = getSearchQuery(tabShop);
    const onlyUnlocked = !!G.uiState.buildingsShopOnlyUnlocked;
    const shopCategories = getBuildingsByCategory()
      .map(({ category, entries }) => {
        let list = searchShop ? entries.filter(([, def]) => def.name.toLowerCase().includes(searchShop)) : entries;
        if (onlyUnlocked) list = list.filter(([type]) => G.state.playerLevel >= G.getBuildingMinLevel(type));
        list.sort((a, b) => {
          const la = G.getBuildingMinLevel(a[0]), lb = G.getBuildingMinLevel(b[0]);
          if (la !== lb) return la - lb;
          return a[1].name.localeCompare(b[1].name);
        });
        return { category, entries: list };
      })
      .filter(({ entries }) => entries.length > 0);
    document.getElementById("buildings-shop").innerHTML = "<p class=\"income-timer-hint\">Buildings produce resources & new day every " + G.INCOME_INTERVAL_SEC + " sec.</p>" + shopCategories.map(({ category, entries }) => {
      const open = isCategoryOpen(category, tabShop);
      return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabShop + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span></div><div class=\"category-content\">" + entries.map(([type, def]) => {
        const minLevel = G.getBuildingMinLevel(type);
        const cost = G.getBuildingCost(type);
        const canBuy = G.state.playerLevel >= minLevel && G.state.money >= cost;
        const levelLocked = G.state.playerLevel < minLevel;
        return "<div class=\"shop-building " + (levelLocked ? "level-locked" : "") + "\"><div class=\"info\"><span class=\"info-name\">" + def.name + "</span> <span class=\"info-produces\">– produces " + def.baseOutput + " " + G.getProducedGoodName(type) + "/tick</span> <span class=\"badge badge-level-req\" title=\"From level " + minLevel + "\">Lv." + minLevel + "</span></div><span class=\"badge badge-price\">" + formatMoney(cost) + "</span><div class=\"shop-building-divider\"></div><button class=\"btn btn-build\" onclick=\"window.game.buyBuilding('" + type + "')\"" + (!canBuy ? " disabled" : "") + (levelLocked ? " title=\"Available from level " + minLevel + "\"" : "") + ">Buy</button></div>";
      }).join("") + "</div></div>";
    }).join("");

    const totalBuildingCount = Object.values(G.state.buildings).reduce((s, slot) => s + (slot?.count || 0), 0);
    const tabMy = "my-buildings";
    const searchMy = getSearchQuery(tabMy);
    const myBuildings = document.getElementById("my-buildings");
    if (totalBuildingCount === 0) {
      myBuildings.innerHTML = "<p style='color: var(--text-muted); font-size: 0.9rem;'>No buildings yet. Buy some in the \"Buy Buildings\" section.</p>";
    } else {
      const myBuildingsCategories = getMyBuildingsByCategory()
        .map(({ category, buildings }) => ({ category, buildings: searchMy ? buildings.filter(({ def }) => def.name.toLowerCase().includes(searchMy)) : buildings }))
        .filter(({ buildings }) => buildings.length > 0);
      myBuildings.innerHTML = myBuildingsCategories.map(({ category, buildings }) => {
        const open = isCategoryOpen(category, tabMy);
        return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabMy + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span></div><div class=\"category-content\">" + buildings.map(({ type, slot, def }) => {
          const output = G.getBuildingOutputTotal(type, slot);
          const resName = G.getProducedGoodName(type);
          const upgradeCost = G.getUpgradeCost(type);
          return "<div class=\"my-building\"><span class=\"name-cell\"><span class=\"badge badge-count\" title=\"Count\">×" + slot.count + "</span><span class=\"name\">" + def.name + "</span></span><span class=\"income\">+" + output + " " + resName + "/tick</span><span class=\"level\">Upgrade: " + formatMoney(upgradeCost) + "</span><span class=\"badge badge-level\" title=\"Level\">Lv." + slot.level + "</span><button class=\"btn btn-upgrade\" onclick=\"window.game.upgradeBuilding('" + type + "')\"" + (G.state.money < upgradeCost ? " disabled" : "") + ">Upgrade</button></div>";
        }).join("") + "</div></div>";
      }).join("");
    }

    const tabRes = "resources";
    const searchRes = getSearchQuery(tabRes);
    const onlyWithStock = !!G.uiState.resourcesOnlyWithStock;
    const resourcesCategories = getGoodsByCategory()
      .map(({ category, goods }) => {
        let list = searchRes ? goods.filter((g) => g.name.toLowerCase().includes(searchRes)) : goods;
        if (onlyWithStock) list = list.filter((g) => (G.state.goods[g.id]?.qty || 0) > 0);
        return { category, goods: list };
      })
      .filter(({ goods }) => goods.length > 0);
    document.getElementById("resources-list").innerHTML = resourcesCategories.map(({ category, goods }) => {
      const open = isCategoryOpen(category, tabRes);
      const categoryTotal = goods.reduce((sum, g) => sum + G.state.goods[g.id].qty * G.state.goods[g.id].price, 0);
      return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabRes + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span><span class=\"category-total\">" + formatMoney(categoryTotal) + "</span></div><div class=\"category-content\">" + goods.map((g) => {
        const qty = G.state.goods[g.id].qty, price = G.state.goods[g.id].price, value = qty * price;
        return "<div class=\"resource-row\"><span class=\"name\">" + g.name + "</span><span class=\"qty\">" + qty + "</span><span class=\"value\">" + formatMoney(value) + "</span></div>";
      }).join("") + "</div></div>";
    }).join("");

    const achievedSet = new Set(G.state.achievements || []);
    const achievementsList = document.getElementById("achievements-list");
    const tabAch = "achievements";
    if (achievementsList) {
      const unlockedList = G.ACHIEVEMENTS.filter((ach) => achievedSet.has(ach.id));
      const lockedList = G.ACHIEVEMENTS.filter((ach) => !achievedSet.has(ach.id));
      const renderAchievement = (ach, unlocked) => {
        const rewards = [ach.rewardMoney && formatMoney(ach.rewardMoney), ach.rewardXp && ach.rewardXp + " XP"].filter(Boolean).join(" + ");
        return "<div class=\"achievement-item " + (unlocked ? "unlocked" : "locked") + "\"><span class=\"achievement-icon\" aria-hidden=\"true\">" + (unlocked ? "✓" : "○") + "</span><div class=\"achievement-body\"><span class=\"achievement-name\">" + escapeHtml(ach.name) + "</span><span class=\"achievement-desc\">" + escapeHtml(ach.desc) + "</span><span class=\"achievement-reward\">Reward: " + rewards + "</span></div></div>";
      };
      const openCompleted = isCategoryOpen("Completed Achievements", tabAch);
      const openLocked = isCategoryOpen("Open Achievements", tabAch);
      achievementsList.innerHTML = "<div class=\"category-block " + (openCompleted ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"Completed Achievements\" data-tab=\"" + tabAch + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (openCompleted ? "▼" : "▶") + "</span><span class=\"category-title\">Completed Achievements</span><span class=\"category-count\">" + unlockedList.length + "</span></div><div class=\"category-content\">" + (unlockedList.length ? unlockedList.map((ach) => renderAchievement(ach, true)).join("") : "<p class=\"achievements-empty\">None yet.</p>") + "</div></div><div class=\"category-block " + (openLocked ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"Open Achievements\" data-tab=\"" + tabAch + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (openLocked ? "▼" : "▶") + "</span><span class=\"category-title\">Open Achievements</span><span class=\"category-count\">" + lockedList.length + "</span></div><div class=\"category-content\">" + (lockedList.length ? lockedList.map((ach) => renderAchievement(ach, false)).join("") : "<p class=\"achievements-empty\">All done!</p>") + "</div></div>";
    }

    document.querySelectorAll(".tab-search").forEach((input) => {
      const tabId = input.dataset.tab;
      if (G.uiState.searchQueries && G.uiState.searchQueries[tabId] !== undefined) input.value = G.uiState.searchQueries[tabId] || "";
    });
    const filterUnlockedEl = document.getElementById("filter-unlocked-buildings");
    if (filterUnlockedEl) filterUnlockedEl.checked = !!G.uiState.buildingsShopOnlyUnlocked;
    const filterResourcesStockEl = document.getElementById("filter-resources-stock");
    if (filterResourcesStockEl) filterResourcesStockEl.checked = !!G.uiState.resourcesOnlyWithStock;
    const filterMarketStockEl = document.getElementById("filter-market-stock");
    if (filterMarketStockEl) filterMarketStockEl.checked = !!G.uiState.marketOnlyWithStock;

    document.getElementById("log").innerHTML = G.state.log.map((e) => "<div class=\"log-entry " + e.type + "\"><span class=\"day\">T" + e.day + "</span>" + e.msg + "</div>").join("");
  }

  function init() {
    G.uiState = G.getUiState();
    switchTab(G.uiState.activeTab);
    const loaded = G.loadState();
    if (loaded) {
      G.state = loaded;
      G.addLog("Save game loaded.", "");
    } else {
      G.initGoods();
      G.addLog("Game started. Buildings produce every " + G.INCOME_INTERVAL_SEC + " sec. Sell resources on the market.", "");
    }
    G.startIncomeTimer();
    document.querySelector(".tabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (tab) switchTab(tab.getAttribute("data-tab"));
    });
    document.addEventListener("click", (e) => {
      const header = e.target.closest(".category-header");
      if (header && header.dataset.category && header.dataset.tab) toggleCategory(header.dataset.category, header.dataset.tab);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const header = document.activeElement;
      if (header && header.classList.contains("category-header") && header.dataset.category && header.dataset.tab) {
        e.preventDefault();
        toggleCategory(header.dataset.category, header.dataset.tab);
      }
    });
    document.querySelectorAll(".tab-search").forEach((input) => {
      input.addEventListener("input", function () { setSearchQuery(this.dataset.tab, this.value); });
    });
    const filterUnlockedCb = document.getElementById("filter-unlocked-buildings");
    if (filterUnlockedCb) filterUnlockedCb.addEventListener("change", function () {
      G.uiState.buildingsShopOnlyUnlocked = this.checked;
      G.saveUiState();
      G.render();
    });
    const filterResourcesStockCb = document.getElementById("filter-resources-stock");
    if (filterResourcesStockCb) filterResourcesStockCb.addEventListener("change", function () {
      G.uiState.resourcesOnlyWithStock = this.checked;
      G.saveUiState();
      G.render();
    });
    const filterMarketStockCb = document.getElementById("filter-market-stock");
    if (filterMarketStockCb) filterMarketStockCb.addEventListener("change", function () {
      G.uiState.marketOnlyWithStock = this.checked;
      G.saveUiState();
      G.render();
    });
    G.render();
    document.body.classList.remove("game-loading");
  }

  Object.assign(window.Game, {
    formatMoney,
    escapeHtml,
    getSearchQuery,
    setSearchQuery,
    isCategoryOpen,
    toggleCategory,
    getPriceChangeBadge,
    getPriceChartSvg,
    getPriceChartExpandedSvg,
    toggleChartExpand,
    getGoodsByCategory,
    getBuildingsByCategory,
    getMyBuildingsByCategory,
    switchTab,
    render,
    init,
  });
})();
