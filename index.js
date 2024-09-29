const fs = require("fs");
const { parse } = require("csv-parse");

const result = [];

const parser = parse({
  comment: "#",
  columns: true,
});

fs.createReadStream("kepler_data.csv")
  .pipe(parser)
  .on("data", (data) => {
    result.push(data);
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(result);
    console.log("Done");
  });
