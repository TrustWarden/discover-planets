const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Kepler Exoplanet 1",
  rocket: "Explorer 11",
  destination: "Kepler-1652 b",
  customers: ["NASA", "EXOLET"],
  launchDate: new Date("May 24, 2031"),
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function getOneLaunch(flightNumber) {
  return launches.get(flightNumber);
}

module.exports = { getAllLaunches, getOneLaunch };
