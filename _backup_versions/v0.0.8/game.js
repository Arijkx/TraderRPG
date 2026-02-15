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
    { id: "kartoffeln", name: "Kartoffeln", basePrice: 12, category: "Nahrung" },
    { id: "gerste", name: "Gerste", basePrice: 9, category: "Nahrung" },
    { id: "gemuese", name: "Gemüse", basePrice: 18, category: "Nahrung" },
    { id: "nuesse", name: "Nüsse", basePrice: 35, category: "Nahrung" },
    { id: "erz", name: "Erz", basePrice: 50, category: "Metalle & Erze" },
    { id: "gold", name: "Gold", basePrice: 120, category: "Metalle & Erze" },
    { id: "kupfer", name: "Kupfer", basePrice: 45, category: "Metalle & Erze" },
    { id: "silber", name: "Silber", basePrice: 95, category: "Metalle & Erze" },
    { id: "eisen", name: "Eisen", basePrice: 58, category: "Metalle & Erze" },
    { id: "zinn", name: "Zinn", basePrice: 52, category: "Metalle & Erze" },
    { id: "blei", name: "Blei", basePrice: 40, category: "Metalle & Erze" },
    { id: "nickel", name: "Nickel", basePrice: 68, category: "Metalle & Erze" },
    { id: "aluminium", name: "Aluminium", basePrice: 78, category: "Metalle & Erze" },
    { id: "zink", name: "Zink", basePrice: 48, category: "Metalle & Erze" },
    { id: "titan", name: "Titan", basePrice: 135, category: "Metalle & Erze" },
    { id: "platin", name: "Platin", basePrice: 200, category: "Metalle & Erze" },
    { id: "chrom", name: "Chrom", basePrice: 72, category: "Metalle & Erze" },
    { id: "holz", name: "Holz", basePrice: 25, category: "Baumaterial" },
    { id: "stein", name: "Stein", basePrice: 35, category: "Baumaterial" },
    { id: "lehm", name: "Lehm", basePrice: 12, category: "Baumaterial" },
    { id: "sand", name: "Sand", basePrice: 8, category: "Baumaterial" },
    { id: "kies", name: "Kies", basePrice: 10, category: "Baumaterial" },
    { id: "zement", name: "Zement", basePrice: 42, category: "Baumaterial" },
    { id: "marmor", name: "Marmor", basePrice: 88, category: "Baumaterial" },
    { id: "kohle", name: "Kohle", basePrice: 28, category: "Energie" },
    { id: "oel", name: "Öl", basePrice: 80, category: "Energie" },
    { id: "gas", name: "Gas", basePrice: 65, category: "Energie" },
    { id: "uran", name: "Uran", basePrice: 150, category: "Energie" },
    { id: "baumwolle", name: "Baumwolle", basePrice: 18, category: "Textilien" },
    { id: "wolle", name: "Wolle", basePrice: 42, category: "Textilien" },
    { id: "leder", name: "Leder", basePrice: 65, category: "Textilien" },
    { id: "seide", name: "Seide", basePrice: 140, category: "Textilien" },
    { id: "hanf", name: "Hanf", basePrice: 30, category: "Textilien" },
    { id: "jute", name: "Jute", basePrice: 24, category: "Textilien" },
    { id: "flachs", name: "Flachs", basePrice: 36, category: "Textilien" },
    { id: "kaschmir", name: "Kaschmir", basePrice: 185, category: "Textilien" },
    { id: "synthetik", name: "Synthetikfaser", basePrice: 35, category: "Textilien" },
    { id: "gewuerze", name: "Gewürze", basePrice: 110, category: "Gewürze & Luxus" },
    { id: "salz", name: "Salz", basePrice: 15, category: "Gewürze & Luxus" },
    { id: "edelsteine", name: "Edelsteine", basePrice: 250, category: "Gewürze & Luxus" },
    { id: "perlen", name: "Perlen", basePrice: 180, category: "Gewürze & Luxus" },
    { id: "bernstein", name: "Bernstein", basePrice: 165, category: "Gewürze & Luxus" },
    { id: "safran", name: "Safran", basePrice: 320, category: "Gewürze & Luxus" },
    { id: "truffel", name: "Trüffel", basePrice: 280, category: "Gewürze & Luxus" },
    { id: "muscheln", name: "Muscheln", basePrice: 45, category: "Gewürze & Luxus" },
    { id: "bitcoin", name: "Bitcoin", basePrice: 25000, category: "Währungen" },
  ];

  const GOODS_CATEGORY_ORDER = ["Nahrung", "Metalle & Erze", "Baumaterial", "Energie", "Textilien", "Gewürze & Luxus", "Währungen"];

  const INCOME_INTERVAL_SEC = 24;
  const XP_PER_DAY = 5;
  let lastTickTime = 0;
  const STORAGE_KEY = "wirtschaftssim_save";
  const UI_STORAGE_KEY = "wirtschaftssim_ui";

  function getXpForNextLevel(level) {
    return 100 * level;
  }

  let uiState = { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" }, buildingsShopOnlyUnlocked: false, resourcesOnlyWithStock: false, marketOnlyWithStock: false, expandedMarketCharts: {} };

  const BUILDING_TYPES = {
    farm: { name: "Farm", baseCost: 15000, produces: "weizen", baseOutput: 3, upgradeCostBase: 6000, upgradeOutputBonus: 2, category: "Landwirtschaft" },
    plantage: { name: "Plantage", baseCost: 18000, produces: "baumwolle", baseOutput: 3, upgradeCostBase: 7500, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    schafzucht: { name: "Schafzucht", baseCost: 21000, produces: "wolle", baseOutput: 2, upgradeCostBase: 9000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    weinberg: { name: "Weinberg", baseCost: 40000, produces: "wein", baseOutput: 1, upgradeCostBase: 16000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    imkerei: { name: "Imkerei", baseCost: 14500, produces: "honig", baseOutput: 2, upgradeCostBase: 5800, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    gewuerzplantage: { name: "Gewürzplantage", baseCost: 48000, produces: "gewuerze", baseOutput: 1, upgradeCostBase: 19500, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    rinderzucht: { name: "Rinderzucht", baseCost: 28000, produces: "leder", baseOutput: 1, upgradeCostBase: 11500, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    sawmill: { name: "Sägewerk", baseCost: 24000, produces: "holz", baseOutput: 2, upgradeCostBase: 10500, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    fischerei: { name: "Fischerei", baseCost: 16500, produces: "fisch", baseOutput: 3, upgradeCostBase: 6600, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    mine: { name: "Mine", baseCost: 36000, produces: "erz", baseOutput: 1, upgradeCostBase: 15000, upgradeOutputBonus: 1, category: "Bergbau" },
    steinbruch: { name: "Steinbruch", baseCost: 29000, produces: "stein", baseOutput: 2, upgradeCostBase: 11500, upgradeOutputBonus: 1, category: "Bergbau" },
    goldmine: { name: "Goldmine", baseCost: 75000, produces: "gold", baseOutput: 1, upgradeCostBase: 27000, upgradeOutputBonus: 1, category: "Bergbau" },
    kohlestollen: { name: "Kohlestollen", baseCost: 33000, produces: "kohle", baseOutput: 2, upgradeCostBase: 12000, upgradeOutputBonus: 1, category: "Bergbau" },
    silbermine: { name: "Silbermine", baseCost: 66000, produces: "silber", baseOutput: 1, upgradeCostBase: 25500, upgradeOutputBonus: 1, category: "Bergbau" },
    kupfermine: { name: "Kupfermine", baseCost: 42000, produces: "kupfer", baseOutput: 2, upgradeCostBase: 14500, upgradeOutputBonus: 1, category: "Bergbau" },
    eisenhuette: { name: "Eisenhütte", baseCost: 50000, produces: "eisen", baseOutput: 1, upgradeCostBase: 16500, upgradeOutputBonus: 1, category: "Bergbau" },
    oelfeld: { name: "Ölfeld", baseCost: 55000, produces: "oel", baseOutput: 1, upgradeCostBase: 18000, upgradeOutputBonus: 1, category: "Industrie" },
    saline: { name: "Saline", baseCost: 12500, produces: "salz", baseOutput: 4, upgradeCostBase: 4800, upgradeOutputBonus: 1, category: "Industrie" },
    tabakplantage: { name: "Tabakplantage", baseCost: 33000, produces: "tabak", baseOutput: 2, upgradeCostBase: 12600, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    kaffeeplantage: { name: "Kaffeeplantage", baseCost: 42000, produces: "kaffee", baseOutput: 1, upgradeCostBase: 15000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    zuckerplantage: { name: "Zuckerplantage", baseCost: 22500, produces: "zucker", baseOutput: 3, upgradeCostBase: 8400, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    molkerei: { name: "Molkerei", baseCost: 17500, produces: "milch", baseOutput: 4, upgradeCostBase: 6000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    schlachthof: { name: "Schlachthof", baseCost: 29000, produces: "fleisch", baseOutput: 2, upgradeCostBase: 10800, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    zinnmine: { name: "Zinnmine", baseCost: 40500, produces: "zinn", baseOutput: 2, upgradeCostBase: 14500, upgradeOutputBonus: 1, category: "Bergbau" },
    bleimine: { name: "Bleimine", baseCost: 34500, produces: "blei", baseOutput: 2, upgradeCostBase: 12000, upgradeOutputBonus: 1, category: "Bergbau" },
    ziegelei: { name: "Ziegelei", baseCost: 15500, produces: "lehm", baseOutput: 4, upgradeCostBase: 5400, upgradeOutputBonus: 1, category: "Bergbau" },
    sandgrube: { name: "Sandgrube", baseCost: 11500, produces: "sand", baseOutput: 5, upgradeCostBase: 4200, upgradeOutputBonus: 1, category: "Bergbau" },
    edelsteinmine: { name: "Edelsteinmine", baseCost: 95000, produces: "edelsteine", baseOutput: 1, upgradeCostBase: 36000, upgradeOutputBonus: 1, category: "Bergbau" },
    gaswerk: { name: "Gaswerk", baseCost: 63000, produces: "gas", baseOutput: 1, upgradeCostBase: 21000, upgradeOutputBonus: 1, category: "Industrie" },
    seidenfarm: { name: "Seidenfarm", baseCost: 56000, produces: "seide", baseOutput: 1, upgradeCostBase: 20500, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    hanffeld: { name: "Hanffeld", baseCost: 19200, produces: "hanf", baseOutput: 3, upgradeCostBase: 7200, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    perlenzucht: { name: "Perlenzucht", baseCost: 85000, produces: "perlen", baseOutput: 1, upgradeCostBase: 28500, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    teeplantage: { name: "Teeplantage", baseCost: 37500, produces: "tee", baseOutput: 2, upgradeCostBase: 13800, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    reisfeld: { name: "Reisfeld", baseCost: 18500, produces: "reis", baseOutput: 4, upgradeCostBase: 6600, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    maisfeld: { name: "Maisfeld", baseCost: 14000, produces: "mais", baseOutput: 4, upgradeCostBase: 5100, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    gefluegelhof: { name: "Geflügelhof", baseCost: 21500, produces: "eier", baseOutput: 3, upgradeCostBase: 7800, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    obstanlage: { name: "Obstanlage", baseCost: 26500, produces: "obst", baseOutput: 2, upgradeCostBase: 9600, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    kakaoplantage: { name: "Kakaoplantage", baseCost: 46500, produces: "kakao", baseOutput: 1, upgradeCostBase: 17400, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    nickelmine: { name: "Nickelmine", baseCost: 51500, produces: "nickel", baseOutput: 1, upgradeCostBase: 18600, upgradeOutputBonus: 1, category: "Bergbau" },
    aluminiumhuette: { name: "Aluminiumhütte", baseCost: 59500, produces: "aluminium", baseOutput: 1, upgradeCostBase: 21600, upgradeOutputBonus: 1, category: "Bergbau" },
    kiesgrube: { name: "Kiesgrube", baseCost: 13200, produces: "kies", baseOutput: 5, upgradeCostBase: 4950, upgradeOutputBonus: 1, category: "Bergbau" },
    juteanbau: { name: "Juteanbau", baseCost: 16800, produces: "jute", baseOutput: 3, upgradeCostBase: 6300, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    flachsfeld: { name: "Flachsfeld", baseCost: 20500, produces: "flachs", baseOutput: 2, upgradeCostBase: 8100, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    bernsteinsammler: { name: "Bernstein-Sammler", baseCost: 72000, produces: "bernstein", baseOutput: 1, upgradeCostBase: 26500, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    kartoffelacker: { name: "Kartoffelacker", baseCost: 14000, produces: "kartoffeln", baseOutput: 4, upgradeCostBase: 5200, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    gerstenfeld: { name: "Gerstenfeld", baseCost: 12000, produces: "gerste", baseOutput: 4, upgradeCostBase: 4500, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    gemueseanbau: { name: "Gemüseanbau", baseCost: 16000, produces: "gemuese", baseOutput: 3, upgradeCostBase: 6000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    nussgarten: { name: "Nussgarten", baseCost: 32000, produces: "nuesse", baseOutput: 2, upgradeCostBase: 12000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    zinkmine: { name: "Zinkmine", baseCost: 38000, produces: "zink", baseOutput: 2, upgradeCostBase: 14000, upgradeOutputBonus: 1, category: "Bergbau" },
    titanhuette: { name: "Titanhütte", baseCost: 68000, produces: "titan", baseOutput: 1, upgradeCostBase: 25000, upgradeOutputBonus: 1, category: "Bergbau" },
    platinmine: { name: "Platinmine", baseCost: 88000, produces: "platin", baseOutput: 1, upgradeCostBase: 32000, upgradeOutputBonus: 1, category: "Bergbau" },
    chrommine: { name: "Chrommine", baseCost: 45000, produces: "chrom", baseOutput: 1, upgradeCostBase: 17000, upgradeOutputBonus: 1, category: "Bergbau" },
    zementwerk: { name: "Zementwerk", baseCost: 35000, produces: "zement", baseOutput: 2, upgradeCostBase: 13000, upgradeOutputBonus: 1, category: "Industrie" },
    marmorsteinbruch: { name: "Marmorsteinbruch", baseCost: 52000, produces: "marmor", baseOutput: 1, upgradeCostBase: 19000, upgradeOutputBonus: 1, category: "Bergbau" },
    uranmine: { name: "Uranmine", baseCost: 78000, produces: "uran", baseOutput: 1, upgradeCostBase: 29000, upgradeOutputBonus: 1, category: "Bergbau" },
    kaschmirzucht: { name: "Kaschmirzucht", baseCost: 58000, produces: "kaschmir", baseOutput: 1, upgradeCostBase: 22000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    chemiefaserwerk: { name: "Chemiefaserwerk", baseCost: 38000, produces: "synthetik", baseOutput: 2, upgradeCostBase: 14000, upgradeOutputBonus: 1, category: "Industrie" },
    safrananbau: { name: "Safrananbau", baseCost: 92000, produces: "safran", baseOutput: 1, upgradeCostBase: 35000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    truffelsuche: { name: "Trüffelsuche", baseCost: 82000, produces: "truffel", baseOutput: 1, upgradeCostBase: 31000, upgradeOutputBonus: 1, category: "Landwirtschaft" },
    muschelfarm: { name: "Muschelfarm", baseCost: 24000, produces: "muscheln", baseOutput: 2, upgradeCostBase: 9000, upgradeOutputBonus: 1, category: "Forst & Fischerei" },
    miningfarm: { name: "Miningfarm", baseCost: 1285000, produces: "bitcoin", baseOutput: 1, upgradeCostBase: 100000, upgradeOutputBonus: 1, category: "Industrie", minLevel: 10 },
  };

  const BUILDING_CATEGORY_ORDER = ["Landwirtschaft", "Forst & Fischerei", "Bergbau", "Industrie"];

  const ACHIEVEMENTS = [
    { id: "erster_verkauf", name: "Erstes Geschäft", desc: "Verkaufe zum ersten Mal eine Ressource.", rewardMoney: 50, rewardXp: 10, check: (s) => (s.stats && s.stats.soldOnce) === true },
    { id: "erster_kauf", name: "Erster Einkauf", desc: "Kaufe zum ersten Mal eine Ressource.", rewardMoney: 25, rewardXp: 5, check: (s) => (s.stats && s.stats.boughtOnce) === true },
    { id: "kleinvieh", name: "Kleinvieh", desc: "Besitze 500 $.", rewardMoney: 30, rewardXp: 8, check: (s) => s.money >= 500 },
    { id: "sparer", name: "Sparer", desc: "Besitze 2.000 $.", rewardMoney: 80, rewardXp: 20, check: (s) => s.money >= 2000 },
    { id: "fuenftausend", name: "5.000 $", desc: "Besitze 5.000 $.", rewardMoney: 120, rewardXp: 30, check: (s) => s.money >= 5000 },
    { id: "wohlhabend", name: "Wohlhabend", desc: "Besitze 10.000 $.", rewardMoney: 250, rewardXp: 60, check: (s) => s.money >= 10000 },
    { id: "reich", name: "25.000 $", desc: "Besitze 25.000 $.", rewardMoney: 350, rewardXp: 80, check: (s) => s.money >= 25000 },
    { id: "reicher_mann", name: "Reicher Mann", desc: "Besitze 50.000 $.", rewardMoney: 500, rewardXp: 120, check: (s) => s.money >= 50000 },
    { id: "hunderttausend", name: "100.000 $", desc: "Besitze 100.000 $.", rewardMoney: 800, rewardXp: 180, check: (s) => s.money >= 100000 },
    { id: "fuenfhunderttausend", name: "500.000 $", desc: "Besitze 500.000 $.", rewardMoney: 1200, rewardXp: 250, check: (s) => s.money >= 500000 },
    { id: "millionaer", name: "Millionär", desc: "Besitze 1.000.000 $.", rewardMoney: 2000, rewardXp: 300, check: (s) => s.money >= 1000000 },
    { id: "zwei_millionen", name: "2 Millionen $", desc: "Besitze 2.000.000 $.", rewardMoney: 2500, rewardXp: 350, check: (s) => s.money >= 2000000 },
    { id: "fuenf_millionen", name: "5 Millionen $", desc: "Besitze 5.000.000 $.", rewardMoney: 3500, rewardXp: 450, check: (s) => s.money >= 5000000 },
    { id: "zehn_millionen", name: "10 Millionen $", desc: "Besitze 10.000.000 $.", rewardMoney: 5000, rewardXp: 600, check: (s) => s.money >= 10000000 },
    { id: "erstes_gebaeude", name: "Erstes Gebäude", desc: "Kaufe dein erstes Gebäude.", rewardMoney: 100, rewardXp: 25, check: (s) => getTotalBuildingCount(s) >= 1 },
    { id: "baumeister", name: "Baumeister", desc: "Besitze 5 Gebäude (gesamt).", rewardMoney: 150, rewardXp: 35, check: (s) => getTotalBuildingCount(s) >= 5 },
    { id: "zehn_gebaeude", name: "10 Gebäude", desc: "Besitze 10 Gebäude.", rewardMoney: 250, rewardXp: 55, check: (s) => getTotalBuildingCount(s) >= 10 },
    { id: "tycoon", name: "Tycoon", desc: "Besitze 20 Gebäude.", rewardMoney: 500, rewardXp: 100, check: (s) => getTotalBuildingCount(s) >= 20 },
    { id: "imperium", name: "Imperium", desc: "Besitze 35 Gebäude.", rewardMoney: 750, rewardXp: 150, check: (s) => getTotalBuildingCount(s) >= 35 },
    { id: "magnat", name: "Magnat", desc: "Besitze 50 Gebäude.", rewardMoney: 1000, rewardXp: 200, check: (s) => getTotalBuildingCount(s) >= 50 },
    { id: "gebaeude_75", name: "75 Gebäude", desc: "Besitze 75 Gebäude.", rewardMoney: 1500, rewardXp: 280, check: (s) => getTotalBuildingCount(s) >= 75 },
    { id: "gebaeude_100", name: "100 Gebäude", desc: "Besitze 100 Gebäude.", rewardMoney: 2500, rewardXp: 400, check: (s) => getTotalBuildingCount(s) >= 100 },
    { id: "vielfalt_3", name: "Vielfalt", desc: "Besitze 3 verschiedene Gebäudetypen.", rewardMoney: 80, rewardXp: 25, check: (s) => getBuildingTypeCount(s) >= 3 },
    { id: "vielfalt_10", name: "Bunter Mix", desc: "Besitze 10 verschiedene Gebäudetypen.", rewardMoney: 200, rewardXp: 60, check: (s) => getBuildingTypeCount(s) >= 10 },
    { id: "vielfalt_20", name: "Allrounder", desc: "Besitze 20 verschiedene Gebäudetypen.", rewardMoney: 400, rewardXp: 120, check: (s) => getBuildingTypeCount(s) >= 20 },
    { id: "vielfalt_30", name: "30 Gebäudetypen", desc: "Besitze 30 verschiedene Gebäudetypen.", rewardMoney: 600, rewardXp: 180, check: (s) => getBuildingTypeCount(s) >= 30 },
    { id: "vielfalt_40", name: "Volles Sortiment", desc: "Besitze 40 verschiedene Gebäudetypen.", rewardMoney: 900, rewardXp: 250, check: (s) => getBuildingTypeCount(s) >= 40 },
    { id: "erstes_upgrade", name: "Erstes Upgrade", desc: "Verbessere ein Gebäude zum ersten Mal.", rewardMoney: 75, rewardXp: 20, check: (s) => (s.stats && s.stats.upgrades >= 1) === true },
    { id: "upgrade_5", name: "5 Upgrades", desc: "Führe 5 Gebäude-Upgrades durch.", rewardMoney: 100, rewardXp: 40, check: (s) => (s.stats && s.stats.upgrades >= 5) === true },
    { id: "upgrade_10", name: "10 Upgrades", desc: "Führe 10 Gebäude-Upgrades durch.", rewardMoney: 180, rewardXp: 70, check: (s) => (s.stats && s.stats.upgrades >= 10) === true },
    { id: "upgrade_25", name: "25 Upgrades", desc: "Führe 25 Gebäude-Upgrades durch.", rewardMoney: 350, rewardXp: 130, check: (s) => (s.stats && s.stats.upgrades >= 25) === true },
    { id: "upgrade_50", name: "50 Upgrades", desc: "Führe 50 Gebäude-Upgrades durch.", rewardMoney: 600, rewardXp: 200, check: (s) => (s.stats && s.stats.upgrades >= 50) === true },
    { id: "upgrade_100", name: "100 Upgrades", desc: "Führe 100 Gebäude-Upgrades durch.", rewardMoney: 1000, rewardXp: 350, check: (s) => (s.stats && s.stats.upgrades >= 100) === true },
    { id: "level_5", name: "Level 5", desc: "Erreiche Spieler-Level 5.", rewardMoney: 100, rewardXp: 50, check: (s) => s.playerLevel >= 5 },
    { id: "level_10", name: "Level 10", desc: "Erreiche Spieler-Level 10.", rewardMoney: 300, rewardXp: 100, check: (s) => s.playerLevel >= 10 },
    { id: "level_15", name: "Level 15", desc: "Erreiche Spieler-Level 15.", rewardMoney: 500, rewardXp: 150, check: (s) => s.playerLevel >= 15 },
    { id: "level_20", name: "Level 20", desc: "Erreiche Spieler-Level 20.", rewardMoney: 800, rewardXp: 200, check: (s) => s.playerLevel >= 20 },
    { id: "level_25", name: "Level 25", desc: "Erreiche Spieler-Level 25.", rewardMoney: 1200, rewardXp: 280, check: (s) => s.playerLevel >= 25 },
    { id: "level_30", name: "Level 30", desc: "Erreiche Spieler-Level 30.", rewardMoney: 1600, rewardXp: 350, check: (s) => s.playerLevel >= 30 },
    { id: "level_35", name: "Level 35", desc: "Erreiche Spieler-Level 35.", rewardMoney: 2000, rewardXp: 420, check: (s) => s.playerLevel >= 35 },
    { id: "level_40", name: "Level 40", desc: "Erreiche Spieler-Level 40.", rewardMoney: 2500, rewardXp: 500, check: (s) => s.playerLevel >= 40 },
    { id: "woche", name: "Erste Woche", desc: "Spiele bis Tag 7.", rewardMoney: 70, rewardXp: 35, check: (s) => s.day >= 7 },
    { id: "monat", name: "Ein Monat", desc: "Spiele bis Tag 30.", rewardMoney: 150, rewardXp: 75, check: (s) => s.day >= 30 },
    { id: "hundert_tage", name: "100 Tage", desc: "Spiele bis Tag 100.", rewardMoney: 300, rewardXp: 150, check: (s) => s.day >= 100 },
    { id: "volles_jahr", name: "Volles Jahr", desc: "Spiele bis Tag 365.", rewardMoney: 500, rewardXp: 250, check: (s) => s.day >= 365 },
    { id: "tag_200", name: "200 Tage", desc: "Spiele bis Tag 200.", rewardMoney: 400, rewardXp: 200, check: (s) => s.day >= 200 },
    { id: "tag_500", name: "500 Tage", desc: "Spiele bis Tag 500.", rewardMoney: 700, rewardXp: 320, check: (s) => s.day >= 500 },
    { id: "tag_1000", name: "1000 Tage", desc: "Spiele bis Tag 1000.", rewardMoney: 1200, rewardXp: 500, check: (s) => s.day >= 1000 },
    { id: "ein_jahr", name: "Jahr 2", desc: "Erreiche Jahr 2.", rewardMoney: 500, rewardXp: 150, check: (s) => s.year >= 2 },
    { id: "jahr_3", name: "Jahr 3", desc: "Erreiche Jahr 3.", rewardMoney: 700, rewardXp: 200, check: (s) => s.year >= 3 },
    { id: "jahr_5", name: "Jahr 5", desc: "Erreiche Jahr 5.", rewardMoney: 1000, rewardXp: 300, check: (s) => s.year >= 5 },
    { id: "jahr_7", name: "Jahr 7", desc: "Erreiche Jahr 7.", rewardMoney: 1300, rewardXp: 380, check: (s) => s.year >= 7 },
    { id: "jahr_10", name: "Jahr 10", desc: "Erreiche Jahr 10.", rewardMoney: 1800, rewardXp: 500, check: (s) => s.year >= 10 },
    { id: "lagerwert_1000", name: "Lager voll", desc: "Ressourcen im Wert von 1.000 $ besitzen.", rewardMoney: 100, rewardXp: 30, check: (s) => getTotalResourceValue(s) >= 1000 },
    { id: "lagerwert_10000", name: "Großes Lager", desc: "Ressourcen im Wert von 10.000 $ besitzen.", rewardMoney: 250, rewardXp: 80, check: (s) => getTotalResourceValue(s) >= 10000 },
    { id: "lagerwert_50000", name: "Ressourcen-Mogul", desc: "Ressourcen im Wert von 50.000 $ besitzen.", rewardMoney: 500, rewardXp: 150, check: (s) => getTotalResourceValue(s) >= 50000 },
    { id: "lagerwert_100000", name: "Lager-Millionär", desc: "Ressourcen im Wert von 100.000 $ besitzen.", rewardMoney: 800, rewardXp: 220, check: (s) => getTotalResourceValue(s) >= 100000 },
    { id: "lagerwert_250000", name: "Ressourcen-Baron", desc: "Ressourcen im Wert von 250.000 $ besitzen.", rewardMoney: 1200, rewardXp: 300, check: (s) => getTotalResourceValue(s) >= 250000 },
    { id: "lagerwert_500000", name: "Ressourcen-König", desc: "Ressourcen im Wert von 500.000 $ besitzen.", rewardMoney: 1800, rewardXp: 400, check: (s) => getTotalResourceValue(s) >= 500000 },
    { id: "lagerwert_million", name: "Ressourcen-Imperium", desc: "Ressourcen im Wert von 1.000.000 $ besitzen.", rewardMoney: 2500, rewardXp: 550, check: (s) => getTotalResourceValue(s) >= 1000000 },
  ];

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
    money: 15000,
    day: 1,
    year: 1,
    playerLevel: 1,
    playerXp: 0,
    goods: {},
    buildings: {},
    log: [],
    achievements: [],
    stats: { soldOnce: false, boughtOnce: false, upgrades: 0 },
  };

  const PRICE_HISTORY_DAYS = 90;

  function initGoods() {
    GOODS.forEach((g) => {
      state.goods[g.id] = { qty: 0, price: g.basePrice, priceHistory: [g.basePrice] };
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
      if (!raw) return { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" }, buildingsShopOnlyUnlocked: false, resourcesOnlyWithStock: false, marketOnlyWithStock: false };
      const d = JSON.parse(raw);
      return {
        activeTab: d.activeTab || "market",
        categoriesOpen: typeof d.categoriesOpen === "object" && d.categoriesOpen !== null ? d.categoriesOpen : {},
        searchQueries: typeof d.searchQueries === "object" && d.searchQueries !== null ? d.searchQueries : { market: "", "buildings-shop": "", "my-buildings": "", resources: "" },
        buildingsShopOnlyUnlocked: d.buildingsShopOnlyUnlocked === true,
        resourcesOnlyWithStock: d.resourcesOnlyWithStock === true,
        marketOnlyWithStock: d.marketOnlyWithStock === true,
      };
    } catch (e) {
      return { activeTab: "market", categoriesOpen: {}, searchQueries: { market: "", "buildings-shop": "", "my-buildings": "", resources: "" }, buildingsShopOnlyUnlocked: false, resourcesOnlyWithStock: false, marketOnlyWithStock: false };
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
      data.playerLevel = typeof data.playerLevel === "number" && data.playerLevel >= 1 ? data.playerLevel : 1;
      data.playerXp = typeof data.playerXp === "number" && data.playerXp >= 0 ? data.playerXp : 0;
      data.goods = data.goods || {};
      GOODS.forEach((g) => {
        const cur = data.goods[g.id];
        const hist = Array.isArray(cur?.priceHistory) ? cur.priceHistory.slice(0, PRICE_HISTORY_DAYS) : [cur?.price ?? g.basePrice];
        data.goods[g.id] = {
          qty: typeof cur?.qty === "number" ? cur.qty : 0,
          price: typeof cur?.price === "number" ? cur.price : g.basePrice,
          previousPrice: typeof cur?.previousPrice === "number" ? cur.previousPrice : undefined,
          priceHistory: hist,
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
      data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
      data.stats = data.stats && typeof data.stats === "object" ? { soldOnce: !!data.stats.soldOnce, boughtOnce: !!data.stats.boughtOnce, upgrades: Math.max(0, parseInt(data.stats.upgrades, 10) || 0) } : { soldOnce: false, boughtOnce: false, upgrades: 0 };
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

  function getPriceChangeBadge(goodId) {
    const data = state.goods[goodId];
    if (!data || data.previousPrice == null || data.previousPrice === undefined) return "";
    const diff = data.price - data.previousPrice;
    if (diff > 0) return '<span class="badge badge-price-change badge-up" title="Preis gestiegen">▲</span>';
    if (diff < 0) return '<span class="badge badge-price-change badge-down" title="Preis gefallen">▼</span>';
    return '<span class="badge badge-price-change badge-same" title="Preis unverändert">●</span>';
  }

  function getPriceChartSvg(goodId) {
    const data = state.goods[goodId];
    const history = data?.priceHistory || [];
    if (history.length === 0) return '<span class="price-chart-empty" title="Noch keine Verlaufswerte">—</span>';
    const w = 80;
    const h = 28;
    const pad = 2;
    const points = history.slice().reverse();
    const minP = Math.min(...points);
    const maxP = Math.max(...points);
    const range = maxP - minP || 1;
    const innerW = w - 2 * pad;
    const innerH = h - 2 * pad;
    const n = points.length;
    const pts = n === 1
      ? `${pad},${h / 2} ${w - pad},${h / 2}`
      : points.map((p, i) => {
          const x = pad + (n > 1 ? (i / (n - 1)) * innerW : 0);
          const y = pad + innerH - ((p - minP) / range) * innerH;
          return `${x},${y}`;
        }).join(" ");
    return `<svg class="price-chart-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" title="Preisverlauf (letzte ${Math.min(n, PRICE_HISTORY_DAYS)} Tage)"><polyline fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" points="${pts}"/></svg>`;
  }

  function getPriceHistoryLabel(i) {
    return i === 0 ? "Heute" : i === 1 ? "Gestern" : `vor ${i} Tagen`;
  }

  function getPriceChartExpandedSvg(goodId) {
    const good = GOODS.find((g) => g.id === goodId);
    const basePrice = good ? good.basePrice : 10;
    const data = state.goods[goodId];
    const history = data?.priceHistory || [];
    const days = PRICE_HISTORY_DAYS;
    const w = 1040;
    const h = 140;
    const pad = 24;
    const innerW = w - 2 * pad;
    const innerH = h - 2 * pad;
    const minY = Math.max(1, Math.round(basePrice * 0.5));
    const maxY = Math.max(1, basePrice * 2);
    const rangeY = maxY - minY || 1;
    const valueToY = (v) => pad + innerH - ((v - minY) / rangeY) * innerH;
    const baselineY = valueToY(basePrice);
    const barGap = 1;
    const barTotalW = innerW / days;
    const barW = Math.max(1, barTotalW - barGap);
    const slots = [];
    for (let i = 0; i < days; i++) {
      const idx = days - 1 - i;
      slots.push(idx < history.length ? history[idx] : null);
    }
    const values = slots.filter((v) => v != null);
    if (values.length === 0) return "<p class=\"chart-expanded-empty\">Noch keine Verlaufswerte.</p>";
    let gridLines = "";
    for (let i = 0; i <= days; i++) {
      const gx = pad + i * barTotalW;
      gridLines += "<line x1=\"" + gx + "\" y1=\"" + pad + "\" x2=\"" + gx + "\" y2=\"" + (pad + innerH) + "\" stroke=\"var(--border)\" stroke-width=\"1\" class=\"chart-grid-line\"/>";
    }
    gridLines += "<line x1=\"" + pad + "\" y1=\"" + pad + "\" x2=\"" + (w - pad) + "\" y2=\"" + pad + "\" stroke=\"var(--border)\" stroke-width=\"1\" class=\"chart-grid-line\"/>";
    gridLines += "<line x1=\"" + pad + "\" y1=\"" + (pad + innerH) + "\" x2=\"" + (w - pad) + "\" y2=\"" + (pad + innerH) + "\" stroke=\"var(--border)\" stroke-width=\"1\" class=\"chart-grid-line\"/>";
    const baselineLine = "<line x1=\"" + pad + "\" y1=\"" + baselineY + "\" x2=\"" + (w - pad) + "\" y2=\"" + baselineY + "\" stroke=\"var(--text-muted)\" stroke-width=\"1\" class=\"chart-baseline\"/>";
    let bars = "";
    for (let i = 0; i < days; i++) {
      const value = slots[i];
      const x = pad + i * barTotalW + barGap / 2;
      const dayLabel = i === days - 1 ? "Heute" : i === days - 2 ? "Gestern" : "vor " + (days - 1 - i) + " Tagen";
      if (value == null) {
        bars += "<rect x=\"" + x + "\" y=\"" + pad + "\" width=\"" + barW + "\" height=\"" + innerH + "\" fill=\"transparent\"><title>Kein Wert – " + dayLabel + "</title></rect>";
        continue;
      }
      const title = formatMoney(value) + " – " + dayLabel + (value > basePrice ? " (über Basis)" : value < basePrice ? " (unter Basis)" : " (Basis)");
      if (value > basePrice) {
        const barTopY = valueToY(value);
        const barHeight = Math.max(1, baselineY - barTopY);
        bars += "<rect class=\"chart-bar chart-bar-up\" x=\"" + x + "\" y=\"" + barTopY + "\" width=\"" + barW + "\" height=\"" + barHeight + "\" fill=\"var(--accent)\"><title>" + escapeHtml(title) + "</title></rect>";
      } else if (value < basePrice) {
        const barBottomY = valueToY(value);
        const barHeight = Math.max(1, barBottomY - baselineY);
        bars += "<rect class=\"chart-bar chart-bar-down\" x=\"" + x + "\" y=\"" + baselineY + "\" width=\"" + barW + "\" height=\"" + barHeight + "\" fill=\"var(--danger)\"><title>" + escapeHtml(title) + "</title></rect>";
      } else {
        const barHeight = 1;
        bars += "<rect class=\"chart-bar chart-bar-base\" x=\"" + x + "\" y=\"" + (baselineY - barHeight / 2) + "\" width=\"" + barW + "\" height=\"" + barHeight + "\" fill=\"var(--text-muted)\"><title>" + escapeHtml(title) + "</title></rect>";
      }
    }
    let hoverRects = "";
    for (let i = 0; i < days; i++) {
      const value = slots[i];
      const hx = pad + i * barTotalW;
      const dayLabel = i === days - 1 ? "Heute" : i === days - 2 ? "Gestern" : "vor " + (days - 1 - i) + " Tagen";
      const hoverTitle = value == null ? "Kein Wert – " + dayLabel : formatMoney(value) + " – " + dayLabel + (value > basePrice ? " (über Basis)" : value < basePrice ? " (unter Basis)" : " (Basis)");
      const hoverClass = value == null ? "chart-bar-hover chart-bar-hover-empty" : value > basePrice ? "chart-bar-hover chart-bar-hover-up" : value < basePrice ? "chart-bar-hover chart-bar-hover-down" : "chart-bar-hover chart-bar-hover-base";
      hoverRects += "<rect x=\"" + hx + "\" y=\"" + pad + "\" width=\"" + barTotalW + "\" height=\"" + innerH + "\" fill=\"transparent\" class=\"" + hoverClass + "\"><title>" + escapeHtml(hoverTitle) + "</title></rect>";
    }
    return "<svg class=\"price-chart-expanded-svg price-chart-bars\" width=\"" + w + "\" height=\"" + h + "\" viewBox=\"0 0 " + w + " " + h + "\" aria-label=\"Preisverlauf letzte " + days + " Tage (Basis: " + formatMoney(basePrice) + ")\">" + gridLines + baselineLine + bars + hoverRects + "</svg>";
  }

  function toggleChartExpand(goodId) {
    if (!uiState.expandedMarketCharts) uiState.expandedMarketCharts = {};
    uiState.expandedMarketCharts[goodId] = !uiState.expandedMarketCharts[goodId];
    render();
  }

  function addLog(msg, type = "") {
    state.log.unshift({
      day: state.day,
      msg,
      type,
    });
    if (state.log.length > 50) state.log.pop();
  }

  function applyAchievementReward(money, xp) {
    if (money > 0) state.money += money;
    if (xp > 0) {
      state.playerXp += xp;
      let required = getXpForNextLevel(state.playerLevel);
      while (state.playerXp >= required) {
        state.playerLevel += 1;
        state.playerXp -= required;
        required = getXpForNextLevel(state.playerLevel);
        addLog(`Level aufgestiegen! Jetzt Level ${state.playerLevel}.`, "income");
      }
    }
  }

  function checkAchievements() {
    const unlocked = state.achievements || [];
    ACHIEVEMENTS.forEach((ach) => {
      if (unlocked.includes(ach.id)) return;
      if (!ach.check(state)) return;
      state.achievements.push(ach.id);
      applyAchievementReward(ach.rewardMoney, ach.rewardXp);
      const rewards = [ach.rewardMoney && formatMoney(ach.rewardMoney), ach.rewardXp && ach.rewardXp + " XP"].filter(Boolean).join(", ");
      addLog(`Erfolg: ${ach.name}! Belohnung: ${rewards}.`, "income");
    });
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
    state.playerXp += XP_PER_DAY;
    let required = getXpForNextLevel(state.playerLevel);
    while (state.playerXp >= required) {
      state.playerLevel += 1;
      state.playerXp -= required;
      required = getXpForNextLevel(state.playerLevel);
      addLog(`Level aufgestiegen! Jetzt Level ${state.playerLevel}.`, "income");
    }
    GOODS.forEach((g) => {
      const slot = state.goods[g.id];
      slot.previousPrice = slot.price;
      slot.price = randomWalk(slot.price);
      const minPrice = Math.max(1, Math.round(g.basePrice * 0.5));
      const maxPrice = Math.max(1, g.basePrice * 2);
      slot.price = Math.max(minPrice, Math.min(slot.price, maxPrice));
      if (!slot.priceHistory) slot.priceHistory = [];
      slot.priceHistory.unshift(slot.price);
      if (slot.priceHistory.length > PRICE_HISTORY_DAYS) slot.priceHistory.pop();
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
    checkAchievements();
    lastTickTime = Date.now();
    saveState();
    render();
  }

  function updateZeitDisplay() {
    const elapsed = (Date.now() - lastTickTime) / 1000;
    const remaining = Math.max(0, Math.ceil(INCOME_INTERVAL_SEC - elapsed));
    const el = document.getElementById("zeit");
    if (el) el.textContent = remaining + " h";
  }

  function startIncomeTimer() {
    lastTickTime = lastTickTime || Date.now();
    setInterval(() => {
      advanceDay();
    }, INCOME_INTERVAL_SEC * 1000);
    setInterval(updateZeitDisplay, 1000);
    updateZeitDisplay();
  }

  function buyGood(goodId, amount) {
    const g = state.goods[goodId];
    const cost = g.price * amount;
    if (cost > state.money || amount <= 0) return;
    if (!state.stats) state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    state.stats.boughtOnce = true;
    state.money -= cost;
    g.qty += amount;
    addLog(
      `${amount} ${GOODS.find((x) => x.id === goodId).name} gekauft für ${formatMoney(cost)}`,
      "spend"
    );
    checkAchievements();
    saveState();
    render();
  }

  function sellGood(goodId, amount) {
    const g = state.goods[goodId];
    const sellQty = Math.min(amount, g.qty);
    if (sellQty <= 0) return;
    if (!state.stats) state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    state.stats.soldOnce = true;
    const revenue = g.price * sellQty;
    state.money += revenue;
    g.qty -= sellQty;
    const goodName = GOODS.find((x) => x.id === goodId).name;
    addLog(`${sellQty} ${goodName} verkauft für ${formatMoney(revenue)}`, "sell");
    checkAchievements();
    saveState();
    render();
  }

  function getBuildingCost(type) {
    const def = BUILDING_TYPES[type];
    const count = state.buildings[type]?.count || 0;
    return def.baseCost + count * 4500;
  }

  function getBuildingMinLevel(type) {
    const def = BUILDING_TYPES[type];
    if (!def) return 1;
    if (typeof def.minLevel === "number" && def.minLevel >= 1) return def.minLevel;
    if (type === "farm" || type === "sawmill" || type === "mine") return 1;
    return Math.min(25, 2 + Math.floor(def.baseCost / 12000));
  }

  function buyBuilding(type) {
    const minLevel = getBuildingMinLevel(type);
    if (state.playerLevel < minLevel) return;
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
    checkAchievements();
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
    if (!state.stats) state.stats = { soldOnce: false, boughtOnce: false, upgrades: 0 };
    state.stats.upgrades = (state.stats.upgrades || 0) + 1;
    addLog(
      `${name} (alle ${slot.count}) auf Stufe ${slot.level} verbessert für ${formatMoney(cost)}`,
      "spend"
    );
    checkAchievements();
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

    const xpNeeded = getXpForNextLevel(state.playerLevel);
    const pct = xpNeeded > 0 ? Math.min(100, (state.playerXp / xpNeeded) * 100) : 0;
    document.getElementById("player-level").textContent = state.playerLevel;
    document.getElementById("player-level-bar").style.width = pct + "%";
    document.getElementById("player-xp-text").textContent = `${state.playerXp} / ${xpNeeded} XP`;
    updateZeitDisplay();

    const tabMarket = "market";
    const searchMarket = getSearchQuery(tabMarket);
    const marketOnlyWithStock = !!uiState.marketOnlyWithStock;
    const marketCategories = getGoodsByCategory()
      .map(({ category, goods }) => {
        let list = searchMarket ? goods.filter((g) => g.name.toLowerCase().includes(searchMarket)) : goods;
        if (marketOnlyWithStock) list = list.filter((g) => (state.goods[g.id]?.qty || 0) > 0);
        return { category, goods: list };
      })
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
        ${goods.map((g) => {
          const expanded = !!(uiState.expandedMarketCharts && uiState.expandedMarketCharts[g.id]);
          return `
        <div class="market-row-wrapper ${expanded ? "expanded" : ""}">
          <div class="market-row">
            <button type="button" class="market-row-name-btn" onclick="window.game.toggleChartExpand('${g.id}')" title="Preisverlauf ${expanded ? "einklappen" : "ausklappen"}">
              <span class="name">${escapeHtml(g.name)}</span>
              <span class="market-row-expand-icon" aria-hidden="true">${expanded ? "▼" : "▶"}</span>
            </button>
            <span class="qty">${state.goods[g.id].qty}</span>
            <span class="market-chart-wrap" title="Preisverlauf">${getPriceChartSvg(g.id)}</span>
            <span class="market-price-wrap">${getPriceChangeBadge(g.id)}<span class="badge badge-price">${formatMoney(state.goods[g.id].price)}</span></span>
            <div class="market-row-divider"></div>
            <div class="actions">
              <button class="btn btn-buy" onclick="window.game.buyGood('${g.id}', 1)" title="Kosten: ${escapeHtml(formatMoney(state.goods[g.id].price * 1))}">+1</button>
              <button class="btn btn-buy" onclick="window.game.buyGood('${g.id}', 10)" title="Kosten: ${escapeHtml(formatMoney(state.goods[g.id].price * 10))}">+10</button>
              <button class="btn btn-buy" onclick="window.game.buyGood('${g.id}', 100)" title="Kosten: ${escapeHtml(formatMoney(state.goods[g.id].price * 100))}">+100</button>
              <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 1)" ${state.goods[g.id].qty < 1 ? "disabled" : ""} title="Verkaufswert: ${escapeHtml(formatMoney(state.goods[g.id].price * Math.min(1, state.goods[g.id].qty)))}">−1</button>
              <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 10)" ${state.goods[g.id].qty < 10 ? "disabled" : ""} title="Verkaufswert: ${escapeHtml(formatMoney(state.goods[g.id].price * Math.min(10, state.goods[g.id].qty)))}">−10</button>
              <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 100)" ${state.goods[g.id].qty < 100 ? "disabled" : ""} title="Verkaufswert: ${escapeHtml(formatMoney(state.goods[g.id].price * Math.min(100, state.goods[g.id].qty)))}">−100</button>
              <button class="btn btn-sell" onclick="window.game.sellGood('${g.id}', 999999999)" ${state.goods[g.id].qty < 1 ? "disabled" : ""} title="Verkaufswert: ${escapeHtml(formatMoney(state.goods[g.id].price * state.goods[g.id].qty))}">Alles</button>
            </div>
          </div>
          ${expanded ? `<div class="market-row-chart-expanded"><div class="market-row-chart-expanded-inner">${getPriceChartExpandedSvg(g.id)}</div></div>` : ""}
        </div>
        `;
        }).join("")}
        </div>
      </div>
    `;
      }
    ).join("");

    const tabShop = "buildings-shop";
    const searchShop = getSearchQuery(tabShop);
    const onlyUnlocked = !!uiState.buildingsShopOnlyUnlocked;
    const shopCategories = getBuildingsByCategory()
      .map(({ category, entries }) => {
        let list = searchShop ? entries.filter(([, def]) => def.name.toLowerCase().includes(searchShop)) : entries;
        if (onlyUnlocked) list = list.filter(([type]) => state.playerLevel >= getBuildingMinLevel(type));
        list.sort((a, b) => {
          const la = getBuildingMinLevel(a[0]);
          const lb = getBuildingMinLevel(b[0]);
          if (la !== lb) return la - lb;
          return a[1].name.localeCompare(b[1].name);
        });
        return { category, entries: list };
      })
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
          ${entries.map(([type, def]) => {
            const minLevel = getBuildingMinLevel(type);
            const cost = getBuildingCost(type);
            const canBuy = state.playerLevel >= minLevel && state.money >= cost;
            const levelLocked = state.playerLevel < minLevel;
            return `
          <div class="shop-building ${levelLocked ? "level-locked" : ""}">
            <div class="info"><span class="info-name">${def.name}</span> <span class="info-produces">– produziert ${def.baseOutput} ${getProducedGoodName(type)}/Tick</span> <span class="badge badge-level-req" title="Ab Level ${minLevel}">Lv.${minLevel}</span></div>
            <span class="badge badge-price">${formatMoney(cost)}</span>
            <div class="shop-building-divider"></div>
            <button class="btn btn-build" onclick="window.game.buyBuilding('${type}')" ${!canBuy ? "disabled" : ""} ${levelLocked ? "title=\"Erst ab Level " + minLevel + " verfügbar\"" : ""}>Kaufen</button>
          </div>
          `;
          }).join("")}
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
    const onlyWithStock = !!uiState.resourcesOnlyWithStock;
    const resourcesCategories = getGoodsByCategory()
      .map(({ category, goods }) => {
        let list = searchRes ? goods.filter((g) => g.name.toLowerCase().includes(searchRes)) : goods;
        if (onlyWithStock) list = list.filter((g) => (state.goods[g.id]?.qty || 0) > 0);
        return { category, goods: list };
      })
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

    const achievedSet = new Set(state.achievements || []);
    const achievementsList = document.getElementById("achievements-list");
    const tabAch = "achievements";
    if (achievementsList) {
      const unlockedList = ACHIEVEMENTS.filter((ach) => achievedSet.has(ach.id));
      const lockedList = ACHIEVEMENTS.filter((ach) => !achievedSet.has(ach.id));
      const renderAchievement = (ach, unlocked) => {
        const rewards = [ach.rewardMoney && formatMoney(ach.rewardMoney), ach.rewardXp && ach.rewardXp + " XP"].filter(Boolean).join(" + ");
        return `
          <div class="achievement-item ${unlocked ? "unlocked" : "locked"}">
            <span class="achievement-icon" aria-hidden="true">${unlocked ? "✓" : "○"}</span>
            <div class="achievement-body">
              <span class="achievement-name">${escapeHtml(ach.name)}</span>
              <span class="achievement-desc">${escapeHtml(ach.desc)}</span>
              <span class="achievement-reward">Belohnung: ${rewards}</span>
            </div>
          </div>`;
      };
      const openAbgeschlossen = isCategoryOpen("Abgeschlossene Erfolge", tabAch);
      const openOffen = isCategoryOpen("Offene Erfolge", tabAch);
      achievementsList.innerHTML = `
        <div class="category-block ${openAbgeschlossen ? "" : "collapsed"}">
          <div class="category-header" data-category="Abgeschlossene Erfolge" data-tab="${tabAch}" role="button" tabindex="0">
            <span class="category-chevron">${openAbgeschlossen ? "▼" : "▶"}</span>
            <span class="category-title">Abgeschlossene Erfolge</span>
            <span class="category-count">${unlockedList.length}</span>
          </div>
          <div class="category-content">
            ${unlockedList.length ? unlockedList.map((ach) => renderAchievement(ach, true)).join("") : "<p class=\"achievements-empty\">Noch keine.</p>"}
          </div>
        </div>
        <div class="category-block ${openOffen ? "" : "collapsed"}">
          <div class="category-header" data-category="Offene Erfolge" data-tab="${tabAch}" role="button" tabindex="0">
            <span class="category-chevron">${openOffen ? "▼" : "▶"}</span>
            <span class="category-title">Offene Erfolge</span>
            <span class="category-count">${lockedList.length}</span>
          </div>
          <div class="category-content">
            ${lockedList.length ? lockedList.map((ach) => renderAchievement(ach, false)).join("") : "<p class=\"achievements-empty\">Alle geschafft!</p>"}
          </div>
        </div>`;
    }

    document.querySelectorAll(".tab-search").forEach((input) => {
      const tabId = input.dataset.tab;
      if (uiState.searchQueries && uiState.searchQueries[tabId] !== undefined) input.value = uiState.searchQueries[tabId] || "";
    });
    const filterUnlockedEl = document.getElementById("filter-unlocked-buildings");
    if (filterUnlockedEl) filterUnlockedEl.checked = !!uiState.buildingsShopOnlyUnlocked;
    const filterResourcesStockEl = document.getElementById("filter-resources-stock");
    if (filterResourcesStockEl) filterResourcesStockEl.checked = !!uiState.resourcesOnlyWithStock;
    const filterMarketStockEl = document.getElementById("filter-market-stock");
    if (filterMarketStockEl) filterMarketStockEl.checked = !!uiState.marketOnlyWithStock;

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
    const filterUnlockedCb = document.getElementById("filter-unlocked-buildings");
    if (filterUnlockedCb) {
      filterUnlockedCb.addEventListener("change", function () {
        uiState.buildingsShopOnlyUnlocked = this.checked;
        saveUiState();
        render();
      });
    }
    const filterResourcesStockCb = document.getElementById("filter-resources-stock");
    if (filterResourcesStockCb) {
      filterResourcesStockCb.addEventListener("change", function () {
        uiState.resourcesOnlyWithStock = this.checked;
        saveUiState();
        render();
      });
    }
    const filterMarketStockCb = document.getElementById("filter-market-stock");
    if (filterMarketStockCb) {
      filterMarketStockCb.addEventListener("change", function () {
        uiState.marketOnlyWithStock = this.checked;
        saveUiState();
        render();
      });
    }
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
    toggleChartExpand,
  };

  init();
})();
