describe("Auth API", () => {
  let token;

  test("POST /api/auth/signup => register new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });



  test("Sanity check for math (just to make sure Jest is working)", () => {
    expect(2 + 2).toBe(4);
  });

  test("POST /api/auth/signup => fail if user exists", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
        password: "123456",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User already exists");
  });


   test("Sanity check for math (just to make sure Jest is working)", () => {
    expect(2 + 2).toBe(4);
  });

  test("POST /api/auth/login => login existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: "testuser",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

 
});
