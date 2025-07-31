function getClothingRecommendation(weatherDay) {
  // discomfort score Klamotten
  // 0-0.15 Sehr angenehm
  // 0.15-0.35 Leicht störend
  // 0.35-0.55 Etwas ungemütlich
  // 0.55-0.75 Unangenehm 
  // 0.75-1.0 Sehr Unangenehmg
}
// ClothingWeatherResistanceScore
// 0-0.15 Sehr leicht 
// 0-0.15 Sehr angenehm
// 0.15-0.
// 0.35-0.55 Etwas warm
// 0.55-0.75 angenehm warm 
// 0.75-1.0 Sehr warm

function getRainProtectionAdvice(weatherDay) {
  // Schirm  || (Regenjacke, Übergangsjacke, Winterjacke)
  // Ravg >= 40% >= 0.2mm/h Schrim empfohlen

}
function getSunGlassesAdvice(weatherDay) {
  // Sunglasses 
  // Wenn nicht viel bewölkt
}

module.exports = { getClothingRecommendation };

