// const request = require("supertest");
// const app = require("../src/app");
// const server = require("../src/index");
// const mongoose = require("mongoose");
// const Label = require("../src/models/label");
// const {
//   setupDatabase,
//   labelOne,
//   labelTwo,
//   labelOneId,
//   labelTwoId,
// } = require("./fixtures/db");
// var util = require("util");
// var encoder = new util.TextEncoder("utf-8");

// beforeEach(setupDatabase);

// test("should create new label", async () => {
//   // const response = await request(app)
//   //   .post("/label")
//   //   .send({
//   //     name: "Deportes",
//   //   })
//   //   .expect(201);
//   // console.log(response);
//   // const label = await Label.findById(response.body.label._id);
//   // expect(label).not.toBeNull();
//   // expect(label.name).toEqual("Deportes");
// });

// const api = request(app);

// test("labels response as a json", async () => {
//   await api
//     .get("/labels")
//     .expect(200)
//     .expect("Content-Type", /application\/json/);
// });

// afterAll(() => {
//   mongoose.connection.close();
//   server.close();
// });

test("should get all labels", async () => {});
