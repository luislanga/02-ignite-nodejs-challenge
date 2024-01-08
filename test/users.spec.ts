import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import { app } from "../src/server"
import request from "supertest"
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

describe('Users routes', () => {
    beforeAll(async () => {
      await app.ready()
    })
  
    afterAll(async () => {
      await app.close()
    })
  
    beforeEach(() => {
      execSync('npm run knex migrate:rollback --all')
      execSync('npm run knex migrate:latest')
    })

    it('should be able to create an user', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'test',
                email: `${randomUUID()}@test.com`
            })
            .expect(201)
    })
})