const express = require("express");
const {
  httpGetAllLaunches,
  httpGetOneLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);
launchesRouter.get("/launches/:flightNumber", httpGetOneLaunch);

module.exports = launchesRouter;
