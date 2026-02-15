(function () {
  "use strict";
  const G = window.Game;
  window.game = {
    advanceDay: G.advanceDay,
    buyGood: G.buyGood,
    sellGood: G.sellGood,
    buyBuilding: G.buyBuilding,
    upgradeBuilding: G.upgradeBuilding,
    switchTab: G.switchTab,
    toggleCategory: G.toggleCategory,
    toggleChartExpand: G.toggleChartExpand,
  };
  G.init();
})();
