(function () {
  "use strict";

  const GOODS = [
    { id: "weizen", name: "Getreide", basePrice: 10, category: "Nahrung" },
    { id: "fisch", name: "Fisch", basePrice: 22, category: "Nahrung" },
    { id: "honig", name: "Honig", basePrice: 38, category: "Nahrung" },
    { id: "wein", name: "Wein", basePrice: 75, category: "Nahrung" },
    { id: "tabak", name: "Tabak", basePrice: 55, category: "Nahrung" },
    { id: "kaffee", name: "Kaffee", basePrice: 62, category: "Nahrung" },
    { id: "zucker", name: "Zucker", basePrice: 20, category: "Nahrung" },
    { id: "milch", name: "Milch", basePrice: 12, category: "Nahrung" },
    { id: "fleisch", name: "Fleisch", basePrice: 48, category: "Nahrung" },
    { id: "tee", name: "Tee", basePrice: 44, category: "Nahrung" },
    { id: "reis", name: "Reis", basePrice: 16, category: "Nahrung" },
    { id: "mais", name: "Mais", basePrice: 11, category: "Nahrung" },
    { id: "eier", name: "Eier", basePrice: 14, category: "Nahrung" },
    { id: "obst", name: "Obst", basePrice: 28, category: "Nahrung" },
    { id: "kakao", name: "Kakao", basePrice: 72, category: "Nahrung" },
    { id: "erz", name: "Erz", basePrice: 50, category: "Metalle & Erze" },
    { id: "gold", name: "Gold", basePrice: 120, category: "Metalle & Erze" },
    { id: "kupfer", name: "Kupfer", basePrice: 45, category: "Metalle & Erze" },
    { id: "silber", name: "Silber", basePrice: 95, category: "Metalle & Erze" },
    { id: "eisen", name: "Eisen", basePrice: 58, category: "Metalle & Erze" },
    { id: "zinn", name: "Zinn", basePrice: 52, category: "Metalle & Erze" },
    { id: "blei", name: "Blei", basePrice: 40, category: "Metalle & Erze" },
    { id: "nickel", name: "Nickel", basePrice: 68, category: "Metalle & Erze" },
    { id: "aluminium", name: "Aluminium", basePrice: 78, category: "Metalle & Erze" },
    { id: "holz", name: "Holz", basePrice: 25, category: "Baumaterial" },
    { id: "stein", name: "Stein", basePrice: 35, category: "Baumaterial" },
    { id: "lehm", name: "Lehm", basePrice: 12, category: "Baumaterial" },
    { id: "sand", name: "Sand", basePrice: 8, category: "Baumaterial" },
    { id: "kies", name: "Kies", basePrice: 10, category: "Baumaterial" },
    { id: "kohle", name: "Kohle", basePrice: 28, category: "Energie" },
    { id: "oel", name: "Öl", basePrice: 80, category: "Energie" },
    { id: "gas", name: "Gas", basePrice: 65, category: "Energie" },
    { id: "baumwolle", name: "Baumwolle", basePrice: 18, category: "Textilien" },
    { id: "wolle", name: "Wolle", basePrice: 42, category: "Textilien" },
    { id: "leder", name: "Leder", basePrice: 65, category: "Textilien" },
    { id: "seide", name: "Seide", basePrice: 140, category: "Textilien" },
    { id: "hanf", name: "Hanf", basePrice: 30, category: "Textilien" },
    { id: "jute", name: "Jute", basePrice: 24, category: "Textilien" },
    { id: "flachs", name: "Flachs", basePrice: 36, category: "Textilien" },
    { id: "gewuerze", name: "Gewürze", basePrice: 110, category: "Gewürze & Luxus" },
    { id: "salz", name: "Salz", basePrice: 15, category: "Gewürze & Luxus" },
    { id: "edelsteine", name: "Edelsteine", basePrice: 250, category: "Gewürze & Luxus" },
    { id: "perlen", name: "Perlen", basePrice: 180, category: "Gewürze & Luxus" },
    { id: "bernstein", name: "Bernstein", basePrice: 165, category: "Gewürze & Luxus" },
  ];

  const GOODS_CATEGORY_ORDER = ["Nahrung", "Metalle & Erze", "Baumaterial", "Energie", "Textilien", "Gewürze & Luxus"];

  const INCOME_INTERVAL_SEC = 24;
  const STORAGE_KEY = "wirtschaftssim_save";
  const UI_STORAGE_KEY = "wirtschaftssim_ui";

  let uiState = { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" } };

  const BUILDING_TYPES = {
    farm: { name: "Farm", baseCost: 500, produces: "weizen", baseOutput: 3, upgradeCostBase: 200, upgradeOutputBonus: 2, category: "Landwirtschaft" },
    plantage: { name: "Plantage", baseCost: 600, produces: "baumwolle", baseOutput: 3, upgradeCostBase: 250, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    schafzucht: { name: "Schafzucht", baseCost: 700, produces: "wolle", baseOutput: 2, upgradeCostBase: 300, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    weinberg: { name: "Weinberg", baseCost: 1300, produces: "wein", baseOutput: 1, upgradeCostBase: 520, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    imkerei: { name: "Imkerei", baseCost: 480, produces: "honig", baseOutput: 2, upgradeCostBase: 190, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    gewuerzplantage: { name: "Gewürzplantage", baseCost: 1600, produces: "gewuerze", baseOutput: 1, upgradeCostBase: 650, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    rinderzucht: { name: "Rinderzucht", baseCost: 900, produces: "leder", baseOutput: 1, upgradeCostBase: 380, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    sawmill: { name: "Sägewerk", baseCost: 800, produces: "holz", baseOutput: 2, upgradeCostBase: 350, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    fischerei: { name: "Fischerei", baseCost: 550, produces: "fisch", baseOutput: 3, upgradeCostBase: 220, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    mine: { name: "Mine", baseCost: 1200, produces: "erz", baseOutput: 1, upgradeCostBase: 500, upgradeOutputBonus: 1, category: "Bergbau" },
    steinbruch: { name: "Steinbruch", baseCost: 950, produces: "stein", baseOutput: 2, upgradeCostBase: 380, upgradeOutputBonus: 1, category: "Bergbau" },
    goldmine: { name: "Goldmine", baseCost: 2500, produces: "gold", baseOutput: 1, upgradeCostBase: 900, upgradeOutputBonus: 1, category: "Bergbau" },
    kohlestollen: { name: "Kohlestollen", baseCost: 1100, produces: "kohle", baseOutput: 2, upgradeCostBase: 400, upgradeOutputBonus: 1, category: "Bergbau" },
    silbermine: { name: "Silbermine", baseCost: 2200, produces: "silber", baseOutput: 1, upgradeCostBase: 850, upgradeOutputBonus: 1, category: "Bergbau" },
    kupfermine: { name: "Kupfermine", baseCost: 1400, produces: "kupfer", baseOutput: 2, upgradeCostBase: 480, upgradeOutputBonus: 1, category: "Bergbau" },
    eisenhuette: { name: "Eisenhütte", baseCost: 1650, produces: "eisen", baseOutput: 1, upgradeCostBase: 550, upgradeOutputBonus: 1, category: "Bergbau" },
    oelfeld: { name: "Ölfeld", baseCost: 1800, produces: "oel", baseOutput: 1, upgradeCostBase: 600, upgradeOutputBonus: 1, category: "Industrie" },
    saline: { name: "Saline", baseCost: 420, produces: "salz", baseOutput: 4, upgradeCostBase: 160, upgradeOutputBonus: 1, category: "Industrie" },
    tabakplantage: { name: "Tabakplantage", baseCost: 1100, produces: "tabak", baseOutput: 2, upgradeCostBase: 420, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    kaffeeplantage: { name: "Kaffeeplantage", baseCost: 1400, produces: "kaffee", baseOutput: 1, upgradeCostBase: 500, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    zuckerplantage: { name: "Zuckerplantage", baseCost: 750, produces: "zucker", baseOutput: 3, upgradeCostBase: 280, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    molkerei: { name: "Molkerei", baseCost: 580, produces: "milch", baseOutput: 4, upgradeCostBase: 200, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    schlachthof: { name: "Schlachthof", baseCost: 950, produces: "fleisch", baseOutput: 2, upgradeCostBase: 360, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    zinnmine: { name: "Zinnmine", baseCost: 1350, produces: "zinn", baseOutput: 2, upgradeCostBase: 480, upgradeOutputBonus: 1, category: "Bergbau" },
    bleimine: { name: "Bleimine", baseCost: 1150, produces: "blei", baseOutput: 2, upgradeCostBase: 400, upgradeOutputBonus: 1, category: "Bergbau" },
    ziegelei: { name: "Ziegelei", baseCost: 520, produces: "lehm", baseOutput: 4, upgradeCostBase: 180, upgradeOutputBonus: 1, category: "Bergbau" },
    sandgrube: { name: "Sandgrube", baseCost: 380, produces: "sand", baseOutput: 5, upgradeCostBase: 140, upgradeOutputBonus: 1, category: "Bergbau" },
    edelsteinmine: { name: "Edelsteinmine", baseCost: 3200, produces: "edelsteine", baseOutput: 1, upgradeCostBase: 1200, upgradeOutputBonus: 1, category: "Bergbau" },
    gaswerk: { name: "Gaswerk", baseCost: 2100, produces: "gas", baseOutput: 1, upgradeCostBase: 700, upgradeOutputBonus: 1, category: "Industrie" },
    seidenfarm: { name: "Seidenfarm", baseCost: 1850, produces: "seide", baseOutput: 1, upgradeCostBase: 680, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    hanffeld: { name: "Hanffeld", baseCost: 640, produces: "hanf", baseOutput: 3, upgradeCostBase: 240, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    perlenzucht: { name: "Perlenzucht", baseCost: 2800, produces: "perlen", baseOutput: 1, upgradeCostBase: 950, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    teeplantage: { name: "Teeplantage", baseCost: 1250, produces: "tee", baseOutput: 2, upgradeCostBase: 460, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    reisfeld: { name: "Reisfeld", baseCost: 620, produces: "reis", baseOutput: 4, upgradeCostBase: 220, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    maisfeld: { name: "Maisfeld", baseCost: 460, produces: "mais", baseOutput: 4, upgradeCostBase: 170, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    gefluegelhof: { name: "Geflügelhof", baseCost: 720, produces: "eier", baseOutput: 3, upgradeCostBase: 260, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    obstanlage: { name: "Obstanlage", baseCost: 880, produces: "obst", baseOutput: 2, upgradeCostBase: 320, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    kakaoplantage: { name: "Kakaoplantage", baseCost: 1550, produces: "kakao", baseOutput: 1, upgradeCostBase: 580, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    nickelmine: { name: "Nickelmine", baseCost: 1720, produces: "nickel", baseOutput: 1, upgradeCostBase: 620, upgradeOutputBonus: 1, category: "Bergbau" },
    aluminiumhuette: { name: "Aluminiumhütte", baseCost: 1980, produces: "aluminium", baseOutput: 1, upgradeCostBase: 720, upgradeOutputBonus: 1, category: "Bergbau" },
    kiesgrube: { name: "Kiesgrube", baseCost: 440, produces: "kies", baseOutput: 5, upgradeCostBase: 165, upgradeOutputBonus: 1, category: "Bergbau" },
    juteanbau: { name: "Juteanbau", baseCost: 560, produces: "jute", baseOutput: 3, upgradeCostBase: 210, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    flachsfeld: { name: "Flachsfeld", baseCost: 690, produces: "flachs", baseOutput: 2, upgradeCostBase: 270, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    bernsteinsammler: { name: "Bernstein-Sammler", baseCost: 2400, produces: "bernstein", baseOutput: 1, upgradeCostBase: 880, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
  };

  const BUILDING_CATEGORY_ORDER = ["Landwirtschaft", "Forst & Fischerei", "Bergbau", "Industrie"];

  let state = {
    money: 1000,
    day: 1,
    year: 1,
    goods: {},
    buildings: {},
    log: [],
  };

  function initGoods() {
    GOODS.forEach((g) => {
      state.goods[g.id] = { qty: 0, price: g.basePrice };
    });
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Speichern fehlgeschlagen:", e);
    }
  }

  function getUiState() {
    try {
      const raw = localStorage.getItem(UI_STORAGE_KEY);
      if (!raw) return { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" } };
      const d = JSON.parse(raw);
      return {
        activeTab: d.activeTab || "market",
        categoriesOpen: typeof d.categoriesOpen === "object" && d.categoriesOpen !== null ? d.categoriesOpen : {},
        searchQueries: typeof d.searchQueries === "object" && d.searchQueries !== null ? d.searchQueries : { market: "", "buildings-shop": "", "my-buildings": "", resources: "" },
      };
    } catch (e) {
      return { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" } };
    }
  }

  function saveUiState() {
    try {
      localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(uiState));
    } catch (e) {}
  }

  function getSearchQuery(tabId) {
    return (uiState.searchQueries && uiState.searchQueries[tabId]) ? String(uiState.searchQueries[tabId]).trim().toLowerCase() : "";
  }

  function setSearchQuery(tabId, value) {
    if (!uiState.searchQueries) uiState.searchQueries = { market: "", "buildings-shop": "", "my-buildings": "", resources: "" };
    uiState.searchQueries[tabId] = value;
    render();
  }

  function isCategoryOpen(cat, tabId) {
    const tab = uiState.categoriesOpen[tabId];
    if (!tab || typeof tab !== "object") return true;
    return tab[cat] !== false;
  }

  function toggleCategory(cat, tabId) {
    if (!uiState.categoriesOpen[tabId]) uiState.categoriesOpen[tabId] = {};
    uiState.categoriesOpen[tabId][cat] = !isCategoryOpen(cat, tabId);
    saveUiState();
    render();
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data.money !== "number" || typeof data.day !== "number") return null;
      data.year = typeof data.year === "number" && data.year >= 1 ? data.year : 1;
      data.goods = data.goods || {};
      GOODS.forEach((g) => {
        const cur = data.goods[g.id];
        data.goods[g.id] = {
          qty: typeof cur?.qty === "number" ? cur.qty : 0,
          price: typeof cur?.price === "number" ? cur.price : g.basePrice,
        };
      });
      const validTypes = Object.keys(BUILDING_TYPES);
      if (Array.isArray(data.buildings)) {
        const stacked = {};
        data.buildings.forEach((b) => {
          if (!validTypes.includes(b?.type)) return;
          const type = b.type;
          const level = Math.max(1, b.level || 1);
          if (!stacked[type]) stacked[type] = { count: 0, level: 1 };
          stacked[type].count += 1;
          stacked[type].level = Math.max(stacked[type].level, level);
        });
        data.buildings = stacked;
      } else if (typeof data.buildings !== "object" || data.buildings === null) {
        data.buildings = {};
      } else {
        const cleaned = {};
        Object.entries(data.buildings).forEach(([type, v]) => {
          if (!validTypes.includes(type) || !v) return;
          const count = Math.max(0, parseInt(v.count, 10) || 0);
          const level = Math.max(1, parseInt(v.level, 10) || 1);
          if (count > 0) cleaned[type] = { count, level };
        });
        data.buildings = cleaned;
      }
      data.log = Array.isArray(data.log) ? data.log.slice(0, 50) : [];
      return data;
    } catch (e) {
      return null;
    }
  }

  function formatMoney(n) {
    return new Intl.NumberFormat("de-DE", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n) + " $";
  }

  function addLog(msg, type = "") {
    state.log.unshift({
      day: state.day,
      msg,
      type,
    });
    if (state.log.length > 50) state.log.pop();
  }

  function randomWalk(price, rate = 0.1) {
    const change = (Math.random() - 0.48) * rate * price;
    return Math.max(1, Math.round(price + change));
  }

  function advanceDay() {
    state.day += 1;
    if (state.day > 365) {
      state.day = 1;
      state.year += 1;
      addLog(`Neues Jahr! Jahr ${state.year} beginnt.`, "income");
    }
    GOODS.forEach((g) => {
      state.goods[g.id].price = randomWalk(state.goods[g.id].price);
    });

    const produced = {};
    Object.entries(state.buildings).forEach(([type, slot]) => {
      if (!slot || slot.count < 1) return;
      const def = BUILDING_TYPES[type];
      const perUnit = def.baseOutput + (slot.level - 1) * def.upgradeOutputBonus;
      const amount = perUnit * slot.count;
      state.goods[def.produces].qty += amount;
      produced[def.produces] = (produced[def.produces] || 0) + amount;
    });

    const producedLines = Object.entries(produced)
      .map(([id, qty]) => `${qty} ${GOODS.find((g) => g.id === id).name}`)
      .join(", ");
    if (producedLines) {
      addLog(`+${producedLines} (Gebäude)`, "income");
    }
    addLog(`Tag ${state.day}. Marktpreise aktualisiert.`, "");

    saveState();
    render();
  }

  function startIncomeTimer() {
    setInterval(() => {
      advanceDay();
    }, INCOME_INTERVAL_SEC * 1000);
  }

  function buyGood(goodId, amount) {
    const g = state.goods[goodId];
    const cost = g.price * amount;
    if (cost > state.money || amount <= 0) return;
    state.money -= cost;
    g.qty += amount;
    addLog(
      `${amount} ${GOODS.find((x) => x.id === goodId).name} gekauft für ${formatMoney(cost)}`,
      "spend"
    );
    saveState();
    render();
  }

  function sellGood(goodId, amount) {
    const g = state.goods[goodId];
    const sellQty = Math.min(amount, g.qty);
    if (sellQty <= 0) return;
    const revenue = g.price * sellQty;
    state.money += revenue;
    g.qty -= sellQty;
    const goodName = GOODS.find((x) => x.id === goodId).name;
    addLog(`${sellQty} ${goodName} verkauft für ${formatMoney(revenue)}`, "sell");
    saveState();
    render();
  }

  function getBuildingCost(type) {
    const def = BUILDING_TYPES[type];
    const count = state.buildings[type]?.count || 0;
    return def.baseCost + count * 150;
  }

  function buyBuilding(type) {
    const cost = getBuildingCost(type);
    if (state.money < cost) return;
    state.money -= cost;
    if (state.buildings[type]) {
      state.buildings[type].count += 1;
    } else {
      state.buildings[type] = { count: 1, level: 1 };
    }
    const name = BUILDING_TYPES[type].name;
    const slot = state.buildings[type];
    addLog(`${name}${slot.count > 1 ? " x" + slot.count : ""} gekauft für ${formatMoney(cost)}`, "spend");
    saveState();
    render();
  }

  function getUpgradeCost(type) {
    const slot = state.buildings[type];
    if (!slot) return Infinity;
    const def = BUILDING_TYPES[type];
    return def.upgradeCostBase * slot.level;
  }

  function upgradeBuilding(type) {
    const slot = state.buildings[type];
    if (!slot) return;
    const cost = getUpgradeCost(type);
    if (state.money < cost) return;
    state.money -= cost;
    slot.level += 1;
    const name = BUILDING_TYPES[type].name;
    addLog(
      `${name} (alle ${slot.count}) auf Stufe ${slot.level} verbessert für ${formatMoney(cost)}`,
      "spend"
    );
    saveState();
    render();
  }

  function getBuildingOutputTotal(type, slot) {
    const def = BUILDING_TYPES[type];
    const perUnit = def.baseOutput + (slot.level - 1) * def.upgradeOutputBonus;
    return perUnit * slot.count;
  }

  function getProducedGoodName(type) {
    const goodId = BUILDING_TYPES[type].produces;
    return GOODS.find((g) => g.id === goodId).name;
  }

  function getGoodsByCategory() {
    const map = {};
    GOODS.forEach((g) => {
      const cat = g.category || "Sonstiges";
      if (!map[cat]) map[cat] = [];
      map[cat].push(g);
    });
    return GOODS_CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, goods: map[c] }));
  }

  function getBuildingsByCategory() {
    const map = {};
    Object.entries(BUILDING_TYPES).forEach(([type, def]) => {
      const cat = def.category || "Sonstiges";
      if (!map[cat]) map[cat] = [];
      map[cat].push([type, def]);
    });
    return BUILDING_CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, entries: map[c] }));
  }

  function getMyBuildingsByCategory() {
    const map = {};
    Object.entries(state.buildings).forEach(([type, slot]) => {
      if (!slot || slot.count < 1) return;
      const def = BUILDING_TYPES[type];
      const cat = def?.category || "Sonstiges";
      if (!map[cat]) map[cat] = [];
      map[cat].push({ type, slot, def });
    });
    return BUILDING_CATEGORY_ORDER.filter((c) => map[c]).map((c) => ({ category: c, buildings: map[c] }));
  }

  function switchTab(tabId) {
    uiState.activeTab = tabId;
    saveUiState();
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
    document.getElementById("money").textContent = formatMoney(state.money);
    document.getElementById("day").textContent = `Jahr ${state.year}, Tag ${state.day}`;

    const tabMarket = "market";
    const searchMarket = getSearchQuery(tabMarket);
    const marketCategories = getGoodsByCategory()
      .map(({ category, goods }) => ({ category, goods: searchMarket ? goods.filter((g) => g.name.toLowerCase().includes(searchMarket)) : goods }))
      .filter(({ goods }) => goods.length > 0);
    const marketList = document.getElementById("market-list");
    marketList.innerHTML = marketCategories.map(
      ({ category, goods }) => {
        const open = isCategoryOpen(category, tabMarket);
        return `
      <div class="category-block ${open ? "" : "collapsed"}">
        <div class="category-header" data-category="${escapeHtml(category)}" data-tab="${tabMarket}" role="button" tabindex="0">
          <span class="category-chevron">${open ? "▼" : "▶"}</span>
          <span class="category-title">${escapeHtml(category)}</span>
        </div>
        <div class="category-content">
        ${goods.map((g) => `
        <div class="market-row">
          <span class="name">${g.name}</span>
          <span class="qty">${state.goods[g.id].qty}</span>
          <span class="badge badge-price">${formatMoney(state.goods[g.id].price)}</span>
          <div class="market-row-divider"></div>
          <div class="actions">
            <button class="btn btn-buy" onclick="window.game.buyGood('${g.id}', 1)">+1</button>
            <button class="btn btn-buy" onclick="window.game.buyGood('${g.id}', 10)">+10</button>
            <button class="btn btn-buy" onclick="window.game.buyGood('${g.id}', 100)">+100</button>
            <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 1)" ${state.goods[g.id].qty < 1 ? "disabled" : ""}>−1</button>
            <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 10)" ${state.goods[g.id].qty < 10 ? "disabled" : ""}>−10</button>
            <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 100)" ${state.goods[g.id].qty < 100 ? "disabled" : ""}>−100</button>
            <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 999999999)" ${state.goods[g.id].qty < 1 ? "disabled" : ""}>Alles</button>
          </div>
        </div>
        `).join("")}
        </div>
      </div>
    `;
      }
    ).join("");

    const tabShop = "buildings-shop";
    const searchShop = getSearchQuery(tabShop);
    const shopCategories = getBuildingsByCategory()
      .map(({ category, entries }) => ({ category, entries: searchShop ? entries.filter(([, def]) => def.name.toLowerCase().includes(searchShop)) : entries }))
      .filter(({ entries }) => entries.length > 0);
    const shop = document.getElementById("buildings-shop");
    shop.innerHTML = `
      <p class="income-timer-hint">Gebäude produzieren Ressourcen & neuer Tag alle ${INCOME_INTERVAL_SEC} Sek.</p>
      ${shopCategories.map(({ category, entries }) => {
        const open = isCategoryOpen(category, tabShop);
        return `
        <div class="category-block ${open ? "" : "collapsed"}">
          <div class="category-header" data-category="${escapeHtml(category)}" data-tab="${tabShop}" role="button" tabindex="0">
            <span class="category-chevron">${open ? "▼" : "▶"}</span>
            <span class="category-title">${escapeHtml(category)}</span>
          </div>
          <div class="category-content">
          ${entries.map(([type, def]) => `
          <div class="shop-building">
            <div class="info"><span class="info-name">${def.name}</span> <span class="info-produces">– produziert ${def.baseOutput} ${getProducedGoodName(type)}/Tick</span></div>
            <span class="badge badge-price">${formatMoney(getBuildingCost(type))}</span>
            <div class="shop-building-divider"></div>
            <button class="btn btn-build" onclick="window.game.buyBuilding('${type}')" ${state.money < getBuildingCost(type) ? "disabled" : ""}>Kaufen</button>
          </div>
          `).join("")}
          </div>
        </div>
      `;
      }).join("")}
    `;

    const myBuildings = document.getElementById("my-buildings");
    const totalBuildingCount = Object.values(state.buildings).reduce((s, slot) => s + (slot?.count || 0), 0);
    const tabMy = "my-buildings";
    const searchMy = getSearchQuery(tabMy);
    if (totalBuildingCount === 0) {
      myBuildings.innerHTML = "<p style='color: var(--text-muted); font-size: 0.9rem;'>Noch keine Gebäude. Kaufe welche im Bereich „Gebäude kaufen“.</p>";
    } else {
      const myBuildingsCategories = getMyBuildingsByCategory()
        .map(({ category, buildings }) => ({ category, buildings: searchMy ? buildings.filter(({ def }) => def.name.toLowerCase().includes(searchMy)) : buildings }))
        .filter(({ buildings }) => buildings.length > 0);
      myBuildings.innerHTML = myBuildingsCategories.map(({ category, buildings }) => {
        const open = isCategoryOpen(category, tabMy);
        return `
        <div class="category-block ${open ? "" : "collapsed"}">
          <div class="category-header" data-category="${escapeHtml(category)}" data-tab="${tabMy}" role="button" tabindex="0">
            <span class="category-chevron">${open ? "▼" : "▶"}</span>
            <span class="category-title">${escapeHtml(category)}</span>
          </div>
          <div class="category-content">
          ${buildings.map(({ type, slot, def }) => {
            const output = getBuildingOutputTotal(type, slot);
            const resName = getProducedGoodName(type);
            const upgradeCost = getUpgradeCost(type);
            return `
            <div class="my-building">
              <span class="name-cell">
                <span class="badge badge-count" title="Anzahl">×${slot.count}</span>
                <span class="name">${def.name}</span>
              </span>
              <span class="income">+${output} ${resName}/Tick</span>
              <span class="level">Upgrade: ${formatMoney(upgradeCost)}</span>
              <span class="badge badge-level" title="Stufe">Lv.${slot.level}</span>
              <button class="btn btn-upgrade" onclick="window.game.upgradeBuilding('${type}')" ${state.money < upgradeCost ? "disabled" : ""}>Upgrade</button>
            </div>
            `;
          }).join("")}
          </div>
        </div>
      `;
      }).join("");
    }

    const resourcesList = document.getElementById("resources-list");
    const tabRes = "resources";
    const searchRes = getSearchQuery(tabRes);
    const resourcesCategories = getGoodsByCategory()
      .map(({ category, goods }) => ({ category, goods: searchRes ? goods.filter((g) => g.name.toLowerCase().includes(searchRes)) : goods }))
      .filter(({ goods }) => goods.length > 0);
    resourcesList.innerHTML = resourcesCategories.map(
      ({ category, goods }) => {
        const open = isCategoryOpen(category, tabRes);
        const categoryTotal = goods.reduce((sum, g) => sum + state.goods[g.id].qty * state.goods[g.id].price, 0);
        return `
        <div class="category-block ${open ? "" : "collapsed"}">
          <div class="category-header" data-category="${escapeHtml(category)}" data-tab="${tabRes}" role="button" tabindex="0">
            <span class="category-chevron">${open ? "▼" : "▶"}</span>
            <span class="category-title">${escapeHtml(category)}</span>
            <span class="category-total">${formatMoney(categoryTotal)}</span>
          </div>
          <div class="category-content">
          ${goods.map((g) => {
            const qty = state.goods[g.id].qty;
            const price = state.goods[g.id].price;
            const value = qty * price;
            return `
          <div class="resource-row">
            <span class="name">${g.name}</span>
            <span class="qty">${qty}</span>
            <span class="value">${formatMoney(value)}</span>
          </div>
          `;
          }).join("")}
          </div>
        </div>
      `;
      }
    ).join("");

    document.querySelectorAll(".tab-search").forEach((input) => {
      const tabId = input.dataset.tab;
      if (uiState.searchQueries && uiState.searchQueries[tabId] !== undefined) input.value = uiState.searchQueries[tabId] || "";
    });

    const logEl = document.getElementById("log");
    logEl.innerHTML = state.log
      .map(
        (e) =>
          `<div class="log-entry ${e.type}"><span class="day">T${e.day}</span>${e.msg}</div>`
      )
      .join("");
  }

  function init() {
    uiState = getUiState();
    const loaded = loadState();
    if (loaded) {
      state = loaded;
      addLog("Spielstand geladen.", "");
    } else {
      initGoods();
      addLog("Spiel gestartet. Gebäude produzieren alle " + INCOME_INTERVAL_SEC + " Sek. Ressourcen – verkaufe sie am Markt.", "");
    }
    startIncomeTimer();
    switchTab(uiState.activeTab);
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
      input.addEventListener("input", function () {
        setSearchQuery(this.dataset.tab, this.value);
      });
    });
    render();
  }

  window.game = {
    advanceDay,
    buyGood,
    sellGood,
    buyBuilding,
    upgradeBuilding,
    switchTab,
    toggleCategory,
  };

  init();
})();
