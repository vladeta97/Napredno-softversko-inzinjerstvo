"use strict";
/*
    1-rain
    2-thunderstorm
    3-freezing rain
    4-mixed/ice
    5-snow
    6-wet snow
    7-mixture of rain and snow
    8-ice pellets
    9-graupel
    10-hail
    11-drizzle
	12-freezing drizzle
	
	#######GRUPNE FUNKCIJE########
	1.) Temperaturna analiza
	2.) Padavine analiza
	3.) Vetar analiza
	4.) Solarna analiza
	5.) Battery analiza

	#######AKCIJE########
	-> Prazna Baterija
	-> Preporuci Kupanje
	-> Zabrani Kupanje
	-> Preporuci Suncanje
	-> Pokreni Zuti Meteoalarm
	-> Pokreni Narandzasti Meteoalarm
	-> Pokreni Crveni Meteoalarm
	-> Pokreni UV Alarm

	stationName: payload.stationName,
	measurementTimestamp: payload.measurementTimestamp,
	airTemperature: payload.airTemperature,
	wetBulbTemperature: payload.wetBulbTemperature,
	humidity: payload.humidity,
	rainIntensity: payload.rainIntensity,
	intervalRain: payload.intervalRain,
	totalRain: payload.totalRain,
	precipitationType:payload.precipitationType,
	windDirection: payload.windDirection,
	windSpeed: payload.windSpeed,
	maxWindSpeed: payload.maxWindSpeed,
	barometricPressure: payload.barometricPressure,
	solarRadiation: payload.solarRadiation,
	heading: payload.heading,
	batteryLife: payload.batteryLife,
	measurementId: payload.measurementId,
*/
const request = require("request");
const Influx = require("influx");

var socket = null;

const express = require("express");
const bodyParser = require("body-parser");
module.exports = {
  name: "analyzer",
  settings: {
    port: process.env.PORT || 3002 || 4444,
  },
  actions: {},
  methods: {
    isValidData(data) {
      if (!data || data == "" || data === "") {
        return false;
      } else return true;
    },
    castDataInNumber(data) {
      return data * 1;
    },
    batteryAnaliza(baterryLife) {
      if (batteryLife < 12) {
        return 100;
      }
      return -100;
    },
    temperaturaAnaliza(airTemp, wetBulbTemp, humidity) {
      //-50 -> -100 poena
      //+40 -> 100 poena
      //0% -> 0.90
      //100% -> 1.1
      var relativeTemp = airTemp + 50;
      var airTempPoints = (relativeTemp * 2) / 0.9;
      var relativeWetBulbTemp = wetBulbTemp + 50;
      var wetBulbTempPoints = (relativeWetBulbTemp * 2) / 0.9;
      var humidityCoef = 0.9 + humidity * 0.002;
      return (airTempPoints + wetBulbTempPoints) * humidityCoef;
    },
    padavineAnaliza(rainIntensity, intervalRain) {
      //1 -> 4 poena
      var relativeRainIntensity = rainIntensity * 4;
      var relativeIntrevalRain = intervalRain * 3;
      return relativeIntrevalRain + relativeRainIntensity;
    },
    vetarAnaliza(windSpeed, maxWindSpeed) {
      var relativeWindSpeed = windSpeed * 4;
      var relativeMaxWindSpeed = maxWindSpeed * 4;
      return relativeMaxWindSpeed + relativeWindSpeed;
    },
    solarRadiationAnaliza(solarRadiation) {
      var relativeSolarRadiation = solarRadiation / 9;
      return relativeSolarRadiation;
    },
    praznaBaterija(batteryLife, stationName, measurementTimestamp) {
      if (this.batteryAnaliza(batteryLife) == 100) {
        console.log(
          "******ALERT****** Prazna Baterija : " +
            batteryLife +
            " na lokaciji : " +
            stationName
        );
        this.posaljiAnalizuUBazu(
          stationName,
          measurementTimestamp,
          "******ALERT****** Prazna Baterija : " +
            batteryLife +
            " na lokaciji : " +
            stationName
        );
        this.emitujKomandu(
          "PRAZNA BATERIJA",
          measurementTimestamp,
          stationName
        );
        socket.emit("alert.client", {
          location: stationName,
          timestamp: measurementTimestamp,
          message: "ALERT : Prazna Baterija : " + batteryLife,
        });
      }
    },
    uvAlarm(solarRadiation, stationName, measurementTimestamp) {
      let val = this.solarRadiationAnaliza(solarRadiation);
      if (val > 85) {
        console.log(
          "ALERT : Povecan Rizik od UV Zracenja : " +
            val +
            " na lokaciji : " +
            stationName
        );
        this.posaljiAnalizuUBazu(
          stationName,
          measurementTimestamp,
          "ALERT : Povecan Rizik od UV Zracenja : " +
            val +
            " na lokaciji : " +
            stationName
        );
        this.emitujKomandu("UV_ALARM", measurementTimestamp, stationName);
        socket.emit("alert.client", {
          location: stationName,
          timestamp: measurementTimestamp,
          message: "ALERT : Povecan Rizik od UV Zracenja : " + val,
        });
      }
    },
    meteoAlarmAnaliza(data) {
      if (
        this.isValidData(data.airTemperature) &&
        this.isValidData(data.wetBulbTemperature) &&
        this.isValidData(data.humidity)
      ) {
        //vrsimo temp analizu
        var tempPoints = this.temperaturaAnaliza(
          data.airTemperature,
          data.wetBulbTemperature,
          data.humidity
        );
        if (tempPoints < 40) {
          //crvevni za hladno
          console.log(
            "******ALERT****** Crveni Meteoalarm na snazi zbog niske temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******ALERT****** Crveni Meteoalarm na snazi zbog niske temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "CRVENI_ALARM_HLADNO",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message:
              "ALERT : Crveni Meteoalarm na snazi zbog niske temperature : " +
              data.airTemperature +
              "C",
          });
        } else if (tempPoints < 67) {
          //narandzasti za hladno
          console.log(
            "******ALERT****** Narandzasti Meteoalarm na snazi zbog niske temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******ALERT****** Narandzasti Meteoalarm na snazi zbog niske temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "NARANDZASTI_ALARM_HLADNO",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message:
              "ALERT : Narandzasti Meteoalarm na snazi zbog niske temperature : " +
              data.airTemperature +
              "C ",
          });
        }

        if (tempPoints > 115) {
          console.log(
            "******ALERT****** Crveni Meteoalarm na snazi zbog visoke temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******ALERT****** Crveni Meteoalarm na snazi zbog visoke temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "CRVENI_ALARM_TOPLO",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message:
              "ALERT : Crveni Meteoalarm na snazi zbog visoke temperature : " +
              data.airTemperature +
              "C  ",
          });
        } else if (tempPoints > 100) {
          console.log(
            "******ALERT****** Narandzasti Meteoalarm na snazi zbog visoke temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******ALERT****** Narandzasti Meteoalarm na snazi zbog visoke temperature : " +
              data.airTemperature +
              "C na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "NARANDZASTI_ALARM_TOPLO",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message:
              "ALERT : Narandzasti Meteoalarm na snazi zbog visoke temperature : " +
              data.airTemperature +
              "C",
          });
        }
      }
      if (
        this.isValidData(data.rainIntensity) &&
        this.isValidData(data.intervalRain) &&
        this.isValidData(data.windSpeed) &&
        this.isValidData(data.maxWindSpeed)
      ) {
        var rainPoints = this.padavineAnaliza(
          data.rainIntensity,
          data.intervalRain
        );
        var windPoints = this.vetarAnaliza(data.windSpeed, data.maxWindSpeed);

        var stormPoints = rainPoints + windPoints;

        if (stormPoints > 500) {
          console.log(
            "******ALERT****** Crveni Meteoalarm na snazi zbog olujnog nevremena : " +
              data.maxWindSpeed +
              " mp/h, " +
              data.rainIntensity +
              "mm/m^2 na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******ALERT****** Crveni Meteoalarm na snazi zbog olujnog nevremena : " +
              data.maxWindSpeed +
              " mp/h, " +
              data.rainIntensity +
              "mm/m^2 na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "CRVENI_ALARM_OLUJA",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message:
              "ALERT : Crveni Meteoalarm na snazi zbog olujnog nevremena : " +
              data.maxWindSpeed +
              " mp/h, " +
              data.rainIntensity +
              "mm/m^2 ",
          });
        } else if (stormPoints > 369) {
          console.log(
            "******ALERT****** Narandzasti Meteoalarm na snazi zbog olujnog nevremena : " +
              data.maxWindSpeed +
              " mp/h, " +
              data.rainIntensity +
              "mm/m^2 na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******ALERT****** Narandzasti Meteoalarm na snazi zbog olujnog nevremena : " +
              data.maxWindSpeed +
              " mp/h, " +
              data.rainIntensity +
              "mm/m^2 na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "NARANDZASTI_ALARM_OLUJA",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message:
              "ALERT : Narandzasti Meteoalarm na snazi zbog olujnog nevremena : " +
              data.maxWindSpeed +
              " mp/h, " +
              data.rainIntensity +
              "mm/m^2 ",
          });
        }
      }
    },
    suncanjeAnaliza(data) {
      if (
        this.isValidData(data.airTemperature) &&
        this.isValidData(data.wetBulbTemperature) &&
        this.isValidData(data.humidity) &&
        this.isValidData(data.solarRadiation)
      ) {
        var tempPoints = this.temperaturaAnaliza(
          data.airTemperature,
          data.wetBulbTemperature,
          data.humidity
        );
        var solarPoints = this.solarRadiationAnaliza(data.solarRadiation) * 3;

        var suncanjePoints = tempPoints + solarPoints;
        if (suncanjePoints > 475) {
          console.log(
            "******OBAVESTENJE****** Suncanje je moguce na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******OBAVESTENJE****** Suncanje je moguce na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "MOGUCE_SUNCANJE",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message: "OBAVESTENJE : Suncanje je moguce",
          });
        }
      }
    },
    kupanjeAnaliza(data) {
      if (
        this.isValidData(data.airTemperature) &&
        this.isValidData(data.wetBulbTemperature) &&
        this.isValidData(data.humidity) &&
        this.isValidData(data.solarRadiation) &&
        this.isValidData(data.windSpeed) &&
        this.isValidData(data.maxWindSpeed) &&
        this.isValidData(data.intervalRain) &&
        this.isValidData(data.rainIntensity)
      ) {
        var tempPoints = this.temperaturaAnaliza(
          data.airTemperature,
          data.wetBulbTemperature,
          data.humidity
        );
        var solarPoints = this.solarRadiationAnaliza(data.solarRadiation) * 2;

        var rainPoints = this.padavineAnaliza(
          data.rainIntensity,
          data.intervalRain
        );
        var windPoints = this.vetarAnaliza(data.windSpeed, data.maxWindSpeed);

        var kupanjePoints =
          tempPoints + solarPoints - (rainPoints + windPoints);
        if (kupanjePoints > 150) {
          console.log(
            "******OBAVESTENJE****** Kupanje je moguce na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******OBAVESTENJE****** Kupanje je moguce na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "DOZVOLA_KUPANJE",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message: "OBAVESTENJE : Kupanje je moguce",
          });
        } else if (kupanjePoints < 65) {
          console.log(
            "******OBAVESTENJE****** Kupanje nije moguce na lokaciji : " +
              data.stationName
          );
          this.posaljiAnalizuUBazu(
            data.stationName,
            data.measurementTimestamp,
            "******OBAVESTENJE****** Kupanje nije moguce na lokaciji : " +
              data.stationName
          );
          this.emitujKomandu(
            "ZABRANA_KUPANJE",
            data.measurementTimestamp,
            data.stationName
          );
          socket.emit("alert.client", {
            location: data.stationName,
            timestamp: data.measurementTimestamp,
            message: "OBAVESTENJE : Kupanje nije moguce ",
          });
        }
      }
    },
    izvrsiAnalize(newData) {
      if (this.isValidData(newData.baterryLife))
        this.praznaBaterija(
          newData.baterryLife,
          newData.stationName,
          newData.measurementTimestamp
        );
      if (this.isValidData(newData.solarRadiation))
        this.uvAlarm(
          newData.solarRadiation,
          newData.stationName,
          newData.measurementTimestamp
        );
      this.meteoAlarmAnaliza(newData);
      this.suncanjeAnaliza(newData);
      this.kupanjeAnaliza(newData);
    },
    posaljiAnalizuUBazu(stationName, measurementTimestamp, commandType) {
      this.influxBaza.writePoints([
        {
          measurement: "analiza",
          fields: {
            stationName: stationName,
            measurementTimestamp: measurementTimestamp,
            commandType: commandType,
          },
          time: measurementTimestamp,
        },
      ]);
    },
    emitujKomandu(id, measurementTimestamp, stationName) {
      var porukaObj = {
        idCommand: id,
        time: measurementTimestamp,
      };
      if (stationName.charAt(0) === "O")
        this.broker.emit("oak.command", porukaObj);
      else if (stationName.charAt(0) === "F")
        this.broker.emit("foster.command", porukaObj);
      else if (stationName.charAt(0) === "6")
        this.broker.emit("sixthree.command", porukaObj);
    },
  },
  events: {
    "data.oak": {
      group: "other",
      handler(payload) {
        console.log("Prima podatak od data servisa o plazi Oak...");
        this.izvrsiAnalize(payload);
      },
    },
    "data.foster": {
      group: "other",
      handler(payload) {
        console.log("Prima podatak od data servisa o plazi Foster...");
        this.izvrsiAnalize(payload);
      },
    },
    "data.sixthree": {
      group: "other",
      handler(payload) {
        console.log("Prima podatak od data servisa o plazi 63rd...");
        this.izvrsiAnalize(payload);
      },
    },
  },
  created() {
    this.influxBaza = new Influx.InfluxDB({
      host: process.env.INFLUXDB_HOST || "influx",
      database: process.env.INFLUXDB_DATABASE || "bazaanaliza",
      username: process.env.ADMIN_USER || "admin",
      password: process.env.ADMIN_PASSWORD || "admin",
      schema: [
        {
          measurement: "analiza",
          fields: {
            stationName: Influx.FieldType.STRING,
            measurementTimestamp: Influx.FieldType.STRING,
            commandType: Influx.FieldType.STRING,
          },
          tags: ["host"],
        },
      ],
    });
    this.influxBaza.getDatabaseNames().then((names) => {
      if (!names.includes("bazaanaliza")) {
        return this.influxBaza.createDatabase("bazaanaliza");
      }
      return null;
    });
    const express = require("express");
    const app = express();
    const port = 3002;
    var http = require("http").createServer(app);
    var cors = require("cors");
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //io
    var io = require("socket.io")(http);

    app.listen(port, () =>
      console.log(`Moji server listening on port ${port}!`)
    );

    http.listen(4444, () =>
      console.log(`Socket server listening on port 4444!`)
    );

    io.on("connection", function (socket) {
      console.log("a user connected");
    });

    socket = io;
  },
};
