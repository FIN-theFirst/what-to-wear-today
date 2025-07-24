function getClothingRecommendation(weatherDay) {
  if (weatherDay.isRainy() && weatherDay.getAvgTemp() < 10) {
    return "Warme Regenkleidung empfohlen";
  }
  if (weatherDay.isRainy()) {
    return "Regenjacke mitnehmen";
  }
  if (weatherDay.getAvgTemp() > 25) {
    return "Sommerkleidung, Sonnenbrille";
  }
  if (weatherDay.getAvgTemp() < 10) {
    return "Pullover oder Jacke empfohlen";
  }
  return "Normale Kleidung ausreichend";
}

module.exports = { getClothingRecommendation };

