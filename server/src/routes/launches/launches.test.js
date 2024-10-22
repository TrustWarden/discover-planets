const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../utils/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("test POST /launches", () => {
    const completedLaunchData = {
      mission: "Send me there!",
      rocket: "Rocketo",
      target: "Kepler-442 b",
      launchDate: "march 03, 2033",
    };

    const launchDataWithoutDate = {
      mission: "Send me there!",
      rocket: "Rocketo",
      target: "Kepler-442 b",
    };

    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completedLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completedLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property.",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(
          Object.assign(launchDataWithoutDate, {
            launchDate: "helloooooo",
          })
        )
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date.",
      });
    });
  });
});
