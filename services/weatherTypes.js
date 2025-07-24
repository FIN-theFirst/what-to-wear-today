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

  getAvgWindSpeed() {
    if (this.snapshots.length === 0) return null;
    const windSpeed = this.snapshots.map(s => s.windSpeed);
    const avg = windSpeed.reduce((a, b) => a + b,) / windSpeed.length;
    return this.roundToTwoDecimals(avg);
  }
}

module.exports = { WeatherSnapshot, WeatherDay };
