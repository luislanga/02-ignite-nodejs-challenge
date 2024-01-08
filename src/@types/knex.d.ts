import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables{
        users: {
            id: string,
            session_id: string,
            name: string,
            email: string
        }

        meals: {
            id: string,
            name: string,
            description: string,
            is_on_diet: boolean,
            date: number
            user_id: string
        }
    }
}