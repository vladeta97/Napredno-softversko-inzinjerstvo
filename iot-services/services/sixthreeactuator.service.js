"use strict";

module.exports = {
  name: "sixthreeactuator",
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
    "actuator.sixthree": {
      group: "other",
      handler(payload) {
        console.log("63rd stanica prima komandu sa command servisa...");
        console.log(
          "63rd actuatos izvrsava komandu " + payload.command + " ! "
        );
      },
    },
  },
};
