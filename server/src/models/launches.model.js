const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exoplanet 1",
  rocket: "Explorer 11",
  target: "Kepler-1652 b",
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

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["NASA", "SpaceX"],
      upcoming: true,
      success: true,
    })
  );
}

function abortLaunch(launch) {
  launch.success = false;
  launch.upcoming = false;
  return launch;
}

module.exports = {
  getAllLaunches,
  getOneLaunch,
  addNewLaunch,
  abortLaunch,
};
