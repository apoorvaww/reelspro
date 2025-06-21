import { Connection } from "mongoose"

//declaring data types inside the global object so it is easier to connect to the database and we can determine database connection.
declare global{
    var mongoose: {
        conn: Connection | null
        promise: Promise<Connection> | null
    }
}

export {};