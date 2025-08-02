const { fetchWeather } = require("./services/weather");
const { getClothingRecommendation } = require("./logic/recommendation");
const { fetchClothingProfile } = require("./services/clothingProfile.js");

fetchWeather().then(weatherByDay => {
  for (const date in weatherByDay) {
    // const rec = getClothingRecommendation(weatherByDay[date]);
    console.log("AvgTemp: " + weatherByDay[date].getAvgTemp());
    console.log("AvgRainProb: " + weatherByDay[date].getAvgRainProbability());
    console.log("windSpeed: " + weatherByDay[date].getAvgWindSpeed());
    console.log("discomfortScore: " + weatherByDay[date].getDiscomfortScore());
    // console.log(`📆 ${date}: ${rec}`);
  }
});
const userId = 1;

fetchClothingProfile(userId).then(ClothingProfile => {
  console.log(ClothingProfile);
});
