const {
  getAllLaunches,
  getOneLaunch,
  scheduleNewLaunch,
  abortLaunch,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpGetOneLaunch(req, res) {
  const flightNumber = Number(req.params.id);
  return res.status(200).json(await getOneLaunchById(flightNumber));
}

async function httpAddNewLaunch(req, res) {
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

  await scheduleNewLaunch(launch);
  console.log(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.id);

  const launch = await getOneLaunch(flightNumber);

  console.log(launch);

  if (launch) {
    const abortedLaunch = await abortLaunch(launch);

    if (!abortedLaunch) {
      return res.status(400).json({
        error: "Launch not aborted.",
      });
    }

    return res.status(200).json({
      ok: 1,
    });
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
