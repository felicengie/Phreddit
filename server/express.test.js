const request = require("supertest");
const express = require("express");

let app;
let server;

beforeAll(() => {
  // Create an Express app
  app = express();

  // Simple route for testing
  app.get("/", (req, res) => {
    res.status(200).send("Server is running");
  });

  // Start the server on port 8000
  server = app.listen(8000, () => console.log("Server started on port 8000"));
});

afterAll(() => {
  // Close the server after tests
  server.close();
});

test("Webserver is listening on port 8000", async () => {
  // Use Supertest to make a request to the server
  const response = await request(app).get("/");
  
  // Assert the response status and content
  expect(response.status).toBe(200);
  expect(response.text).toBe("Server is running");
});
