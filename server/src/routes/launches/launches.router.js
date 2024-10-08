const express = require("express");
const {
  httpGetAllLaunches,
  httpGetOneLaunch,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.get("/:id", httpGetOneLaunch);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

module.exports = launchesRouter;
