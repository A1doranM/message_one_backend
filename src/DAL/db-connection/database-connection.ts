import {Pool} from "pg";

export interface Query {
    name: string,
    text: string;
    values?: Array<any>;
}

export class DatabaseConnectionService {
    constructor() {}

    private static pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "message_one",
        password: "1q2w3e3e2w1q4r",
        port: 5433
    });

    public static async executeQuery(query: Query) {
        const client = await this.pool.connect();
        try {
            const res = await client.query(query.text, query.values);
            return res;
        } catch (err) {
            console.log(err.stack);
            return new Error(err);
        } finally {
            client.release();
        }
    }

    public static disconnect() {
        this.pool.end();
    }
}