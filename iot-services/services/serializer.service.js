"use strict";

const request = require("request");
const Influx = require("influx");

var oakDataArray = [];
var fosterDataArray = [];
var _63rdDataArray = [];
var limit = 15;

module.exports = {
  name: "serializer",
  actions: {
    alloak: {
      async handler(ctx) {
        try {
          const res = await this.influx.query(`select * from oak`);
          return res;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
    allfoster: {
      async handler(ctx) {
        try {
          const res = await this.influx.query(`select * from foster`);
          return res;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
    allsixthree: {
      async handler(ctx) {
        try {
          const res = await this.influx.query(`select * from sixthree`);
          return res;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
    oakrecent: {
      async handler(ctx) {
        try {
          return oakDataArray;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
    fosterrecent: {
      async handler(ctx) {
        try {
          return fosterDataArray;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
    sixthreerecent: {
      async handler(ctx) {
        try {
          return _63rdDataArray;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
  },
  methods: {
    sendTemperature(temp, sensorId) {
      const body = {
        temperature: temp,
        sensorId: sensorId,
        offset: 0,
      };
      console.log(body);
      request.post(
        process.env.ANALYTICS_URL,
        {
          json: body,
        },
        (err, res, body) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(res.statusCode);
          console.log(body);
        }
      );
    },
    pushToArray(data, array, limit) {
      if (array.length > limit) {
        console.log(array.length);
        array.push(data);
        array.shift();
      } else {
        array.push(data);
      }
    },
  },
  events: {
    "oak.read": {
      group: "other",
      handler(payload) {
        this.influxBaza.writePoints([
          {
            measurement: "oak",
            fields: {
              stationName: payload.stationName,
              measurementTimestamp: payload.measurementTimestamp,
              airTemperature: payload.airTemperature,
              wetBulbTemperature: payload.wetBulbTemperature,
              humidity: payload.humidity,
              rainIntensity: payload.rainIntensity,
              intervalRain: payload.intervalRain,
              totalRain: payload.totalRain,
              precipitationType: payload.precipitationType,
              windDirection: payload.windDirection,
              windSpeed: payload.windSpeed,
              maxWindSpeed: payload.maxWindSpeed,
              barometricPressure: payload.barometricPressure,
              solarRadiation: payload.solarRadiation,
              heading: payload.heading,
              batteryLife: payload.batteryLife,
              measurementId: payload.measurementId,
            },
            time: payload.measurementTimestamp,
          },
        ]);
        this.pushToArray(payload, oakDataArray, limit);
        this.broker.emit("data.oak", payload);
      },
    },
    "foster.read": {
      group: "other",
      handler(payload) {
        this.influxBaza.writePoints([
          {
            measurement: "foster",
            fields: {
              stationName: payload.stationName,
              measurementTimestamp: payload.measurementTimestamp,
              airTemperature: payload.airTemperature,
              wetBulbTemperature: payload.wetBulbTemperature,
              humidity: payload.humidity,
              rainIntensity: payload.rainIntensity,
              intervalRain: payload.intervalRain,
              totalRain: payload.totalRain,
              precipitationType: payload.precipitationType,
              windDirection: payload.windDirection,
              windSpeed: payload.windSpeed,
              maxWindSpeed: payload.maxWindSpeed,
              barometricPressure: payload.barometricPressure,
              solarRadiation: payload.solarRadiation,
              heading: payload.heading,
              batteryLife: payload.batteryLife,
              measurementId: payload.measurementId,
            },
            time: payload.measurementTimestamp,
          },
        ]);
        this.pushToArray(payload, fosterDataArray, limit);
        this.broker.emit("data.foster", payload);
      },
    },
    "sixthree.read": {
      group: "other",
      handler(payload) {
        this.influxBaza.writePoints([
          {
            measurement: "sixthree",
            fields: {
              stationName: payload.stationName,
              measurementTimestamp: payload.measurementTimestamp,
              airTemperature: payload.airTemperature,
              wetBulbTemperature: payload.wetBulbTemperature,
              humidity: payload.humidity,
              rainIntensity: payload.rainIntensity,
              intervalRain: payload.intervalRain,
              totalRain: payload.totalRain,
              precipitationType: payload.precipitationType,
              windDirection: payload.windDirection,
              windSpeed: payload.windSpeed,
              maxWindSpeed: payload.maxWindSpeed,
              barometricPressure: payload.barometricPressure,
              solarRadiation: payload.solarRadiation,
              heading: payload.heading,
              batteryLife: payload.batteryLife,
              measurementId: payload.measurementId,
            },
            time: payload.measurementTimestamp,
          },
        ]);
        this.pushToArray(payload, _63rdDataArray, limit);
        this.broker.emit("data.sixthree", payload);
      },
    },
  },
  created() {
    this.influxBaza = new Influx.InfluxDB({
      host: process.env.INFLUXDB_HOST || "influx",
      database: process.env.INFLUXDB_DATABASE || "bazamerenja",
      username: process.env.ADMIN_USER || "admin",
      password: process.env.ADMIN_PASSWORD || "admin",
      schema: [
        {
          measurement: "merenje",
          fields: {
            stationName: Influx.FieldType.STRING,
            measurementTimestamp: Influx.FieldType.STRING,
            airTemperature: Influx.FieldType.STRING,
            wetBulbTemperature: Influx.FieldType.STRING,
            humidity: Influx.FieldType.STRING,
            rainIntensity: Influx.FieldType.STRING,
            intervalRain: Influx.FieldType.STRING,
            totalRain: Influx.FieldType.STRING,
            precipitationType: Influx.FieldType.STRING,
            windDirection: Influx.FieldType.STRING,
            windSpeed: Influx.FieldType.STRING,
            maxWindSpeed: Influx.FieldType.STRING,
            barometricPressure: Influx.FieldType.STRING,
            solarRadiation: Influx.FieldType.STRING,
            heading: Influx.FieldType.STRING,
            batteryLife: Influx.FieldType.STRING,
            measurementId: Influx.FieldType.STRING,
          },
          tags: ["host"],
        },
      ],
    });
    this.influxBaza.getDatabaseNames().then((names) => {
      if (!names.includes("bazamerenja")) {
        return this.influxBaza.createDatabase("bazamerenja");
      }
      return null;
    });
  },
};
