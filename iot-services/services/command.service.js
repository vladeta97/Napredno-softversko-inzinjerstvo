"use strict";
const Influx = require("influx");
var nizKomandi = [];
var fs = require("fs");

module.exports = {
  name: "command",
  actions: {
    read: {
      async handler(ctx) {
        const res = await this.influxBaza.query(`select * from file`);
        let pomNiz = [];
        res.forEach((data) => {
          pomNiz.push(data.command);
        });
        return pomNiz;
      },
    },
    add: {
      params: {
        command: { type: "string" },
      },
      async handler(ctx) {
        try {
          console.log(ctx.params.command);
          this.writeNewCommand(ctx.params.command);
          return ctx.params.command;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
  },
  methods: {
    init() {
      /*const res = await this.influxBaza.query(`select * from file`);
      res.forEach((data) => {
        nizKomandi.push(data.command);
      });
      nizKomandi = res;
      console.log(nizKomandi);*/
    },
    writeNewCommand(writeNewCommand) {
      this.influxBaza.writePoints([
        {
          measurement: "file",
          fields: {
            command: writeNewCommand,
          },
          time: Date.now(),
        },
      ]);
    },
  },
  events: {
    "oak.command": {
      group: "other",
      handler(payload) {
        console.log("Prima komandu sa anilizatora za Oak...", payload);
        this.influxBaza.writePoints([
          {
            measurement: "command",
            fields: {
              commandTo: "Oak",
              commandTimestamp: payload.measurementTimestamp,
              commandName: payload.idCommand,
            },
            time: payload.measurementTimestamp,
          },
        ]);
        this.broker.emit("actuator.oak", {
          command: payload.idCommand,
        });
      },
    },
    "foster.command": {
      group: "other",
      handler(payload) {
        console.log("Prima komandu sa anilizatora za Foster...", payload);
        this.influxBaza.writePoints([
          {
            measurement: "command",
            fields: {
              commandTo: "Foster",
              commandTimestamp: payload.measurementTimestamp,
              commandName: payload.idCommand,
            },
            time: payload.measurementTimestamp,
          },
        ]);
        this.broker.emit("actuator.foster", {
          command: payload.idCommand,
        });
      },
    },
    "sixthree.command": {
      group: "other",
      handler(payload) {
        console.log("Prima komandu sa anilizatora za 63rd...", payload);
        this.influxBaza.writePoints([
          {
            measurement: "command",
            fields: {
              commandTo: "63rd",
              commandTimestamp: payload.measurementTimestamp,
              commandName: payload.idCommand,
            },
            time: payload.measurementTimestamp,
          },
        ]);
        this.broker.emit("actuator.sixthree", {
          command: payload.idCommand,
        });
      },
    },
  },
  created() {
    this.influxBaza = new Influx.InfluxDB({
      host: process.env.INFLUXDB_HOST || "influx",
      database: process.env.INFLUXDB_DATABASE || "bazacommand",
      username: process.env.ADMIN_USER || "admin",
      password: process.env.ADMIN_PASSWORD || "admin",
      schema: [
        {
          measurement: "command",
          fields: {
            commandTo: Influx.FieldType.STRING,
            commandTimestamp: Influx.FieldType.STRING,
            commandName: Influx.FieldType.STRING,
          },
          tags: ["host"],
        },
        {
          measurement: "file",
          fields: {
            command: Influx.FieldType.STRING,
          },
          tags: ["host"],
        },
      ],
    });
    this.influxBaza.getDatabaseNames().then((names) => {
      if (!names.includes("bazacommand")) {
        return this.influxBaza.createDatabase("bazacommand");
      }
      return null;
    });
    this.init();
  },
};
