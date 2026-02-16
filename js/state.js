(function () {
  "use strict";
  window.Game = window.Game || {};
  const G = window.Game;

  function getTotalBuildingCount(s) {
    if (!s || !s.buildings) return 0;
    return Object.values(s.buildings).reduce((sum, slot) => sum + (slot && slot.count ? slot.count : 0), 0);
  }

  function getBuildingTypeCount(s) {
    if (!s || !s.buildings) return 0;
    return Object.keys(s.buildings).filter((type) => s.buildings[type] && s.buildings[type].count > 0).length;
  }

  function getTotalResourceValue(s) {
    if (!s || !s.goods) return 0;
    return Object.entries(s.goods).reduce((sum, [id, data]) => sum + (data?.qty || 0) * (data?.price || 0), 0);
  }

  let state = {
    money: 150000,
    day: 1,
    year: 1,
    playerLevel: 1,
    playerXp: 0,
    playerSkillPoints: 1,
    playerSkills: {},
    goods: {},
    buildings: {},
    log: [],
    achievements: [],
    stats: { soldOnce: false, boughtOnce: false, upgrades: 0 },
  };

  let uiState = {
    activeTab: "market",
    categoriesOpen: {},
    searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" },
    buildingsShopOnlyUnlocked: false,
    resourcesOnlyWithStock: false,
    marketOnlyWithStock: false,
    expandedMarketCharts: {},
    tabScrollPositions: {},
    marketSellCategoriesSelected: {},
  };

  function initGoods() {
    G.GOODS.forEach((g) => {
      state.goods[g.id] = { qty: 0, price: g.basePrice, priceHistory: [g.basePrice] };
    });
  }

  const SAVE_KEY = (G.STORAGE_KEY != null && G.STORAGE_KEY !== "") ? G.STORAGE_KEY : "wirtschaftssim_save";
  const UI_KEY = (G.UI_STORAGE_KEY != null && G.UI_STORAGE_KEY !== "") ? G.UI_STORAGE_KEY : "wirtschaftssim_ui";

  function saveState() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Speichern fehlgeschlagen:", e);
    }
  }

  function getUiState() {
    try {
      const raw = localStorage.getItem(UI_KEY);
      if (!raw) return { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" }, buildingsShopOnlyUnlocked: false, resourcesOnlyWithStock: false, marketOnlyWithStock: false, tutorialStep: 0, tutorialCompleted: false, tabScrollPositions: {}, marketSellCategoriesSelected: {} };
      const d = JSON.parse(raw);
      return {
        activeTab: d.activeTab || "market",
        categoriesOpen: typeof d.categoriesOpen === "object" && d.categoriesOpen !== null ? d.categoriesOpen : {},
        searchQueries: typeof d.searchQueries === "object" && d.searchQueries !== null ? d.searchQueries : { market: "", "buildings-shop": "", "my-buildings": "", resources: "" },
        buildingsShopOnlyUnlocked: d.buildingsShopOnlyUnlocked === true,
        resourcesOnlyWithStock: d.resourcesOnlyWithStock === true,
        marketOnlyWithStock: d.marketOnlyWithStock === true,
        tutorialStep: typeof d.tutorialStep === "number" ? d.tutorialStep : 0,
        tutorialCompleted: d.tutorialCompleted === true,
        tabScrollPositions: typeof d.tabScrollPositions === "object" && d.tabScrollPositions !== null ? d.tabScrollPositions : {},
        marketSellCategoriesSelected: typeof d.marketSellCategoriesSelected === "object" && d.marketSellCategoriesSelected !== null ? d.marketSellCategoriesSelected : {},
      };
    } catch (e) {
      return { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" }, buildingsShopOnlyUnlocked: false, resourcesOnlyWithStock: false, marketOnlyWithStock: false, tutorialStep: 0, tutorialCompleted: false, tabScrollPositions: {}, marketSellCategoriesSelected: {} };
    }
  }

  function saveUiState() {
    try {
      localStorage.setItem(UI_KEY, JSON.stringify(uiState));
    } catch (e) {}
  }

  function clearSaveData() {
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(UI_KEY);
    } catch (e) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data.money !== "number" || typeof data.day !== "number") return null;
      data.year = typeof data.year === "number" && data.year >= 1 ? data.year : 1;
      data.playerLevel = typeof data.playerLevel === "number" && data.playerLevel >= 1 ? data.playerLevel : 1;
      data.playerXp = typeof data.playerXp === "number" && data.playerXp >= 0 ? data.playerXp : 0;
      const maxLevel = (typeof G.MAX_PLAYER_LEVEL === "number" && G.MAX_PLAYER_LEVEL >= 1) ? G.MAX_PLAYER_LEVEL : 100;
      if (data.playerLevel > maxLevel) data.playerLevel = maxLevel;
      data.playerSkills = data.playerSkills && typeof data.playerSkills === "object" ? data.playerSkills : {};
      const totalSpent = Object.values(data.playerSkills).reduce((s, r) => s + (typeof r === "number" ? r : 0), 0);
      if (typeof data.playerSkillPoints !== "number" || data.playerSkillPoints < 0) {
        data.playerSkillPoints = Math.max(0, data.playerLevel - 1 - totalSpent);
      }
      data.goods = data.goods || {};
      G.GOODS.forEach((g) => {
        const cur = data.goods[g.id];
        const hist = Array.isArray(cur?.priceHistory) ? cur.priceHistory.slice(0, G.PRICE_HISTORY_DAYS) : [cur?.price ?? g.basePrice];
        data.goods[g.id] = {
          qty: typeof cur?.qty === "number" ? cur.qty : 0,
          price: typeof cur?.price === "number" ? cur.price : g.basePrice,
          previousPrice: typeof cur?.previousPrice === "number" ? cur.previousPrice : undefined,
          priceHistory: hist,
        };
      });
      const validTypes = Object.keys(G.BUILDING_TYPES);
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
      data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
      data.stats = data.stats && typeof data.stats === "object" ? { soldOnce: !!data.stats.soldOnce, boughtOnce: !!data.stats.boughtOnce, upgrades: Math.max(0, parseInt(data.stats.upgrades, 10) || 0) } : { soldOnce: false, boughtOnce: false, upgrades: 0 };
      return data;
    } catch (e) {
      return null;
    }
  }

  Object.defineProperty(window.Game, "state", {
    get() { return state; },
    set(v) { state = v; },
    configurable: true,
    enumerable: true,
  });
  Object.defineProperty(window.Game, "uiState", {
    get() { return uiState; },
    set(v) { uiState = v; },
    configurable: true,
    enumerable: true,
  });
  Object.assign(window.Game, {
    getTotalBuildingCount,
    getBuildingTypeCount,
    getTotalResourceValue,
    initGoods,
    loadState,
    saveState,
    getUiState,
    saveUiState,
    clearSaveData,
  });
})();
