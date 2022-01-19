"use strict";

module.exports = {
  name: "fosteractuator",
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
    "actuator.foster": {
      group: "other",
      handler(payload) {
        console.log("Foster stanica prima komandu sa command servisa...");
        console.log(
          "Foster actuatos izvrsava komandu " + payload.command + " ! "
        );
      },
    },
  },
};
