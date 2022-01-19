"use strict";
const express = require("express");
const bodyParser = require("body-parser");

module.exports = {
  name: "gateway",
  settings: {
    port: process.env.PORT || 3001,
  },
  methods: {
    initRoutes(app) {
      app.get("/allcommands", this.getAllCommands);
      app.get("/recentoak", this.getRecentOak);
      app.get("/recentfoster", this.getRecentFoster);
      app.get("/recentsixthree", this.getRecentSixThree);
      app.post("/addnewcommand", this.postCommand);
      app.get("/alloak", this.getRecentSixThree);
      app.get("/allfoster", this.getRecentSixThree);
      app.get("/allsixthree", this.getRecentSixThree);
    },
    getAllCommands(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("command.read").then((commands) => {
            res.send(commands);
          });
        })
        .catch(this.handleErr(res));
    },
    postCommand(req, res) {
      const body = req.body;
      console.log(body);
      return Promise.resolve()
        .then(() => {
          return this.broker
            .call("command.add", { command: body.command })
            .then((r) => res.send(r));
        })
        .catch(this.handleErr(res));
    },
    getRecentOak(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("serializer.oakrecent").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    getRecentFoster(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("serializer.fosterrecent").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    getRecentSixThree(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("serializer.sixthreerecent").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    getAllOak(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("serializer.alloak").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    getAllFoster(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("serializer.allfoster").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    getAllSixThree(req, res) {
      return Promise.resolve()
        .then(() => {
          return this.broker.call("serializer.allsixthree").then((data) => {
            res.send(data);
          });
        })
        .catch(this.handleErr(res));
    },
    handleErr(res) {
      return (err) => {
        res.status(err.code || 500).send(err.message);
      };
    },
  },
  created() {
    var cors = require("cors");
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    app.listen(this.settings.port);
    this.initRoutes(app);
    this.app = app;
  },
};
