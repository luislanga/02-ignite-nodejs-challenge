import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const userInfo = createUserBodySchema.safeParse(request.body);

    if (userInfo.success === false) {
      return reply.status(400).send("Bad request");
    }

    const { name, email } = userInfo.data;

    const userByEmail = await knex("users").where({ email }).first();

    if (userByEmail) {
      return reply.status(400).send("Email already in use");
    }

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
