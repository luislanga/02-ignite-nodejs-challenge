import { it, describe, beforeAll, afterAll, beforeEach } from "vitest";
import { app } from "../src/server";
import request from "supertest";
import { randomUUID } from "crypto";
import { execSync } from "child_process";

describe("Meals routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

//   beforeEach(() => {
//     execSync("npm run knex migrate:rollback --all");
//     execSync("npm run knex migrate:latest");
//   });

  it("should be able to create a meal", async () => {
    const userResponse = await request(app.server)
      .post("/users")
      .send({
        name: "test",
        email: `${randomUUID()}@test.com`,
      });
    
    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
      }).expect(201)
  });
});
