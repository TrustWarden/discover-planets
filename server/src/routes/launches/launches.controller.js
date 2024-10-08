const {
  getAllLaunches,
  getOneLaunch,
  addNewLaunch,
  abortLaunch,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpGetOneLaunch(req, res) {
  const flightNumber = Number(req.params.id);
  return res.status(200).json(getOneLaunch(flightNumber));
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property.",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date.",
    });
  }

  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.id);

  const launch = getOneLaunch(flightNumber);

  if (launch) {
    const abortedLaunch = abortLaunch(launch);
    return res.status(200).json(abortedLaunch);
  } else {
    return res.status(404).json({
      error: "The flight not found.",
    });
  }
}

module.exports = {
  httpGetAllLaunches,
  httpGetOneLaunch,
  httpAddNewLaunch,
  httpAbortLaunch,
};
