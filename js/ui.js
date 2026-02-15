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

  const TUTORIAL_STEPS = [
    { tab: "market", target: ".header", title: "Welcome", text: "Here you see your money, the current date (year & day), and your level with XP. A new day runs every " + (G.INCOME_INTERVAL_SEC || 24) + " seconds." },
    { tab: "market", target: "#panel-market", title: "Market", text: "Buy and sell resources here. Prices change every day. Use +1, +10, +100 to buy and −1, −10, −100 or All to sell. Click \"View chart\" to see price history." },
    { tab: "buildings-shop", target: "#panel-buildings-shop", title: "Buy Buildings", text: "Buildings produce resources automatically every 24h. Real estate earns rent every 7 days. Buy buildings here to grow your income." },
    { tab: "my-buildings", target: "#panel-my-buildings", title: "My Buildings", text: "View your production buildings here. Upgrade them to increase output. Each upgrade costs money and raises the building's level." },
    { tab: "my-real-estate", target: "#panel-my-real-estate", title: "My Real Estate", text: "Properties you buy earn rent every 7 days. They cannot be upgraded. Total rent and the next collection day are shown here." },
    { tab: "resources", target: "#panel-resources", title: "My Resources", text: "See all your goods, stock, and total value. The +X/24h shows how much each resource is produced per cycle by your buildings." },
    { tab: "achievements", target: "#panel-achievements", title: "Achievements", text: "Unlock achievements by reaching goals. You earn money and XP as rewards. They are grouped by type." },
    { tab: "log", target: "#panel-log", title: "Log", text: "The log shows recent events: sales, purchases, building upgrades, rent collected, and level-ups." },
    { tab: "settings", target: "#panel-settings", title: "Settings", text: "Reset the game to start over, or replay this tutorial anytime. Your progress is saved automatically." },
  ];

  function startTutorial() {
    G.uiState.tutorialStep = 1;
    G.uiState.tutorialCompleted = false;
    G.saveUiState();
    G.switchTab(TUTORIAL_STEPS[0].tab);
    G.render();
    updateTutorialUI();
  }

  function endTutorial() {
    G.uiState.tutorialStep = 0;
    G.uiState.tutorialCompleted = true;
    G.saveUiState();
    const el = document.getElementById("tutorial-overlay");
    if (el) el.remove();
    document.querySelectorAll(".tutorial-highlight").forEach((n) => n.classList.remove("tutorial-highlight"));
    G.render();
  }

  function tutorialNext() {
    if (G.uiState.tutorialStep >= TUTORIAL_STEPS.length) {
      endTutorial();
      return;
    }
    G.uiState.tutorialStep += 1;
    G.saveUiState();
    const step = TUTORIAL_STEPS[G.uiState.tutorialStep - 1];
    G.switchTab(step.tab);
    G.render();
    updateTutorialUI();
  }

  function tutorialPrev() {
    if (G.uiState.tutorialStep <= 1) return;
    G.uiState.tutorialStep -= 1;
    G.saveUiState();
    const step = TUTORIAL_STEPS[G.uiState.tutorialStep - 1];
    G.switchTab(step.tab);
    G.render();
    updateTutorialUI();
  }

  function updateTutorialUI() {
    if (!G.uiState.tutorialStep || G.uiState.tutorialStep < 1) return;
    document.querySelectorAll(".tutorial-highlight").forEach((n) => n.classList.remove("tutorial-highlight"));
    const step = TUTORIAL_STEPS[G.uiState.tutorialStep - 1];
    if (!step) return;
    G.switchTab(step.tab);
    const targetEl = document.querySelector(step.target);
    if (targetEl) {
      targetEl.classList.add("tutorial-highlight");
      targetEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    let overlay = document.getElementById("tutorial-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "tutorial-overlay";
      overlay.className = "tutorial-overlay";
      document.body.appendChild(overlay);
    }
    const stepNum = G.uiState.tutorialStep;
    const total = TUTORIAL_STEPS.length;
    const isFirst = stepNum === 1;
    const isLast = stepNum === total;
    overlay.innerHTML = "<div class=\"tutorial-backdrop\"></div><div class=\"tutorial-card\"><div class=\"tutorial-card-header\"><span class=\"tutorial-step-num\">" + stepNum + " / " + total + "</span><h3 class=\"tutorial-title\">" + escapeHtml(step.title) + "</h3></div><p class=\"tutorial-text\">" + escapeHtml(step.text) + "</p><div class=\"tutorial-actions\"><button type=\"button\" class=\"btn tutorial-skip\" id=\"tutorial-skip-btn\">Skip</button><div class=\"tutorial-nav\"><button type=\"button\" class=\"btn\" id=\"tutorial-prev-btn\"" + (isFirst ? " disabled" : "") + ">Back</button><button type=\"button\" class=\"btn btn-build\" id=\"tutorial-next-btn\">" + (isLast ? "Finish" : "Next") + "</button></div></div></div>";
    document.getElementById("tutorial-skip-btn").onclick = endTutorial;
    document.getElementById("tutorial-prev-btn").onclick = tutorialPrev;
    document.getElementById("tutorial-next-btn").onclick = tutorialNext;
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
      if (cat === "Real Estate") return;
      if (!map[cat]) map[cat] = [];
      map[cat].push({ type, slot, def });
    });
    return G.BUILDING_CATEGORY_ORDER.filter((c) => map[c] && c !== "Real Estate").map((c) => ({ category: c, buildings: map[c] }));
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
    const playerName = (typeof G.PLAYER_NAME_STORAGE_KEY === "string" && G.PLAYER_NAME_STORAGE_KEY) ? (localStorage.getItem(G.PLAYER_NAME_STORAGE_KEY) || "") : "";
    const levelLabelEl = document.getElementById("player-level-label");
    if (levelLabelEl) levelLabelEl.textContent = (playerName && playerName.trim()) ? playerName.trim() : "Level";
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
        return "<div class=\"market-row-wrapper " + (expanded ? "expanded" : "") + "\"><div class=\"market-row\"><span class=\"market-row-name\"><span class=\"name\">" + escapeHtml(g.name) + "</span></span><span class=\"qty\">" + G.state.goods[g.id].qty + "</span><span class=\"market-chart-wrap\" title=\"Price history\">" + getPriceChartSvg(g.id) + "</span><button type=\"button\" class=\"btn btn-chart\" onclick=\"window.game.toggleChartExpand('" + g.id + "')\" title=\"Price chart " + (expanded ? "collapse" : "expand") + "\">View chart</button><span class=\"market-price-wrap\">" + getPriceChangeBadge(g.id) + "<span class=\"badge badge-price\">" + formatMoney(G.state.goods[g.id].price) + "</span></span><div class=\"market-row-divider\"></div><div class=\"actions\"><button class=\"btn btn-buy\" onclick=\"window.game.buyGood('" + g.id + "', 1)\" title=\"Cost: " + escapeHtml(formatMoney(G.state.goods[g.id].price)) + "\">+1</button><button class=\"btn btn-buy\" onclick=\"window.game.buyGood('" + g.id + "', 10)\" title=\"Cost: " + escapeHtml(formatMoney(G.state.goods[g.id].price * 10)) + "\">+10</button><button class=\"btn btn-buy\" onclick=\"window.game.buyGood('" + g.id + "', 100)\" title=\"Cost: " + escapeHtml(formatMoney(G.state.goods[g.id].price * 100)) + "\">+100</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 1)\"" + (G.state.goods[g.id].qty < 1 ? " disabled" : "") + ">−1</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 10)\"" + (G.state.goods[g.id].qty < 10 ? " disabled" : "") + ">−10</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 100)\"" + (G.state.goods[g.id].qty < 100 ? " disabled" : "") + ">−100</button><button class=\"btn btn-sell\" onclick=\"window.game.sellGood('" + g.id + "', 999999999)\"" + (G.state.goods[g.id].qty < 1 ? " disabled" : "") + ">All</button></div></div>" + (expanded ? "<div class=\"market-row-chart-expanded\"><div class=\"market-row-chart-expanded-inner\">" + getPriceChartExpandedSvg(g.id) + "</div></div>" : "") + "</div>";
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
    document.getElementById("buildings-shop").innerHTML = "<p class=\"income-timer-hint\">Buildings produce resources & new day every " + G.INCOME_INTERVAL_SEC + " sec. Real estate rent is collected every 7 days.</p>" + shopCategories.map(({ category, entries }) => {
      const open = isCategoryOpen(category, tabShop);
      return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabShop + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span></div><div class=\"category-content\">" + entries.map(([type, def]) => {
        const minLevel = G.getBuildingMinLevel(type);
        const cost = G.getBuildingCost(type);
        const canBuy = G.state.playerLevel >= minLevel && G.state.money >= cost;
        const levelLocked = G.state.playerLevel < minLevel;
        const isRealEstate = !!def.rent;
        const ownedCount = (G.state.buildings[type] && G.state.buildings[type].count) || 0;
        const ownedBadge = "<span class=\"badge badge-owned\" title=\"Owned\">×" + ownedCount + "</span> ";
        const infoLine = isRealEstate ? ("– Rent " + formatMoney(def.rent) + " / 7 days") : ("– produces " + def.baseOutput + " " + G.getProducedGoodName(type) + " per day");
        const levelBadge = " <span class=\"badge badge-level-req\" title=\"From level " + minLevel + "\">Lv." + minLevel + "</span>";
        return "<div class=\"shop-building " + (levelLocked ? "level-locked" : "") + "\"><div class=\"info\">" + ownedBadge + "<span class=\"info-name\">" + def.name + "</span> <span class=\"info-produces\">" + infoLine + "</span>" + levelBadge + "</div><span class=\"badge badge-price\">" + formatMoney(cost) + "</span><div class=\"shop-building-divider\"></div><button class=\"btn btn-build\" onclick=\"window.game.buyBuilding('" + type + "')\"" + (!canBuy ? " disabled" : "") + (levelLocked ? " title=\"Available from level " + minLevel + "\"" : "") + ">Buy</button></div>";
      }).join("") + "</div></div>";
    }).join("");

    const totalBuildingCount = Object.values(G.state.buildings).reduce((s, slot) => s + (slot?.count || 0), 0);
    const tabMy = "my-buildings";
    const searchMy = getSearchQuery(tabMy);
    const myBuildings = document.getElementById("my-buildings");
    const myBuildingsCategories = getMyBuildingsByCategory()
      .map(({ category, buildings }) => ({ category, buildings: searchMy ? buildings.filter(({ def }) => def.name.toLowerCase().includes(searchMy)) : buildings }))
      .filter(({ buildings }) => buildings.length > 0);
    if (totalBuildingCount === 0) {
      myBuildings.innerHTML = "<p class=\"panel-info-text\">No buildings yet. Buy some in the \"Buy Buildings\" section.</p>";
    } else if (myBuildingsCategories.length === 0) {
      myBuildings.innerHTML = "<p class=\"panel-info-text\">No production buildings. Your real estate is listed under My Real Estate.</p>";
    } else {
      myBuildings.innerHTML = myBuildingsCategories.map(({ category, buildings }) => {
        const open = isCategoryOpen(category, tabMy);
        return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabMy + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span></div><div class=\"category-content\">" + buildings.map(({ type, slot, def }) => {
          const output = G.getBuildingOutputTotal(type, slot);
          const resName = G.getProducedGoodName(type);
          const upgradeCost = G.getUpgradeCost(type);
          const maxLevel = (typeof G.MAX_BUILDING_LEVEL === "number" && G.MAX_BUILDING_LEVEL >= 1) ? G.MAX_BUILDING_LEVEL : 99;
          const atMax = (slot.level || 0) >= maxLevel;
          const upgradeLabel = atMax ? "Max" : "Upgrade: " + formatMoney(upgradeCost);
          const upgradeDisabled = atMax || G.state.money < upgradeCost;
          const tier = Math.min(10, Math.floor((slot.level || 1) / 10) + 1);
          const tierClass = "badge-tier-" + tier;
          return "<div class=\"my-building\"><span class=\"name-cell\"><span class=\"badge badge-count\" title=\"Count\">×" + slot.count + "</span><span class=\"name\">" + def.name + "</span></span><span class=\"income\">+" + output + " " + resName + " per day</span><span class=\"level\">" + upgradeLabel + "</span><span class=\"badge badge-level " + tierClass + "\" title=\"Level\">Lv." + slot.level + "</span><button class=\"btn btn-upgrade\" onclick=\"window.game.upgradeBuilding('" + type + "')\"" + (upgradeDisabled ? " disabled" : "") + (atMax ? " title=\"Maximum level reached\"" : "") + ">Upgrade</button></div>";
        }).join("") + "</div></div>";
      }).join("");
    }

    const tabRealEstate = "my-real-estate";
    const realEstateList = document.getElementById("my-real-estate-list");
    if (realEstateList) {
      const realEstateEntries = [];
      Object.entries(G.state.buildings).forEach(([type, slot]) => {
        if (!slot || slot.count < 1) return;
        const def = G.BUILDING_TYPES[type];
        if (!def || !def.rent) return;
        realEstateEntries.push({ type, slot, def });
      });
      realEstateEntries.sort((a, b) => a.def.name.localeCompare(b.def.name));
      const daysUntilRent = G.state.day % 7 === 0 ? 7 : (7 - (G.state.day % 7));
      if (realEstateEntries.length === 0) {
        realEstateList.innerHTML = "<p class=\"real-estate-empty\">No real estate yet. Buy properties in the &quot;Buy Buildings&quot; tab under Real Estate.</p>";
      } else {
        const totalRent = realEstateEntries.reduce((sum, { type, slot }) => sum + G.getBuildingRentTotal(type, slot), 0);
        realEstateList.innerHTML = "<p class=\"real-estate-summary\">Total rent: " + formatMoney(totalRent) + " every 7 days. Next rent in " + daysUntilRent + " day" + (daysUntilRent === 1 ? "" : "s") + ".</p>" + realEstateEntries.map(({ type, slot, def }) => {
          const rentTotal = G.getBuildingRentTotal(type, slot);
          return "<div class=\"real-estate-row\"><span class=\"name-cell\"><span class=\"badge badge-count\" title=\"Count\">×" + slot.count + "</span><span class=\"name\">" + escapeHtml(def.name) + "</span></span><span class=\"rent\">" + formatMoney(rentTotal) + " / 7 days</span></div>";
        }).join("");
      }
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
        let prodPerTick = 0;
        Object.entries(G.state.buildings || {}).forEach(([type, slot]) => {
          if (!slot || slot.count < 1) return;
          const def = G.BUILDING_TYPES[type];
          if (def && def.produces === g.id) prodPerTick += G.getBuildingOutputTotal(type, slot);
        });
        const prodLabel = prodPerTick > 0 ? " <span class=\"resource-production\" title=\"Production per day\">+" + prodPerTick + " per day</span>" : "";
        return "<div class=\"resource-row\"><span class=\"name\">" + escapeHtml(g.name) + prodLabel + "</span><span class=\"qty\">" + qty + "</span><span class=\"value\">" + formatMoney(value) + "</span></div>";
      }).join("") + "</div></div>";
    }).join("");

    const achievedSet = new Set(G.state.achievements || []);
    const achievementsList = document.getElementById("achievements-list");
    const tabAch = "achievements";
    const ACH_CAT_ORDER = ["First Steps", "Money", "Buildings", "Building Types", "Upgrades", "Level", "Days", "Years", "Resources", "Crypto", "Real Estate", "Collection", "Hoarder", "Other"];
    function getAchievementCategory(ach) {
      const id = ach.id;
      if (id === "erster_verkauf" || id === "erster_kauf" || id === "erstes_gebaeude" || id === "erstes_upgrade") return "First Steps";
      if (["kleinvieh", "sparer", "fuenftausend", "wohlhabend", "reich", "reicher_mann", "hunderttausend", "fuenfhunderttausend", "millionaer", "zwei_millionen", "fuenf_millionen", "zehn_millionen"].indexOf(id) >= 0 || id.indexOf("geld_") === 0) return "Money";
      if (id.indexOf("gebaeude_") === 0 || ["baumeister", "zehn_gebaeude", "tycoon", "imperium", "magnat"].indexOf(id) >= 0) return "Buildings";
      if (id.indexOf("vielfalt_") === 0) return "Building Types";
      if (id.indexOf("upgrade_") === 0) return "Upgrades";
      if (id.indexOf("level_") === 0) return "Level";
      if (["woche", "monat", "hundert_tage", "volles_jahr"].indexOf(id) >= 0 || id.indexOf("tag_") === 0) return "Days";
      if (id === "ein_jahr" || id.indexOf("jahr_") === 0) return "Years";
      if (id.indexOf("lagerwert_") === 0) return "Resources";
      if (id.indexOf("bitcoin_") === 0 || id.indexOf("ethereum_") === 0 || id.indexOf("crypto_") === 0) return "Crypto";
      if (id.indexOf("real_estate_") === 0 || id.indexOf("rent_") === 0) return "Real Estate";
      if (id.indexOf("diversified_") === 0) return "Collection";
      if (id.indexOf("hoarder_") === 0) return "Hoarder";
      return "Other";
    }
    if (achievementsList) {
      const byCategory = {};
      G.ACHIEVEMENTS.forEach((ach) => {
        const cat = getAchievementCategory(ach);
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(ach);
      });
      const renderAchievement = (ach, unlocked) => {
        const rewards = [ach.rewardMoney && formatMoney(ach.rewardMoney), ach.rewardXp && ach.rewardXp + " XP"].filter(Boolean).join(" + ");
        return "<div class=\"achievement-item " + (unlocked ? "unlocked" : "locked") + "\"><span class=\"achievement-icon\" aria-hidden=\"true\">" + (unlocked ? "✓" : "○") + "</span><div class=\"achievement-body\"><span class=\"achievement-name\">" + escapeHtml(ach.name) + "</span><span class=\"achievement-desc\">" + escapeHtml(ach.desc) + "</span><span class=\"achievement-reward\">Reward: " + rewards + "</span></div></div>";
      };
      achievementsList.innerHTML = ACH_CAT_ORDER.filter((cat) => byCategory[cat] && byCategory[cat].length > 0).map((category) => {
        const list = byCategory[category];
        const unlockedInCat = list.filter((ach) => achievedSet.has(ach.id));
        const open = isCategoryOpen(category, tabAch);
        const content = list.map((ach) => renderAchievement(ach, achievedSet.has(ach.id))).join("");
        return "<div class=\"category-block " + (open ? "" : "collapsed") + "\"><div class=\"category-header\" data-category=\"" + escapeHtml(category) + "\" data-tab=\"" + tabAch + "\" role=\"button\" tabindex=\"0\"><span class=\"category-chevron\">" + (open ? "▼" : "▶") + "</span><span class=\"category-title\">" + escapeHtml(category) + "</span><span class=\"category-count\">" + unlockedInCat.length + " / " + list.length + "</span></div><div class=\"category-content\">" + content + "</div></div>";
      }).join("");
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

    if (G.uiState.tutorialStep > 0) updateTutorialUI();
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

    const tutorialBtn = document.getElementById("tutorial-btn");
    if (tutorialBtn) tutorialBtn.addEventListener("click", startTutorial);
    const replayTutorialBtn = document.getElementById("replay-tutorial-btn");
    if (replayTutorialBtn) replayTutorialBtn.addEventListener("click", startTutorial);
    const saveNameBtn = document.getElementById("save-name-btn");
    const playerNameInput = document.getElementById("player-name-input");
    if (saveNameBtn && playerNameInput && G.PLAYER_NAME_STORAGE_KEY) {
      const saved = localStorage.getItem(G.PLAYER_NAME_STORAGE_KEY) || "";
      if (saved) playerNameInput.value = saved;
      saveNameBtn.addEventListener("click", function () {
        const name = String(playerNameInput.value || "").trim();
        localStorage.setItem(G.PLAYER_NAME_STORAGE_KEY, name);
        const labelEl = document.getElementById("player-level-label");
        if (labelEl) labelEl.textContent = name || "Level";
      });
    }
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
    startTutorial,
  });
})();
