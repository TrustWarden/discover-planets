const express = require("express");
const {
  httpGetAllLaunches,
  httpGetOneLaunch,
  httpAddNewLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.get("/:flightNumber", httpGetOneLaunch);

module.exports = launchesRouter;
