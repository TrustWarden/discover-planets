const fs = require("fs");
const { parse } = require("csv-parse");

const habitalePlanets = [];

function isHabitalePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] >= 0.36 &&
    planet["koi_insol"] <= 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitalePlanet(data)) {
      habitalePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(habitalePlanets);
    console.log(habitalePlanets.length);
    console.log("Done");
  });
