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

  var scrollBtn = document.getElementById("scroll-to-top");
  if (scrollBtn) {
    var scrollThreshold = 200;
    function updateScrollButton() {
      if (window.scrollY > scrollThreshold) {
        scrollBtn.classList.add("visible");
      } else {
        scrollBtn.classList.remove("visible");
      }
    }
    window.addEventListener("scroll", updateScrollButton, { passive: true });
    updateScrollButton();
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
