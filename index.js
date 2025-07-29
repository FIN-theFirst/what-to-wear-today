const { fetchWeather } = require("./services/weather");
const { getClothingRecommendation } = require("./logic/recommendation");

fetchWeather().then(weatherByDay => {
  for (const date in weatherByDay) {
    // const rec = getClothingRecommendation(weatherByDay[date]);
    console.log(weatherByDay[date]);
    console.log(weatherByDay[date].date);
    console.log("AvgTemp: " + weatherByDay[date].getAvgTemp());
    console.log("AvgRainProb: " + weatherByDay[date].getAvgRainProbability());
    console.log("windSpeed: " + weatherByDay[date].getAvgWindSpeed());
    console.log("\n")
    console.log("getAvgRainProbability " + weatherByDay[date].getAvgRainProbability());
    console.log("RainAmount: " + weatherByDay[date].getAvgRainAmount());
    console.log("rainScore: " + weatherByDay[date].getRainScore());
    console.log("windScore: " + weatherByDay[date].getWindScore());
    console.log("rainScore: " + weatherByDay[date].getRainScore());
    console.log("coldScore: " + weatherByDay[date].getColdScore());
    console.log("discomfortScore: " + weatherByDay[date].getDiscomfortScore());




    // console.log(`📆 ${date}: ${rec}`);
  }
});
