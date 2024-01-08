import fastify from "fastify";
import { usersRoutes } from "./routes/users.routes";
import { mealsRoutes } from "./routes/meals.routes"
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, {prefix: 'meals'})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server Running')
})