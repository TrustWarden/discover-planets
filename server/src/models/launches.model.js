const axios = require("axios");

const launches = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_DATA_URL = "https://api.spacexdata.com/v5/launches/query";

const launch = {
  flightNumber: 100, // flight_number
  mission: "Kepler Exoplanet 1", // name
  rocket: "Explorer 11", // rocket --need populate
  target: "Kepler-442 b", // -
  customers: ["NASA", "EXOLET"], // payloads.customers[String] --need populate
  launchDate: new Date("May 24, 2031"), // date_local
  upcoming: true, // upcoming
  success: true, // success
};

saveLaunch(launch);

async function populateLaunches() {
  console.log("Downloading launches data...");

  await axios
    .post(SPACEX_DATA_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    })
    .then((res) => {
      launchDocs = res.data.docs;
    })
    .then(() => {
      launchDocs.map(async (launchDoc) => {
        const launch = {
          flightNumber: launchDoc.flight_number,
          mission: launchDoc.name,
          rocket: launchDoc.rocket.name,
          customers: launchDoc.payloads.flatMap((payload) => payload.customers),
          launchDate: new Date(launchDoc.date_local),
          upcoming: launchDoc.upcoming,
          success: launchDoc.success,
        };

        await saveLaunch(launch);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

async function loadLaunchesData() {
  const firstLaunch = await filterAndFindLaunch({
    flightNumber: 1,
    mission: "FalconSat",
    rocket: "Falcon 1",
  });

  if (firstLaunch) {
    console.log("SpaceX data already downloaded!");
  } else {
    await populateLaunches();
  }
}

async function getAllLaunches() {
  return await launches.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function filterAndFindLaunch(filter) {
  return await launches.findOne(filter);
}

async function getOneLaunchById(flightNumber) {
  return await filterAndFindLaunch(
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

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
  loadLaunchesData,
  getAllLaunches,
  getOneLaunchById,
  scheduleNewLaunch,
  abortLaunch,
};
