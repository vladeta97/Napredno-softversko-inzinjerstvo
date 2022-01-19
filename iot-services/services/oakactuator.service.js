"use strict";

module.exports = {
  name: "oakactuator",
  actions: {
    set: {
      params: {
        temp: { type: "number" },
      },
      async handler(ctx) {
        console.log(ctx.params);
        return "Recived data from command";
      },
    },
  },
  events: {
    "actuator.oak": {
      group: "other",
      handler(payload) {
        console.log("Oak stanica prima komandu sa command servisa...");
        console.log("Oak actuatos izvrsava komandu " + payload.command + " ! ");
      },
    },
  },
};
