
import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js"; // your Express app
import Hotel from "../Model/Hotel.js";

let server;
let hotelId;

beforeAll(async () => {
  // Connect to test DB (you can use a separate DB for testing)
  await mongoose.connect("mongodb://127.0.0.1:27017/hotel_test_db");
  server = app.listen(4000); // temporary test server
});

afterAll(async () => {
  await Hotel.deleteMany(); // clean up
  await mongoose.connection.close();
  server.close();
});

describe("Hotel API", () => {
  test("POST /api/hotel/register => create hotel", async () => {
    const res = await request(app)
      .post("/api/hotel/register")
      .send({
        ownerName: "John Doe",
        hotelName: "Test Hotel",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address",
        services: "Room, Food",
        desc: "Nice hotel",
        price: 1000
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.hotel).toHaveProperty("_id");
    hotelId = res.body.hotel._id; // save for later
  });


   test("sample test", () => {
  expect(1 + 1).toBe(2);
});


  test("GET /api/hotel/getHotel => get all hotels", async () => {
    const res = await request(app).get("/api/hotel/getHotel");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("PUT /api/hotel/hotelUpdate/:id => update hotel", async () => {
    const res = await request(app)
      .put(`/api/hotel/hotelUpdate/${hotelId}`)
      .send({ hotelName: "Updated Hotel", price: 1200 });
    expect(res.statusCode).toBe(200);
    expect(res.body.hotel.hotelName).toBe("Updated Hotel");
    expect(res.body.hotel.price).toBe(1200);
  });

  test("DELETE /api/hotel/:id => delete hotel", async () => {
    const res = await request(app).delete(`/api/hotel/${hotelId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hotel deleted successfully");
  });

 
});


