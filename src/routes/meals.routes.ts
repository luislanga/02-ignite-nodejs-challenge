import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
      });

      const date = new Date();

      const { name, description, isOnDiet } = createMealBodySchema.parse(
        request.body
      );

      await knex("meals").insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      });

      return reply.status(201).send();
    }
  );

  // Get all meals from user
  app.get(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex("meals")
        .where("user_id", request.user?.id)
        .orderBy("date", "desc");

      return reply.send({ meals });
    }
  );

  // Get meal by ID
  app.get(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        mealId: z.string().uuid(),
      });

      const { mealId } = paramsSchema.parse(request.params);

      const meal = await knex("meals").where("id", mealId).first();

      if (!meal) {
        return reply.status(404).send("Meal not found");
      }

      reply.send({ meal });
    }
  );

  app.put(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() });

      const { mealId } = paramsSchema.parse(request.params);

      const meal = await knex("meals").where({ id: mealId }).first();

      if (!meal) {
        return reply.status(404).send({ error: "Meal not found" });
      }

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
      });

      const date = new Date();

      const { name, description, isOnDiet } = updateMealBodySchema.parse(
        request.body
      );

      await knex("meals").where({ id: mealId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      });

      return reply.status(204).send();
    }
  );

  app.delete(
    "/:mealId",
    { preHandler: [checkSessionIdExists] },
    async(request, reply) => {
        const paramsSchema = z.object({ mealId: z.string().uuid() })

        const { mealId } = paramsSchema.parse(request.params)

        const meal = await knex('meals').where({ id: mealId }).first()
  
        if (!meal) {
          return reply.status(404).send({ error: 'Meal not found' })
        }

        await knex('meals').where({ id: mealId }).delete()

        return reply.status(204).send()
    }
  );

  // Metrics
}
