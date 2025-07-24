const { fetchWeather } = require("./services/weather");
const { getClothingRecommendation } = require("./logic/recommendation");

fetchWeather().then(weatherByDay => {
  for (const date in weatherByDay) {
    // const rec = getClothingRecommendation(weatherByDay[date]);
    // console.log(weatherByDay[date]);
    // console.log(weatherByDay[date].date);
    // console.log("AvgTemp: " + weatherByDay[date].getAvgTemp());
    // console.log("AvgApparentTemp: " + weatherByDay[date].getAvgApparentTemp())
    // console.log("AvgRainProb: " + weatherByDay[date].getAvgRainProbability());
    // console.log("windSpeed: " + weatherByDay[date].getAvgWindSpeed());
    // console.log("\n")
    console.log("minTemp: " + weatherByDay[date].getMinTemp());
    console.log("avgTemp: " + weatherByDay[date].getAvgTemp());
    console.log("maxTemp: " + weatherByDay[date].getMaxTemp() + "\n");

    // console.log(`📆 ${date}: ${rec}`);
  }
});
