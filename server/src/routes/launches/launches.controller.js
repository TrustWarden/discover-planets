const { getAllLaunches, getOneLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpGetOneLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);
  console.log(flightNumber);
  return res.status(200).json(getOneLaunch(flightNumber));
}

module.exports = { httpGetAllLaunches, httpGetOneLaunch };
