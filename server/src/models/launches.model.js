const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exoplanet 1",
  rocket: "Explorer 11",
  target: "Kepler-442 b",
  customers: ["NASA", "EXOLET"],
  launchDate: new Date("May 24, 2031"),
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function getOneLaunch(flightNumber) {
  return await launches.findOne(
    {
      flightNumber: flightNumber,
    },
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  try {
    await launches.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const fullLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["NASA", "SpaceX"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(fullLaunch);
}

async function abortLaunch(launch) {
  const aborted = await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  getOneLaunch,
  scheduleNewLaunch,
  abortLaunch,
};
