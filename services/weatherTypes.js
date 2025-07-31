class WeatherSnapshot {
  constructor({ time, temperature, apparentTemperature, windSpeed, rainProbability, rainAmount, weatherCode, uvIndex }) {
    this.time = time;
    this.temperature = temperature;
    this.apparentTemperature = apparentTemperature;
    this.windSpeed = windSpeed;
    this.rainProbability = rainProbability;
    this.rainAmount = rainAmount;
    this.weatherCode = weatherCode;
    this.uvIndex = uvIndex;
    this.hour = new Date(time).getHours();
  }
}

class WeatherDay {
  constructor(date) {
    this.date = date;
    this.snapshots = [];
  }

  addSnapshot(snapshot) {
    this.snapshots.push(snapshot);
  }
  roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
  }
  getAvgTemp() {
    if (this.snapshots.length === 0) return null;
    const temps = this.snapshots.map(s => s.temperature);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    return this.roundToTwoDecimals(avg);
  }
  getMinTemp() {
    if (this.snapshots.length === 0) return null;
    return Math.min(...this.snapshots.map(s => s.temperature));
  }
  getMaxTemp() {
    if (this.snapshots.length === 0) return null;
    return Math.max(...this.snapshots.map(s => s.temperature));
  }
  getMaxUV() {
    if (this.snapshots.length === 0) return null;
    return Math.max(...this.snapshots.map(s => s.uvIndex));
  }
  getAvgApparentTemp() {
    if (this.snapshots.length === 0) return null;
    const apparentTemps = this.snapshots.map(s => s.apparentTemperature);
    const avg = apparentTemps.reduce((a, b) => a + b, 0) / apparentTemps.length;
    return this.roundToTwoDecimals(avg);
  }
  getAvgRainProbability() {
    if (this.snapshots.length === 0) return null;
    const rainProbability = this.snapshots.map(s => s.rainProbability);
    const avg = rainProbability.reduce((a, b) => a + b,) / rainProbability.length;
    return this.roundToTwoDecimals(avg);
  }
  getAvgRainAmount() {
    if (this.snapshots.length === 0) return null;
    const rainAmount = this.snapshots.map(s => s.rainAmount);
    const avg = rainAmount.reduce((a, b) => a + b) / rainAmount.length;
    return this.roundToTwoDecimals(avg);
  }
  getAvgWindSpeed() {
    if (this.snapshots.length === 0) return null;
    const windSpeed = this.snapshots.map(s => s.windSpeed);
    const avg = windSpeed.reduce((a, b) => a + b,) / windSpeed.length;
    return this.roundToTwoDecimals(avg);
  }
  getColdScore() {
    const temp = this.getAvgApparentTemp();
    const points = [
      { temp: -10, score: 1.0 },
      { temp: 0, score: 0.8 },
      { temp: 5, score: 0.6 },
      { temp: 10, score: 0.4 },
      { temp: 15, score: 0.2 },
      { temp: 20, score: 0.0 }
    ];
    if (temp <= points[0].temp) return points[0].score;
    if (temp >= points[points.length - 1].temp) return points[points.length - 1].score;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (temp >= p1.temp && temp <= p2.temp) {
        const ratio = (temp - p1.temp) / (p2.temp - p1.temp);
        return p1.score + ratio * (p2.score - p1.score);
      }
    }
    return null;
  }
  getRainScore() {
    const rainProbability = this.getAvgRainProbability();
    const rainAmount = this.getAvgRainAmount();
    const clampedPrecip = Math.min(rainAmount, 2.5);
    const rainScore = 0.6 * (rainProbability / 100) + 0.4 * (clampedPrecip / 2.5);
    return Math.min(1.0, Math.max(0.0, rainScore));
  }
  getWindScore() {
    const windSpeed = this.getAvgWindSpeed();
    const beaufortLevels = [
      { max: 1, score: 0.0 },
      { max: 5, score: 0.1 },
      { max: 11, score: 0.2 },
      { max: 19, score: 0.3 },
      { max: 28, score: 0.5 },
      { max: 38, score: 0.7 },
      { max: 49, score: 0.85 },
      { max: 61, score: 1.0 }
    ];
    for (let i = 0; i < beaufortLevels.length; i++) {
      if (windSpeed <= beaufortLevels[i].max) return beaufortLevels[i].score;
    }
    return 1.0;
  }
  getDiscomfortScore() {
    const coldScore = this.getColdScore();
    const rainScore = this.getRainScore();
    const windScore = this.getWindScore();
    const discomfortScore = 0.5 * coldScore + 0.3 * rainScore + 0.2 * windScore;
    return this.roundToTwoDecimals(discomfortScore);
  }
}

module.exports = { WeatherSnapshot, WeatherDay };
