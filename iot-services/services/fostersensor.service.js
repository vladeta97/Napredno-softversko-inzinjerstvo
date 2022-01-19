"use strict";

module.exports = {
  name: "fostersensor",
  methods: {
    init() {
      var brojac = 0;

      var nizMerenja = [];

      var fs = require("fs"),
        readline = require("readline");

      var rd = readline.createInterface({
        input: fs.createReadStream("./foster.txt"),
        console: false,
      });

      rd.on("line", function (line) {
        nizMerenja.push(line);
      });

      setInterval(() => {
        let a = 20;
        let b = 40;
        let temp = Math.floor((b - a) * Math.random()) + a + this.offset;

        var splitMerenje = nizMerenja[brojac].split(",");
        var porukaObj = {
          stationName: splitMerenje[0],
          measurementTimestamp: splitMerenje[1],
          airTemperature: splitMerenje[2],
          wetBulbTemperature: splitMerenje[3],
          humidity: splitMerenje[4],
          rainIntensity: splitMerenje[5],
          intervalRain: splitMerenje[6],
          totalRain: splitMerenje[7],
          precipitationType: splitMerenje[8],
          windDirection: splitMerenje[9],
          windSpeed: splitMerenje[10],
          maxWindSpeed: splitMerenje[11],
          barometricPressure: splitMerenje[12],
          solarRadiation: splitMerenje[13],
          heading: splitMerenje[14],
          batteryLife: splitMerenje[15],
          measurementId: splitMerenje[17],
        };
        console.log(porukaObj);
        brojac++;
        this.broker.emit("foster.read", porukaObj);
      }, this.interval);
    },
  },
  events: {},
  created() {
    this.interval = 2000;
    this.offset = 0;
    this.init();
  },
};
