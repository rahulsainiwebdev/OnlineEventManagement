import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js"; // your Express app
import Booking from "../../Model/Booking.js";
import User from "../../Model/Signup.js"; // if you have a Signup model

let server;
let token;      // store JWT token for auth
let bookingId;  // store booking ID

beforeAll(async () => {
  // Connect to a test DB
  await mongoose.connect("mongodb://127.0.0.1:27017/booking_test_db");

  server = app.listen(4001); // temporary test server

  const testUser = new User({ username: "rahul", email: "sksaini514715@test.com", password: "12345678" });
  await testUser.save();
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZGE4ZTdhYjg3Nzk0YTZiZjYxOTI3MSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTkxNzY2MTUsImV4cCI6MTc1OTI2MzAxNX0.pckvnfsHupYjN-E9f2aSYCQWFPVbWYGVlNSxaSEquXM"; // replace with real token or mock middleware
});

afterAll(async () => {
  await Booking.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
  server.close();
});

describe("Booking API", () => {
  test("POST /api/booking => create booking", async () => {
    const res = await request(app)
      .post("/api/booking")
      .set("Authorization", `Bearer ${token}`)
      .send({
        serviceName: "Car Repair",
        price: 500,
        address: "Test Address",
        paymentMethod: "Cash"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    bookingId = res.body.data._id; // save for later
  });

  test("GET /api/booking/user => get user's bookings", async () => {
    const res = await request(app)
      .get("/api/booking/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("PUT /api/booking/status/:id => update booking status", async () => {
    const res = await request(app)
      .put(`/api/booking/status/${bookingId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "complete", removeFromTracking: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("archived"); // because removeFromTracking = true
  });

  test("DELETE /api/booking/:id => delete booking", async () => {
    const res = await request(app)
      .delete(`/api/booking/${bookingId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Booking deleted successfully");
  });
});
